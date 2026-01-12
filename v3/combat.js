// D&D Monster Battle - Combat Engine V3
// Team Battles, Manual Mode, Tournament, Statistics

// ==================== GAME STATE ====================
const Game = {
    mode: null,           // '1v1', 'team', 'tournament', 'manual'
    redTeam: [],
    blueTeam: [],
    combatants: [],
    currentTurn: 0,
    round: 1,
    isPaused: false,
    isRunning: false,
    speed: 1000,
    isManual: false,
    playerTeam: 'red',
    tournament: null,
    waitingForPlayer: false,
    selectedTarget: null,

    // Stats persisted to localStorage
    stats: JSON.parse(localStorage.getItem('dndBattleStats3D')) || {
        battles: [],
        wins: {},
        totalBattles: 0,
        totalRounds: 0
    }
};

// ==================== DICE SYSTEM ====================
function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}

function rollDice(notation) {
    if (typeof notation === 'number') return { total: notation, rolls: [notation] };
    const match = notation.match(/(\d+)?d(\d+)([+-]\d+)?/);
    if (!match) return { total: parseInt(notation) || 0, rolls: [] };

    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const mod = parseInt(match[3]) || 0;

    let total = 0;
    const rolls = [];
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    return { total: total + mod, rolls, mod };
}

function getMod(score) {
    return Math.floor((score - 10) / 2);
}

// ==================== STATUS EFFECTS ====================
const STATUS_EFFECTS = {
    frightened: { icon: '😨', color: '#9932cc', desc: 'Disadvantage on attacks while source visible' },
    paralyzed: { icon: '⚡', color: '#ffd700', desc: 'Cannot move or take actions' },
    stunned: { icon: '💫', color: '#ff6600', desc: 'Cannot move, speak, or take actions' },
    charmed: { icon: '💕', color: '#ff69b4', desc: 'Cannot attack charmer' },
    poisoned: { icon: '🤢', color: '#32cd32', desc: 'Disadvantage on attacks and ability checks' },
    blinded: { icon: '🙈', color: '#333333', desc: 'Cannot see, auto-fail sight checks' },
    petrified: { icon: '🗿', color: '#808080', desc: 'Turned to stone' },
    slowed: { icon: '🐌', color: '#4682b4', desc: 'Speed halved, -2 AC' },
    confused: { icon: '❓', color: '#ff00ff', desc: 'Acts randomly' }
};

// ==================== COMBATANT CREATION ====================
function createCombatant(monsterData, team, id) {
    return {
        ...monsterData,
        id,
        team,
        currentHp: monsterData.hp,
        maxHp: monsterData.hp,
        tempHp: 0,
        initiative: 0,
        conditions: [],  // Array of { type, duration, source }
        concentrating: null,
        deathSaves: { success: 0, fail: 0 },
        alive: true,
        legendaryResist: 3,
        legendaryActions: monsterData.legendary || 0,
        legendaryActionsMax: monsterData.legendary || 0,
        specialCharged: true,
        usedReaction: false,
        position: { x: 0, z: 0 }  // For 3D positioning
    };
}

// ==================== TEAM BATTLE LOGIC ====================
function initializeBattle() {
    Game.combatants = [];
    let id = 0;

    // Create combatants for each team
    Game.redTeam.forEach((monster, index) => {
        const combatant = createCombatant(monster, 'red', id++);
        combatant.position = { x: -6 - index * 2, z: -2 + index * 2 };
        Game.combatants.push(combatant);
    });

    Game.blueTeam.forEach((monster, index) => {
        const combatant = createCombatant(monster, 'blue', id++);
        combatant.position = { x: 6 + index * 2, z: -2 + index * 2 };
        Game.combatants.push(combatant);
    });

    // Reset state
    Game.round = 1;
    Game.currentTurn = 0;
    Game.isPaused = false;
    Game.isRunning = true;
    Game.waitingForPlayer = false;
    Game.selectedTarget = null;

    // Roll initiative for all combatants
    Game.combatants.forEach(c => {
        const dexMod = getMod(c.abilities.dex);
        c.initiative = rollD20() + dexMod;
    });

    // Sort by initiative (highest first)
    Game.combatants.sort((a, b) => {
        if (b.initiative !== a.initiative) return b.initiative - a.initiative;
        // Tie-breaker: higher dex goes first
        return getMod(b.abilities.dex) - getMod(a.abilities.dex);
    });

    return Game.combatants;
}

// ==================== TURN EXECUTION ====================
async function executeTurn(attacker, getTarget, onAttack, onDamage, onLog) {
    if (!attacker.alive) return;

    // Start of turn effects
    processStartOfTurn(attacker, onLog);

    // Check if incapacitated
    if (hasCondition(attacker, 'paralyzed') || hasCondition(attacker, 'stunned') || hasCondition(attacker, 'petrified')) {
        onLog(`${attacker.icon} ${attacker.name} is incapacitated!`, 'status');
        return;
    }

    // Regeneration
    if (attacker.regeneration && attacker.currentHp > 0 && attacker.currentHp < attacker.maxHp) {
        const healAmount = Math.min(attacker.regeneration, attacker.maxHp - attacker.currentHp);
        attacker.currentHp += healAmount;
        onLog(`${attacker.icon} ${attacker.name} regenerates ${healAmount} HP!`, 'heal');
    }

    // Recharge abilities
    if (!attacker.specialCharged && attacker.special?.recharge) {
        const roll = rollD20();
        if (roll >= attacker.special.recharge[0]) {
            attacker.specialCharged = true;
            onLog(`${attacker.icon} ${attacker.name}'s ${attacker.special.name} has recharged!`, 'ability');
        }
    }

    // Get living enemies
    const enemies = Game.combatants.filter(c => c.team !== attacker.team && c.alive);
    if (enemies.length === 0) return;

    // Select target (AI or player selection)
    const target = await getTarget(attacker, enemies);
    if (!target) return;

    // Decide action: special ability or attacks
    let usedSpecial = false;

    // Try special ability (if charged and damaging)
    if (attacker.special && attacker.specialCharged && attacker.special.dmg && Math.random() > 0.3) {
        await executeSpecialAbility(attacker, target, enemies, onAttack, onDamage, onLog);
        attacker.specialCharged = false;
        usedSpecial = true;
    }

    // Otherwise use attacks
    if (!usedSpecial && attacker.attacks && attacker.attacks.length > 0) {
        const numAttacks = attacker.multiattack || 1;

        for (let i = 0; i < numAttacks; i++) {
            // Re-check for living enemies (target may have died)
            const currentEnemies = Game.combatants.filter(c => c.team !== attacker.team && c.alive);
            if (currentEnemies.length === 0) break;

            // Smart targeting: switch to alive target if current is dead
            const currentTarget = target.alive ? target : selectBestTarget(attacker, currentEnemies);
            if (!currentTarget) break;

            const attack = attacker.attacks[i % attacker.attacks.length];
            await executeAttack(attacker, currentTarget, attack, onAttack, onDamage, onLog);

            await delay(Game.speed / 4);
        }
    }

    // Eye rays (Beholder)
    if (attacker.eyeRays && attacker.special) {
        for (let i = 0; i < 3; i++) {
            const eyeTarget = enemies[Math.floor(Math.random() * enemies.length)];
            if (eyeTarget && eyeTarget.alive) {
                await executeSpecialAbility(attacker, eyeTarget, enemies, onAttack, onDamage, onLog);
                await delay(Game.speed / 4);
            }
        }
    }

    // Reset reaction
    attacker.usedReaction = false;
}

// ==================== ATTACK EXECUTION ====================
async function executeAttack(attacker, defender, attack, onAttack, onDamage, onLog) {
    const roll = rollD20();
    const hasDisadvantage = hasCondition(attacker, 'frightened') || hasCondition(attacker, 'poisoned');

    // Roll twice for disadvantage, take lower
    let finalRoll = roll;
    if (hasDisadvantage) {
        const roll2 = rollD20();
        finalRoll = Math.min(roll, roll2);
    }

    const toHit = finalRoll + attack.hit;
    const isCrit = finalRoll === 20;
    const isMiss = finalRoll === 1 || (!isCrit && toHit < defender.ac);

    // Trigger attack animation
    onAttack(attacker, defender, attack.type || 'slashing');

    if (isMiss) {
        onLog(`${attacker.icon} ${attack.name} → ${defender.icon}: <span class="dice">${finalRoll}</span>+${attack.hit}=${toHit} vs AC ${defender.ac} — MISS!`, 'miss');
        AudioSystem.playMiss();
        return { hit: false, damage: 0 };
    }

    // Calculate damage
    let damage = rollDice(attack.dmg).total;
    if (isCrit) damage += rollDice(attack.dmg).total;

    // Extra damage
    let extraDamage = 0;
    let extraType = null;
    if (attack.extra) {
        const match = attack.extra.match(/(\d+d\d+)\s*(\w+)?/);
        if (match) {
            extraDamage = rollDice(match[1]).total;
            extraType = match[2] || attack.type;
            if (isCrit) extraDamage += rollDice(match[1]).total;
        }
    }

    // Apply damage (checking immunities/resistances)
    const mainDamage = applyDamage(defender, damage, attack.type || 'slashing', onLog);
    const bonusDamage = extraType ? applyDamage(defender, extraDamage, extraType, onLog, true) : 0;
    const totalDamage = mainDamage + bonusDamage;

    // Log and sound
    const critText = isCrit ? '<strong>CRITICAL!</strong> ' : '';
    const extraText = bonusDamage > 0 ? ` +${bonusDamage} ${extraType}` : '';
    onLog(`${attacker.icon} ${attack.name} → ${defender.icon}: ${critText}<span class="dice">${finalRoll}</span>+${attack.hit}=${toHit} — <strong>${totalDamage}</strong> damage${extraText}`, isCrit ? 'critical' : 'damage');

    AudioSystem.playHit(attack.type || 'slashing', isCrit);
    onDamage(defender, totalDamage, isCrit);

    // Check death
    checkDeath(defender, onLog);

    return { hit: true, damage: totalDamage, critical: isCrit };
}

// ==================== SPECIAL ABILITY EXECUTION ====================
async function executeSpecialAbility(attacker, target, allEnemies, onAttack, onDamage, onLog) {
    const special = attacker.special;

    // Status effect only (no damage)
    if (special.status && !special.dmg) {
        if (special.save) {
            const saved = rollSave(target, special.save.stat, special.save.dc, onLog);
            if (!saved) {
                applyCondition(target, special.status, 3, attacker.id);
                onLog(`${attacker.icon} uses ${special.name}! ${target.icon} is ${special.status}!`, 'status');
            } else {
                onLog(`${attacker.icon} uses ${special.name}! ${target.icon} resists!`, 'miss');
            }
        }
        return;
    }

    // Instant kill (Power Word Kill)
    if (special.instant && special.threshold) {
        if (target.currentHp <= special.threshold) {
            target.currentHp = 0;
            target.alive = false;
            onLog(`${attacker.icon} casts <strong>${special.name}</strong>! ${target.icon} ${target.name} DIES INSTANTLY!`, 'critical');
            onDamage(target, 9999, true);
            AudioSystem.playDeath();
            return;
        } else {
            onLog(`${attacker.icon} casts ${special.name} but ${target.icon} has too many HP!`, 'miss');
            return;
        }
    }

    // Damage-dealing special
    let totalDamage = rollDice(special.dmg).total;

    // Check save
    let saved = false;
    if (special.save) {
        saved = rollSave(target, special.save.stat, special.save.dc, onLog);
    }

    if (saved && special.half !== true) {
        totalDamage = 0;
    } else if (saved) {
        totalDamage = Math.floor(totalDamage / 2);
    }

    // Extra damage (like Hellfire Orb's necrotic)
    if (special.extra && !saved) {
        const extraMatch = special.extra.match(/(\d+d\d+)\s*(\w+)?/);
        if (extraMatch) {
            const extraDmg = rollDice(extraMatch[1]).total;
            totalDamage += applyDamage(target, extraDmg, extraMatch[2] || special.type, onLog, true);
        }
    }

    // AoE: hit all enemies
    if (special.aoe) {
        onLog(`${attacker.icon} uses <strong>${special.name}</strong>!`, 'ability');
        AudioSystem.playBreathWeapon(special.type);
        onAttack(attacker, target, special.type);

        for (const enemy of allEnemies) {
            if (!enemy.alive) continue;
            let dmg = rollDice(special.dmg).total;
            const enemySaved = rollSave(enemy, special.save.stat, special.save.dc, onLog);
            if (enemySaved) dmg = Math.floor(dmg / 2);

            const actualDmg = applyDamage(enemy, dmg, special.type, onLog);
            onDamage(enemy, actualDmg, false);
            checkDeath(enemy, onLog);
        }
        return;
    }

    // Single target
    const actualDamage = applyDamage(target, totalDamage, special.type, onLog);

    onLog(`${attacker.icon} uses <strong>${special.name}</strong>! ${special.desc || ''} — <strong>${actualDamage} ${special.type}</strong>${saved ? ' (saved, half)' : ''}`, 'ability');
    AudioSystem.playBreathWeapon(special.type);
    onAttack(attacker, target, special.type);
    onDamage(target, actualDamage, false);

    // Apply status effect
    if (special.status && !saved) {
        applyCondition(target, special.status, special.stun ? 1 : 3, attacker.id);
    }

    checkDeath(target, onLog);
}

// ==================== DAMAGE APPLICATION ====================
function applyDamage(target, amount, type, onLog, silent = false) {
    if (amount <= 0) return 0;

    // Check immunity
    if (target.immunities && target.immunities.includes(type)) {
        if (!silent) onLog(`${target.icon} is IMMUNE to ${type}!`, 'miss');
        return 0;
    }

    // Fire/Lightning absorption
    if (target.fireAbsorption && type === 'fire') {
        target.currentHp = Math.min(target.maxHp, target.currentHp + amount);
        if (!silent) onLog(`${target.icon} ABSORBS ${amount} fire damage!`, 'heal');
        return 0;
    }
    if (target.lightningAbsorption && type === 'lightning') {
        target.currentHp = Math.min(target.maxHp, target.currentHp + amount);
        if (!silent) onLog(`${target.icon} ABSORBS ${amount} lightning damage!`, 'heal');
        return 0;
    }

    // Check resistance
    if (target.resistances && target.resistances.includes(type)) {
        amount = Math.floor(amount / 2);
        if (!silent) onLog(`${target.icon} resists ${type} (half damage)`, 'miss');
    }

    // Apply damage
    target.currentHp -= amount;
    return amount;
}

function checkDeath(target, onLog) {
    if (target.currentHp <= 0 && target.alive) {
        target.alive = false;
        target.currentHp = 0;
        onLog(`💀 ${target.icon} ${target.name} has been SLAIN!`, 'death');
        AudioSystem.playDeath();
    }
}

// ==================== SAVING THROWS ====================
function rollSave(target, stat, dc, onLog) {
    const roll = rollD20();
    const mod = getMod(target.abilities[stat]);
    const saveBonus = target.saves?.[stat] || mod;
    const total = roll + saveBonus;
    const success = total >= dc;

    // Legendary Resistance
    if (!success && target.legendaryResist > 0 && Math.random() < 0.7) {
        target.legendaryResist--;
        onLog(`${target.icon} uses Legendary Resistance! (${target.legendaryResist} left)`, 'legendary');
        return true;
    }

    onLog(`${target.icon} ${stat.toUpperCase()} save: <span class="dice">${roll}</span>+${saveBonus}=${total} vs DC ${dc} — ${success ? 'SUCCESS' : 'FAIL'}`, success ? 'miss' : 'damage');
    return success;
}

// ==================== CONDITIONS ====================
function applyCondition(target, type, duration, sourceId) {
    // Check condition immunity
    if (target.conditionImmunities && target.conditionImmunities.includes(type)) {
        return false;
    }

    // Remove existing same condition
    target.conditions = target.conditions.filter(c => c.type !== type);

    // Add new condition
    target.conditions.push({ type, duration, sourceId });
    return true;
}

function hasCondition(target, type) {
    return target.conditions.some(c => c.type === type);
}

function processStartOfTurn(combatant, onLog) {
    // Decrement condition durations
    combatant.conditions = combatant.conditions.filter(c => {
        c.duration--;
        if (c.duration <= 0) {
            onLog(`${combatant.icon} is no longer ${c.type}`, 'status');
            return false;
        }
        return true;
    });
}

// ==================== TARGET SELECTION ====================
function selectBestTarget(attacker, enemies) {
    if (enemies.length === 0) return null;

    // Priority: lowest HP percentage
    const sorted = [...enemies].sort((a, b) => {
        const aPercent = a.currentHp / a.maxHp;
        const bPercent = b.currentHp / b.maxHp;
        return aPercent - bPercent;
    });

    // 70% chance to focus weakest, 30% random
    if (Math.random() < 0.7) {
        return sorted[0];
    }
    return enemies[Math.floor(Math.random() * enemies.length)];
}

// ==================== BATTLE FLOW ====================
function checkVictory() {
    const redAlive = Game.combatants.filter(c => c.team === 'red' && c.alive);
    const blueAlive = Game.combatants.filter(c => c.team === 'blue' && c.alive);

    if (redAlive.length === 0) return 'blue';
    if (blueAlive.length === 0) return 'red';
    return null;
}

function getNextCombatant() {
    // Find next living combatant
    for (let i = 0; i < Game.combatants.length; i++) {
        const index = (Game.currentTurn + i) % Game.combatants.length;
        if (Game.combatants[index].alive) {
            return Game.combatants[index];
        }
    }
    return null;
}

function advanceTurn() {
    Game.currentTurn = (Game.currentTurn + 1) % Game.combatants.length;

    // Check if new round
    if (Game.currentTurn === 0) {
        Game.round++;
        // Reset legendary actions
        Game.combatants.forEach(c => {
            c.legendaryActions = c.legendaryActionsMax;
        });
    }
}

// ==================== TOURNAMENT ====================
function initTournament(fighters) {
    // Shuffle fighters
    const shuffled = [...fighters].sort(() => Math.random() - 0.5);

    Game.tournament = {
        fighters: shuffled,
        matches: [],
        currentMatch: 0,
        champion: null
    };

    // Create bracket (8 fighters = 7 matches)
    // Round 1: 4 matches (indices 0-3)
    // Round 2: 2 matches (indices 4-5)
    // Final: 1 match (index 6)
    for (let i = 0; i < 4; i++) {
        Game.tournament.matches.push({
            round: 1,
            fighters: [shuffled[i * 2], shuffled[i * 2 + 1]],
            winner: null
        });
    }
    // Semifinal placeholders
    Game.tournament.matches.push({ round: 2, fighters: [null, null], winner: null });
    Game.tournament.matches.push({ round: 2, fighters: [null, null], winner: null });
    // Final placeholder
    Game.tournament.matches.push({ round: 3, fighters: [null, null], winner: null });

    return Game.tournament;
}

function advanceTournament(winnerIndex) {
    const match = Game.tournament.matches[Game.tournament.currentMatch];
    match.winner = winnerIndex;
    const winner = match.fighters[winnerIndex];

    // Advance winner to next round
    const currentIdx = Game.tournament.currentMatch;

    if (currentIdx < 4) {
        // Quarter-final → Semi-final
        const semiIdx = 4 + Math.floor(currentIdx / 2);
        const slot = currentIdx % 2;
        Game.tournament.matches[semiIdx].fighters[slot] = winner;
    } else if (currentIdx < 6) {
        // Semi-final → Final
        const slot = currentIdx - 4;
        Game.tournament.matches[6].fighters[slot] = winner;
    } else {
        // Tournament complete
        Game.tournament.champion = winner;
    }

    Game.tournament.currentMatch++;
    return Game.tournament;
}

// ==================== STATISTICS ====================
function saveStats(winningTeam, losingTeam, rounds) {
    const winners = winningTeam.map(m => m.name || m.key);
    const losers = losingTeam.map(m => m.name || m.key);

    // Record wins
    winningTeam.forEach(m => {
        const key = m.key || m.name;
        Game.stats.wins[key] = (Game.stats.wins[key] || 0) + 1;
    });

    // Record battle
    Game.stats.battles.push({
        date: new Date().toISOString(),
        winners,
        losers,
        rounds,
        mode: Game.mode
    });

    // Keep only last 100 battles
    if (Game.stats.battles.length > 100) {
        Game.stats.battles = Game.stats.battles.slice(-100);
    }

    Game.stats.totalBattles++;
    Game.stats.totalRounds += rounds;

    // Persist
    localStorage.setItem('dndBattleStats3D', JSON.stringify(Game.stats));
}

function getLeaderboard() {
    return Object.entries(Game.stats.wins)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([key, wins]) => ({
            key,
            monster: MONSTERS[key] || { name: key, icon: '?' },
            wins
        }));
}

function clearStats() {
    Game.stats = { battles: [], wins: {}, totalBattles: 0, totalRounds: 0 };
    localStorage.removeItem('dndBattleStats3D');
}

// ==================== UTILITY ====================
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
