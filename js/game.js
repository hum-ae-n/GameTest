// D&D Monster Battle Simulator V2 - Game Engine

// ==================== AUDIO SYSTEM ====================
const AudioSystem = {
    ctx: null,
    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    play(type) {
        if (!this.ctx) this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const sounds = {
            hit: { freq: 150, type: 'square', dur: 0.1 },
            crit: { freq: 200, type: 'sawtooth', dur: 0.2 },
            miss: { freq: 100, type: 'sine', dur: 0.15 },
            ability: { freq: 400, type: 'sine', dur: 0.3 },
            death: { freq: 80, type: 'square', dur: 0.5 },
            victory: { freq: 523, type: 'sine', dur: 0.8 }
        };

        const s = sounds[type] || sounds.hit;
        osc.frequency.value = s.freq;
        osc.type = s.type;
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + s.dur);
        osc.start();
        osc.stop(this.ctx.currentTime + s.dur);
    }
};

// ==================== DICE SYSTEM ====================
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

function rollD20() { return Math.floor(Math.random() * 20) + 1; }
function getMod(score) { return Math.floor((score - 10) / 2); }
function fmtMod(mod) { return mod >= 0 ? `+${mod}` : `${mod}`; }

// ==================== GAME STATE ====================
const Game = {
    mode: null,
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
    stats: JSON.parse(localStorage.getItem('dndBattleStats')) || { battles: [], wins: {} }
};

// ==================== UI FUNCTIONS ====================
function selectMode(mode) {
    Game.mode = mode;
    Game.isManual = (mode === 'manual');

    document.getElementById('modeSelect').classList.add('hidden');

    if (mode === 'tournament') {
        setupTournamentSelect();
        document.getElementById('tournamentSelect').classList.remove('hidden');
    } else {
        setupTeamSelect(mode);
        document.getElementById('teamSelect').classList.remove('hidden');
    }
}

function backToModes() {
    Game.redTeam = [];
    Game.blueTeam = [];
    Game.isRunning = false;

    document.querySelectorAll('.container > div').forEach(d => d.classList.add('hidden'));
    document.getElementById('modeSelect').classList.remove('hidden');
}

function setupTeamSelect(mode) {
    const maxSize = mode === '1v1' ? 1 : (mode === 'manual' ? 1 : 4);
    const title = mode === '1v1' ? 'Select Your Champions' :
                  mode === 'manual' ? 'Select Your Champion (You control Red)' : 'Build Your Teams (2-4 each)';

    document.getElementById('selectTitle').textContent = title;
    Game.maxTeamSize = maxSize;
    Game.minTeamSize = mode === 'team' ? 2 : 1;

    // Setup type filters
    const filters = document.getElementById('typeFilters');
    filters.innerHTML = '<button class="type-btn active" onclick="filterMonsters(\'All\')">All</button>';
    getMonsterTypes().forEach(type => {
        filters.innerHTML += `<button class="type-btn" onclick="filterMonsters('${type}')">${type}</button>`;
    });

    // Setup slots
    updateTeamSlots('red');
    updateTeamSlots('blue');

    // Setup monster grids
    renderMonsterGrid('redGrid', 'red');
    renderMonsterGrid('blueGrid', 'blue');
}

function updateTeamSlots(team) {
    const slots = document.getElementById(`${team}Slots`);
    const teamArr = team === 'red' ? Game.redTeam : Game.blueTeam;

    slots.innerHTML = '';
    for (let i = 0; i < Game.maxTeamSize; i++) {
        const monster = teamArr[i];
        if (monster) {
            slots.innerHTML += `
                <div class="team-slot filled" onclick="removeFromTeam('${team}', ${i})">
                    <div class="icon">${monster.icon}</div>
                    <div class="name">${monster.name}</div>
                    <div class="remove">✕ Remove</div>
                </div>`;
        } else {
            slots.innerHTML += `<div class="team-slot"><span style="color:#999">Empty</span></div>`;
        }
    }

    checkStartButton();
}

function renderMonsterGrid(gridId, team) {
    const grid = document.getElementById(gridId);
    const teamArr = team === 'red' ? Game.redTeam : Game.blueTeam;
    const otherTeam = team === 'red' ? Game.blueTeam : Game.redTeam;

    grid.innerHTML = '';
    getMonstersByCR().forEach(([key, m]) => {
        const inThisTeam = teamArr.some(t => t.key === key);
        const inOtherTeam = otherTeam.some(t => t.key === key);
        const isFull = teamArr.length >= Game.maxTeamSize;

        grid.innerHTML += `
            <div class="monster-card ${inThisTeam ? 'selected' : ''} ${inOtherTeam || (isFull && !inThisTeam) ? 'in-team' : ''}"
                 onclick="toggleMonster('${key}', '${team}')"
                 style="border-color: ${TYPE_COLORS[m.type] || '#8b4513'}">
                <div class="icon">${m.icon}</div>
                <div class="name">${m.name}</div>
                <div class="cr">CR ${m.cr}</div>
            </div>`;
    });
}

function filterMonsters(type) {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.monster-card').forEach(card => {
        const monsterKey = card.getAttribute('onclick').match(/'([^']+)'/)[1];
        const monster = MONSTERS[monsterKey];
        card.style.display = (type === 'All' || monster.type === type) ? 'block' : 'none';
    });
}

function toggleMonster(key, team) {
    const teamArr = team === 'red' ? Game.redTeam : Game.blueTeam;
    const idx = teamArr.findIndex(m => m.key === key);

    if (idx >= 0) {
        teamArr.splice(idx, 1);
    } else if (teamArr.length < Game.maxTeamSize) {
        teamArr.push({ ...MONSTERS[key], key });
    }

    updateTeamSlots('red');
    updateTeamSlots('blue');
    renderMonsterGrid('redGrid', 'red');
    renderMonsterGrid('blueGrid', 'blue');
}

function removeFromTeam(team, idx) {
    const teamArr = team === 'red' ? Game.redTeam : Game.blueTeam;
    teamArr.splice(idx, 1);
    updateTeamSlots(team);
    renderMonsterGrid('redGrid', 'red');
    renderMonsterGrid('blueGrid', 'blue');
}

function checkStartButton() {
    const btn = document.getElementById('startBattleBtn');
    const redOk = Game.redTeam.length >= Game.minTeamSize;
    const blueOk = Game.blueTeam.length >= Game.minTeamSize;
    btn.disabled = !(redOk && blueOk);
}

// ==================== TOURNAMENT ====================
function setupTournamentSelect() {
    Game.tournament = { fighters: [], matches: [], currentMatch: 0 };

    const filters = document.getElementById('tournamentFilters');
    filters.innerHTML = '<button class="type-btn active" onclick="filterTournament(\'All\')">All</button>';
    getMonsterTypes().forEach(type => {
        filters.innerHTML += `<button class="type-btn" onclick="filterTournament('${type}')">${type}</button>`;
    });

    updateTournamentSlots();
    renderTournamentGrid();
}

function updateTournamentSlots() {
    const slots = document.getElementById('tournamentSlots');
    slots.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const m = Game.tournament.fighters[i];
        if (m) {
            slots.innerHTML += `
                <div class="team-slot filled" onclick="removeTournamentFighter(${i})">
                    <div class="icon">${m.icon}</div>
                    <div class="name">${m.name}</div>
                    <div class="remove">✕</div>
                </div>`;
        } else {
            slots.innerHTML += `<div class="team-slot"><span style="color:#999">#${i + 1}</span></div>`;
        }
    }

    document.getElementById('startTournamentBtn').disabled = Game.tournament.fighters.length !== 8;
}

function renderTournamentGrid() {
    const grid = document.getElementById('tournamentGrid');
    grid.innerHTML = '';
    getMonstersByCR().forEach(([key, m]) => {
        const inTournament = Game.tournament.fighters.some(f => f.key === key);
        grid.innerHTML += `
            <div class="monster-card ${inTournament ? 'selected' : ''}"
                 onclick="toggleTournamentFighter('${key}')"
                 style="border-color: ${TYPE_COLORS[m.type] || '#8b4513'}">
                <div class="icon">${m.icon}</div>
                <div class="name">${m.name}</div>
                <div class="cr">CR ${m.cr}</div>
            </div>`;
    });
}

function filterTournament(type) {
    document.querySelectorAll('#tournamentFilters .type-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('#tournamentGrid .monster-card').forEach(card => {
        const key = card.getAttribute('onclick').match(/'([^']+)'/)[1];
        const monster = MONSTERS[key];
        card.style.display = (type === 'All' || monster.type === type) ? 'block' : 'none';
    });
}

function toggleTournamentFighter(key) {
    const idx = Game.tournament.fighters.findIndex(f => f.key === key);
    if (idx >= 0) {
        Game.tournament.fighters.splice(idx, 1);
    } else if (Game.tournament.fighters.length < 8) {
        Game.tournament.fighters.push({ ...MONSTERS[key], key });
    }
    updateTournamentSlots();
    renderTournamentGrid();
}

function removeTournamentFighter(idx) {
    Game.tournament.fighters.splice(idx, 1);
    updateTournamentSlots();
    renderTournamentGrid();
}

function startTournament() {
    // Shuffle fighters
    const fighters = [...Game.tournament.fighters].sort(() => Math.random() - 0.5);

    // Create bracket
    Game.tournament.matches = [
        // Quarter finals
        { round: 1, fighters: [fighters[0], fighters[1]], winner: null },
        { round: 1, fighters: [fighters[2], fighters[3]], winner: null },
        { round: 1, fighters: [fighters[4], fighters[5]], winner: null },
        { round: 1, fighters: [fighters[6], fighters[7]], winner: null },
        // Semi finals
        { round: 2, fighters: [null, null], winner: null },
        { round: 2, fighters: [null, null], winner: null },
        // Final
        { round: 3, fighters: [null, null], winner: null }
    ];
    Game.tournament.currentMatch = 0;

    document.getElementById('tournamentSelect').classList.add('hidden');
    document.getElementById('tournamentView').classList.remove('hidden');
    renderBracket();
}

function renderBracket() {
    const bracket = document.getElementById('bracket');
    const matches = Game.tournament.matches;

    bracket.innerHTML = `
        <div class="bracket-round">
            <div class="round-label">Quarter Finals</div>
            ${[0,1,2,3].map(i => renderMatch(matches[i], i)).join('')}
        </div>
        <div class="bracket-round">
            <div class="round-label">Semi Finals</div>
            ${[4,5].map(i => renderMatch(matches[i], i)).join('')}
        </div>
        <div class="bracket-round">
            <div class="round-label">FINAL</div>
            ${renderMatch(matches[6], 6)}
        </div>
    `;
}

function renderMatch(match, idx) {
    const isActive = idx === Game.tournament.currentMatch && !match.winner;
    const isCompleted = match.winner !== null;

    return `
        <div class="bracket-match ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
            ${match.fighters.map((f, i) => {
                if (!f) return '<div class="bracket-fighter"><span style="color:#999">TBD</span></div>';
                const isWinner = match.winner === i;
                const isLoser = match.winner !== null && match.winner !== i;
                return `
                    <div class="bracket-fighter ${isWinner ? 'winner' : ''} ${isLoser ? 'loser' : ''}">
                        <span class="icon">${f.icon}</span>
                        <span>${f.name}</span>
                    </div>`;
            }).join('')}
        </div>`;
}

async function runNextMatch() {
    const match = Game.tournament.matches[Game.tournament.currentMatch];
    if (!match || match.winner !== null) return;

    // Setup battle
    Game.redTeam = [{ ...match.fighters[0] }];
    Game.blueTeam = [{ ...match.fighters[1] }];

    document.getElementById('tournamentView').classList.add('hidden');
    await startBattle();
}

function advanceTournament(winnerIdx) {
    const currentIdx = Game.tournament.currentMatch;
    const match = Game.tournament.matches[currentIdx];
    match.winner = winnerIdx;

    // Advance winner to next round
    if (currentIdx < 4) {
        // Quarter final -> Semi final
        const semiIdx = 4 + Math.floor(currentIdx / 2);
        const slot = currentIdx % 2;
        Game.tournament.matches[semiIdx].fighters[slot] = match.fighters[winnerIdx];
    } else if (currentIdx < 6) {
        // Semi final -> Final
        const slot = currentIdx - 4;
        Game.tournament.matches[6].fighters[slot] = match.fighters[winnerIdx];
    }

    Game.tournament.currentMatch++;

    // Check if tournament is over
    if (currentIdx === 6) {
        // Tournament complete!
        setTimeout(() => {
            alert(`🏆 TOURNAMENT CHAMPION: ${match.fighters[winnerIdx].name}! 🏆`);
        }, 500);
    }
}

// ==================== BATTLE SYSTEM ====================
async function startBattle() {
    // Initialize combatants
    Game.combatants = [];
    let id = 0;

    Game.redTeam.forEach(m => {
        Game.combatants.push(createCombatant(m, 'red', id++));
    });
    Game.blueTeam.forEach(m => {
        Game.combatants.push(createCombatant(m, 'blue', id++));
    });

    // Reset state
    Game.round = 1;
    Game.currentTurn = 0;
    Game.isPaused = false;
    Game.isRunning = true;

    // Show arena
    document.getElementById('teamSelect').classList.add('hidden');
    document.getElementById('battleArena').classList.remove('hidden');
    document.getElementById('logContent').innerHTML = '';
    document.getElementById('roundNum').textContent = '1';

    if (Game.isManual) {
        document.getElementById('manualControls').style.display = 'block';
    } else {
        document.getElementById('manualControls').style.display = 'none';
    }

    renderArena();

    // Roll initiative
    log('⚔️ BATTLE BEGINS! ⚔️', 'round');
    Game.combatants.forEach(c => {
        c.initiative = rollD20() + getMod(c.abilities.dex);
        log(`${c.icon} ${c.name} rolls initiative: <span class="dice">${c.initiative}</span>`, 'attack');
    });

    // Sort by initiative
    Game.combatants.sort((a, b) => b.initiative - a.initiative);
    log(`${Game.combatants[0].icon} ${Game.combatants[0].name} goes first!`, 'round');

    await delay(Game.speed);
    runCombat();
}

function createCombatant(monster, team, id) {
    return {
        ...monster,
        id,
        team,
        currentHp: monster.hp,
        maxHp: monster.hp,
        initiative: 0,
        conditions: [],
        legResist: 3,
        legActions: monster.legendary || 0,
        legActionsMax: monster.legendary || 0,
        spellSlots: monster.spells ? monster.spells.reduce((acc, s) => { acc[s.level] = s.slots; return acc; }, {}) : {},
        specials: monster.specials ? monster.specials.map(s => ({ ...s })) : []
    };
}

function renderArena() {
    const redArena = document.getElementById('redTeamArena');
    const blueArena = document.getElementById('blueTeamArena');

    redArena.innerHTML = '';
    blueArena.innerHTML = '';

    Game.combatants.filter(c => c.team === 'red').forEach(c => {
        redArena.innerHTML += renderCombatantCard(c);
    });

    Game.combatants.filter(c => c.team === 'blue').forEach(c => {
        blueArena.innerHTML += renderCombatantCard(c);
    });
}

function renderCombatantCard(c) {
    const hpPercent = Math.max(0, (c.currentHp / c.maxHp) * 100);
    const hpClass = hpPercent <= 25 ? 'critical' : hpPercent <= 50 ? 'low' : '';
    const isDead = c.currentHp <= 0;

    return `
        <div class="arena-combatant ${isDead ? 'dead' : ''}" id="combatant-${c.id}">
            <div class="combatant-icon">${c.icon}</div>
            <div class="combatant-info">
                <div class="combatant-name">${c.name}</div>
                <div class="combatant-status">
                    ${c.conditions.map(cond => `<span class="status-badge ${cond.type}">${cond.type}</span>`).join('')}
                </div>
                <div class="health-bar-container">
                    <div class="health-bar ${hpClass}" style="width: ${hpPercent}%"></div>
                </div>
                <div class="health-text">${Math.max(0, c.currentHp)} / ${c.maxHp}</div>
            </div>
        </div>`;
}

function updateCombatantCard(c) {
    const card = document.getElementById(`combatant-${c.id}`);
    if (card) {
        card.outerHTML = renderCombatantCard(c);
    }
}

// ==================== COMBAT LOOP ====================
async function runCombat() {
    while (Game.isRunning) {
        if (Game.isPaused) {
            await delay(100);
            continue;
        }

        // Check for victory
        const redAlive = Game.combatants.filter(c => c.team === 'red' && c.currentHp > 0);
        const blueAlive = Game.combatants.filter(c => c.team === 'blue' && c.currentHp > 0);

        if (redAlive.length === 0 || blueAlive.length === 0) {
            endBattle(redAlive.length > 0 ? 'red' : 'blue');
            return;
        }

        // New round
        if (Game.currentTurn === 0) {
            log(`═══ ROUND ${Game.round} ═══`, 'round');
            document.getElementById('roundNum').textContent = Game.round;

            // Reset legendary actions
            Game.combatants.forEach(c => {
                c.legActions = c.legActionsMax;
            });
        }

        // Get current combatant
        const attacker = Game.combatants[Game.currentTurn];

        // Skip dead combatants
        if (attacker.currentHp <= 0) {
            Game.currentTurn = (Game.currentTurn + 1) % Game.combatants.length;
            if (Game.currentTurn === 0) Game.round++;
            continue;
        }

        // Highlight active
        document.querySelectorAll('.arena-combatant').forEach(el => el.classList.remove('active'));
        document.getElementById(`combatant-${attacker.id}`)?.classList.add('active');
        document.getElementById('turnIndicator').textContent = `${attacker.icon} ${attacker.name}'s turn`;

        // Process conditions
        processConditions(attacker);

        // Regeneration
        if (attacker.regeneration && attacker.currentHp > 0) {
            attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + attacker.regeneration);
            log(`${attacker.icon} ${attacker.name} regenerates ${attacker.regeneration} HP!`, 'heal');
            updateCombatantCard(attacker);
        }

        // Recharge abilities
        attacker.specials?.forEach(s => {
            if (s.recharge && !s.recharged) {
                const roll = rollD20();
                if (roll >= s.recharge[0]) {
                    s.recharged = true;
                    log(`${attacker.icon} ${attacker.name}'s ${s.name} has recharged!`, 'ability');
                }
            }
        });

        await delay(Game.speed / 2);

        // Check if stunned/paralyzed
        if (hasCondition(attacker, 'paralyzed') || hasCondition(attacker, 'stunned')) {
            log(`${attacker.icon} ${attacker.name} is incapacitated and loses their turn!`, 'status');
        } else if (Game.isManual && attacker.team === Game.playerTeam) {
            // Player's turn - wait for input
            await waitForPlayerAction(attacker);
        } else {
            // AI turn
            await executeTurn(attacker);
        }

        // Legendary actions for enemies
        const enemies = Game.combatants.filter(c => c.team !== attacker.team && c.currentHp > 0 && c.legActions > 0);
        for (const enemy of enemies) {
            if (Math.random() < 0.5 && enemy.legActions > 0 && enemy.legActions) {
                await executeLegendaryAction(enemy, attacker);
            }
        }

        await delay(Game.speed / 2);

        // Next turn
        Game.currentTurn = (Game.currentTurn + 1) % Game.combatants.length;
        if (Game.currentTurn === 0) Game.round++;
    }
}

async function executeTurn(attacker) {
    const enemies = Game.combatants.filter(c => c.team !== attacker.team && c.currentHp > 0);
    if (enemies.length === 0) return;

    const target = enemies[Math.floor(Math.random() * enemies.length)];

    // Try special ability first
    let usedSpecial = false;
    for (const special of (attacker.specials || [])) {
        if (special.recharged !== false && !special.autoStart && !special.eyeRay && special.dmg) {
            await useSpecialAbility(attacker, target, special);
            if (special.recharge) special.recharged = false;
            usedSpecial = true;
            break;
        }
    }

    // Try spell
    if (!usedSpecial && attacker.spells) {
        const spell = selectSpell(attacker, target);
        if (spell) {
            await castSpell(attacker, target, spell);
            usedSpecial = true;
        }
    }

    // Eye rays (Beholder)
    if (attacker.eyeRays && attacker.specials) {
        const rays = attacker.specials.filter(s => s.eyeRay);
        for (let i = 0; i < attacker.eyeRays; i++) {
            const ray = rays[Math.floor(Math.random() * rays.length)];
            const rayTarget = enemies[Math.floor(Math.random() * enemies.length)];
            if (rayTarget && rayTarget.currentHp > 0) {
                await useSpecialAbility(attacker, rayTarget, ray);
            }
            await delay(Game.speed / 4);
        }
        usedSpecial = true;
    }

    // Multiattack or single attack
    if (!usedSpecial) {
        if (attacker.multiattack) {
            log(`${attacker.icon} ${attacker.name} uses <strong>Multiattack</strong>!`, 'attack');
            for (const attackName of attacker.multiattack) {
                const attack = attacker.attacks.find(a => a.name === attackName);
                if (attack) {
                    const currentTarget = enemies.filter(e => e.currentHp > 0)[0];
                    if (currentTarget) {
                        await executeAttack(attacker, currentTarget, attack);
                        await delay(Game.speed / 4);
                    }
                }
            }
        } else if (attacker.attacks?.length > 0) {
            await executeAttack(attacker, target, attacker.attacks[0]);
        }
    }

    // Auto-start abilities (auras)
    for (const special of (attacker.specials || [])) {
        if (special.autoStart && special.dmg) {
            const nearbyEnemies = enemies.filter(e => e.currentHp > 0);
            for (const enemy of nearbyEnemies) {
                const dmg = rollDice(special.dmg).total;
                applyDamage(enemy, dmg, special.type, attacker);
                log(`${enemy.icon} ${enemy.name} takes <strong>${dmg} ${special.type}</strong> from ${special.name}!`, 'damage');
            }
        }
    }
}

async function executeAttack(attacker, defender, attack) {
    const roll = rollD20();
    const toHit = roll + attack.hit;
    const isCrit = roll === 20;
    const isMiss = roll === 1 || (!isCrit && toHit < defender.ac);

    // Check for disadvantage from conditions
    const hasDisadvantage = hasCondition(attacker, 'frightened');

    if (isMiss) {
        log(`${attacker.icon} ${attacker.name} attacks ${defender.icon} with <strong>${attack.name}</strong>: ` +
            `<span class="dice">${roll}</span> + ${attack.hit} = ${toHit} vs AC ${defender.ac} — MISS!`, 'miss');
        AudioSystem.play('miss');
        return;
    }

    // Calculate damage
    let dmg = rollDice(attack.dmg).total;
    if (isCrit) dmg += rollDice(attack.dmg).total;

    // Extra damage
    let extraDmg = 0;
    let extraText = '';
    if (attack.extra) {
        extraDmg = rollDice(attack.extra.dmg).total;
        if (isCrit) extraDmg += rollDice(attack.extra.dmg).total;

        // Check immunity to extra damage
        if (!defender.immunities?.includes(attack.extra.type)) {
            extraText = ` + ${extraDmg} ${attack.extra.type}`;
        } else {
            extraDmg = 0;
            extraText = ` (immune to ${attack.extra.type})`;
        }
    }

    const totalDmg = applyDamage(defender, dmg + extraDmg, attack.type, attacker);

    log(`${attacker.icon} ${attacker.name} ${isCrit ? '<strong>CRITICAL HIT!</strong>' : 'hits'} ${defender.icon} with <strong>${attack.name}</strong>: ` +
        `<span class="dice">${roll}</span> + ${attack.hit} = ${toHit} — <strong>${totalDmg} ${attack.type}${extraText}</strong>`,
        isCrit ? 'critical' : 'damage');

    AudioSystem.play(isCrit ? 'crit' : 'hit');
    showDamagePopup(defender.id, totalDmg, isCrit);
    hitEffect(defender.id);

    // Status effect from attack
    if (attack.status && attack.statusSave) {
        const save = rollSave(defender, attack.statusSave.stat, attack.statusSave.dc);
        if (!save) {
            applyCondition(defender, attack.status, 3);
        }
    }
}

async function useSpecialAbility(attacker, defender, ability) {
    if (ability.noDirectDamage || !ability.dmg) {
        // Status effect only
        if (ability.save && ability.status) {
            const saved = rollSave(defender, ability.save.stat, ability.save.dc);
            if (!saved) {
                applyCondition(defender, ability.status, ability.duration || 3);
                log(`${attacker.icon} ${attacker.name} uses <strong>${ability.name}</strong>! ${defender.icon} ${defender.name} is ${ability.status}!`, 'status');
            } else {
                log(`${attacker.icon} ${attacker.name} uses <strong>${ability.name}</strong>! ${defender.icon} ${defender.name} resists!`, 'miss');
            }
        }
        return;
    }

    let dmg = rollDice(ability.dmg).total;
    let saved = false;

    if (ability.save) {
        saved = rollSave(defender, ability.save.stat, ability.save.dc, true);
        log(`${defender.icon} ${defender.name} ${ability.save.stat.toUpperCase()} save: ${saved ? 'SUCCESS!' : 'FAILED!'}`, saved ? 'miss' : 'ability');
    }

    if (saved && !ability.half) {
        dmg = 0;
    } else if (saved && ability.half) {
        dmg = Math.floor(dmg / 2);
    }

    // Extra damage (like Hellfire Orb)
    if (ability.extra && dmg > 0) {
        let extraDmg = rollDice(ability.extra.dmg).total;
        if (saved && ability.half) extraDmg = Math.floor(extraDmg / 2);
        if (!defender.immunities?.includes(ability.extra.type)) {
            dmg += extraDmg;
        }
    }

    if (dmg > 0) {
        const actualDmg = applyDamage(defender, dmg, ability.type, attacker);
        log(`${attacker.icon} ${attacker.name} uses <strong>${ability.name}</strong>! ${ability.desc || ''} — <strong>${actualDmg} ${ability.type}</strong>${saved ? ' (half)' : ''}`, 'ability');
        AudioSystem.play('ability');
        showDamagePopup(defender.id, actualDmg, false);
        hitEffect(defender.id);
    }

    // Apply status
    if (ability.status && !saved) {
        applyCondition(defender, ability.status, ability.duration || 3);
    }
}

function selectSpell(attacker, defender) {
    if (!attacker.spells) return null;

    // Power Word Kill check
    const pwk = attacker.spells.find(s => s.instant && s.threshold);
    if (pwk && defender.currentHp <= pwk.threshold && attacker.spellSlots[pwk.level] > 0) {
        return pwk;
    }

    // Get highest available damaging spell
    const available = attacker.spells
        .filter(s => s.dmg && attacker.spellSlots[s.level] > 0)
        .sort((a, b) => b.level - a.level);

    return available[0] || null;
}

async function castSpell(attacker, defender, spell) {
    attacker.spellSlots[spell.level]--;

    // Instant kill spell
    if (spell.instant && spell.threshold) {
        if (defender.currentHp <= spell.threshold) {
            defender.currentHp = 0;
            log(`${attacker.icon} ${attacker.name} casts <strong>${spell.name}</strong>! ${defender.icon} ${defender.name} is SLAIN INSTANTLY!`, 'critical');
            AudioSystem.play('death');
            updateCombatantCard(defender);
            showDamagePopup(defender.id, 'DEATH', true);
            return;
        } else {
            log(`${attacker.icon} ${attacker.name} casts <strong>${spell.name}</strong> but ${defender.icon} has too many HP!`, 'miss');
            return;
        }
    }

    let dmg = rollDice(spell.dmg).total;
    let saved = false;

    if (spell.save) {
        saved = rollSave(defender, spell.save.stat, spell.save.dc, true);
    }

    if (saved && !spell.half) dmg = 0;
    else if (saved && spell.half) dmg = Math.floor(dmg / 2);

    // Extra damage
    if (spell.extra && dmg > 0) {
        let extra = rollDice(spell.extra.dmg).total;
        if (saved && spell.half) extra = Math.floor(extra / 2);
        dmg += extra;
    }

    if (dmg > 0) {
        const actualDmg = applyDamage(defender, dmg, spell.type, attacker);
        log(`${attacker.icon} ${attacker.name} casts <strong>${spell.name}</strong>! — <strong>${actualDmg} ${spell.type}</strong>${saved ? ' (half)' : ''}`, 'ability');
        AudioSystem.play('ability');
        showDamagePopup(defender.id, actualDmg, false);
        hitEffect(defender.id);
    }

    if (spell.status && !saved) {
        applyCondition(defender, spell.status, spell.duration || 3);
    }
}

async function executeLegendaryAction(monster, trigger) {
    if (!monster.legActions || monster.legActions <= 0) return;
    if (!monster.legActionsMax) return;

    const actions = MONSTERS[monster.key]?.legActions;
    if (!actions || actions.length === 0) return;

    // Pick a random usable action
    const usable = actions.filter(a => a.cost <= monster.legActions);
    if (usable.length === 0) return;

    const action = usable[Math.floor(Math.random() * usable.length)];
    monster.legActions -= action.cost;

    const enemies = Game.combatants.filter(c => c.team !== monster.team && c.currentHp > 0);
    const target = enemies[Math.floor(Math.random() * enemies.length)];
    if (!target) return;

    log(`${monster.icon} ${monster.name} uses <strong>Legendary Action: ${action.name}</strong>!`, 'legendary');

    if (action.attack) {
        const attack = monster.attacks.find(a => a.name === action.attack);
        if (attack) await executeAttack(monster, target, attack);
    } else if (action.dmg) {
        let dmg = rollDice(action.dmg).total;
        if (action.save) {
            const saved = rollSave(target, action.save.stat, action.save.dc);
            if (saved) dmg = Math.floor(dmg / 2);
        }
        const actualDmg = applyDamage(target, dmg, action.type, monster);
        log(`${target.icon} ${target.name} takes <strong>${actualDmg} ${action.type}</strong>!`, 'damage');
        showDamagePopup(target.id, actualDmg);
        hitEffect(target.id);
    }

    if (action.status) {
        applyCondition(target, action.status, action.duration || 1);
    }

    await delay(Game.speed / 2);
}

// ==================== DAMAGE & CONDITIONS ====================
function applyDamage(target, amount, type, attacker) {
    // Check immunity
    if (target.immunities?.includes(type)) {
        log(`${target.icon} ${target.name} is <em>IMMUNE</em> to ${type}!`, 'miss');
        return 0;
    }

    // Fire absorption
    if (target.fireAbsorption && type === 'fire') {
        target.currentHp = Math.min(target.maxHp, target.currentHp + amount);
        log(`${target.icon} ${target.name} <em>ABSORBS</em> ${amount} fire and heals!`, 'heal');
        updateCombatantCard(target);
        return 0;
    }

    // Resistance
    if (target.resistances?.includes(type)) {
        amount = Math.floor(amount / 2);
    }

    target.currentHp -= amount;
    updateCombatantCard(target);

    if (target.currentHp <= 0) {
        log(`💀 ${target.icon} ${target.name} has been SLAIN!`, 'death');
        AudioSystem.play('death');
    }

    return amount;
}

function rollSave(target, stat, dc, useLegRes = false) {
    const roll = rollD20();
    const mod = getMod(target.abilities[stat]);
    const bonus = target.saves?.[stat] || mod;
    const total = roll + bonus;

    // Legendary Resistance
    if (total < dc && useLegRes && target.legResist > 0) {
        if (Math.random() < 0.7) {
            target.legResist--;
            log(`${target.icon} ${target.name} uses <strong>Legendary Resistance</strong>! (${target.legResist} left)`, 'legendary');
            return true;
        }
    }

    return total >= dc;
}

function applyCondition(target, type, duration) {
    // Check immunity
    if (target.conditionImmunities?.includes(type)) {
        log(`${target.icon} ${target.name} is immune to ${type}!`, 'miss');
        return;
    }

    // Remove existing same condition
    target.conditions = target.conditions.filter(c => c.type !== type);
    target.conditions.push({ type, duration });
    log(`${target.icon} ${target.name} is now <strong>${type}</strong>!`, 'status');
    updateCombatantCard(target);
}

function hasCondition(target, type) {
    return target.conditions.some(c => c.type === type);
}

function processConditions(target) {
    target.conditions = target.conditions.filter(c => {
        c.duration--;
        if (c.duration <= 0) {
            log(`${target.icon} ${target.name} is no longer ${c.type}`, 'status');
            return false;
        }
        return true;
    });
    updateCombatantCard(target);
}

// ==================== MANUAL COMBAT ====================
async function waitForPlayerAction(attacker) {
    return new Promise(resolve => {
        const grid = document.getElementById('actionGrid');
        const enemies = Game.combatants.filter(c => c.team !== attacker.team && c.currentHp > 0);

        grid.innerHTML = '';

        // Add attacks
        attacker.attacks?.forEach(attack => {
            grid.innerHTML += `
                <button class="action-btn" data-action="attack" data-attack="${attack.name}">
                    <div class="action-name">⚔️ ${attack.name}</div>
                    <div class="action-info">+${attack.hit} to hit, ${attack.dmg} ${attack.type}</div>
                </button>`;
        });

        // Add specials
        attacker.specials?.filter(s => s.recharged !== false && s.dmg).forEach(special => {
            grid.innerHTML += `
                <button class="action-btn" data-action="special" data-special="${special.name}">
                    <div class="action-name">✨ ${special.name}</div>
                    <div class="action-info">${special.dmg} ${special.type}${special.recharge ? ' (Recharge)' : ''}</div>
                </button>`;
        });

        // Add spells
        attacker.spells?.filter(s => attacker.spellSlots[s.level] > 0).forEach(spell => {
            grid.innerHTML += `
                <button class="action-btn" data-action="spell" data-spell="${spell.name}">
                    <div class="action-name">📖 ${spell.name}</div>
                    <div class="action-info">${spell.dmg || 'Special'} (Lvl ${spell.level}, ${attacker.spellSlots[spell.level]} slots)</div>
                </button>`;
        });

        // Event handler
        const handleAction = async (e) => {
            const btn = e.target.closest('.action-btn');
            if (!btn) return;

            const action = btn.dataset.action;
            const target = enemies[0]; // Auto-target for simplicity

            grid.removeEventListener('click', handleAction);
            grid.innerHTML = '<p style="text-align:center;color:#666;">Executing action...</p>';

            if (action === 'attack') {
                const attack = attacker.attacks.find(a => a.name === btn.dataset.attack);
                if (attack) await executeAttack(attacker, target, attack);
            } else if (action === 'special') {
                const special = attacker.specials.find(s => s.name === btn.dataset.special);
                if (special) {
                    await useSpecialAbility(attacker, target, special);
                    if (special.recharge) special.recharged = false;
                }
            } else if (action === 'spell') {
                const spell = attacker.spells.find(s => s.name === btn.dataset.spell);
                if (spell) await castSpell(attacker, target, spell);
            }

            resolve();
        };

        grid.addEventListener('click', handleAction);
    });
}

// ==================== BATTLE END ====================
function endBattle(winningTeam) {
    Game.isRunning = false;

    const winners = Game.combatants.filter(c => c.team === winningTeam && c.currentHp > 0);
    const winnerName = winners.length === 1 ? winners[0].name : `${winningTeam.toUpperCase()} TEAM`;
    const winnerIcon = winners.length === 1 ? winners[0].icon : '👥';

    log(`🏆 ${winnerIcon} ${winnerName} is VICTORIOUS! 🏆`, 'round');
    AudioSystem.play('victory');

    // Save stats
    saveStats(winningTeam);

    // Show victory modal
    document.getElementById('victoryIcon').textContent = winnerIcon;
    document.getElementById('victoryName').textContent = winnerName;
    document.getElementById('victoryStats').innerHTML = `
        <p>Rounds: ${Game.round}</p>
        <p>Survivors: ${winners.map(w => `${w.icon} ${w.name} (${w.currentHp}/${w.maxHp} HP)`).join(', ')}</p>
    `;
    document.getElementById('victoryModal').style.display = 'flex';

    // Tournament advancement
    if (Game.tournament && Game.tournament.currentMatch < 7) {
        const winnerIdx = winningTeam === 'red' ? 0 : 1;
        advanceTournament(winnerIdx);
    }
}

function closeVictory() {
    document.getElementById('victoryModal').style.display = 'none';

    if (Game.tournament && Game.tournament.currentMatch < 7) {
        document.getElementById('battleArena').classList.add('hidden');
        document.getElementById('tournamentView').classList.remove('hidden');
        renderBracket();
    } else {
        backToModes();
    }
}

// ==================== STATS ====================
function saveStats(winningTeam) {
    const winners = Game.combatants.filter(c => c.team === winningTeam);
    const losers = Game.combatants.filter(c => c.team !== winningTeam);

    winners.forEach(w => {
        Game.stats.wins[w.key] = (Game.stats.wins[w.key] || 0) + 1;
    });

    Game.stats.battles.push({
        date: new Date().toISOString(),
        winners: winners.map(w => w.name),
        losers: losers.map(l => l.name),
        rounds: Game.round
    });

    // Keep only last 50 battles
    if (Game.stats.battles.length > 50) {
        Game.stats.battles = Game.stats.battles.slice(-50);
    }

    localStorage.setItem('dndBattleStats', JSON.stringify(Game.stats));
}

function showStats() {
    document.getElementById('modeSelect').classList.add('hidden');
    document.getElementById('statsPanel').classList.remove('hidden');

    // Leaderboard
    const leaderboard = document.getElementById('leaderboard');
    const sorted = Object.entries(Game.stats.wins).sort((a, b) => b[1] - a[1]).slice(0, 10);

    if (sorted.length === 0) {
        leaderboard.innerHTML = '<p style="color:#666;text-align:center;">No battles yet!</p>';
    } else {
        leaderboard.innerHTML = sorted.map(([key, wins], i) => {
            const m = MONSTERS[key];
            return `
                <div class="leaderboard-entry">
                    <div class="leaderboard-rank">${i + 1}</div>
                    <div class="leaderboard-icon">${m?.icon || '?'}</div>
                    <div class="leaderboard-name">${m?.name || key}</div>
                    <div class="leaderboard-wins">${wins} wins</div>
                </div>`;
        }).join('');
    }

    // Overall stats
    const overall = document.getElementById('overallStats');
    overall.innerHTML = `
        <div class="stat-row"><span>Total Battles</span><span>${Game.stats.battles.length}</span></div>
        <div class="stat-row"><span>Unique Winners</span><span>${Object.keys(Game.stats.wins).length}</span></div>
        <div class="stat-row"><span>Average Rounds</span><span>${Game.stats.battles.length ? (Game.stats.battles.reduce((a,b) => a + b.rounds, 0) / Game.stats.battles.length).toFixed(1) : 0}</span></div>
    `;

    // Recent battles
    const recent = document.getElementById('recentBattles');
    const recentBattles = Game.stats.battles.slice(-10).reverse();

    if (recentBattles.length === 0) {
        recent.innerHTML = '<p style="color:#666;text-align:center;">No battles yet!</p>';
    } else {
        recent.innerHTML = recentBattles.map(b => `
            <div class="stat-row">
                <span>🏆 ${b.winners.join(', ')}</span>
                <span style="color:#666">vs ${b.losers.join(', ')}</span>
            </div>
        `).join('');
    }
}

function clearStats() {
    if (confirm('Clear all battle statistics?')) {
        Game.stats = { battles: [], wins: {} };
        localStorage.removeItem('dndBattleStats');
        showStats();
    }
}

// ==================== UTILITIES ====================
function log(msg, type = '') {
    const content = document.getElementById('logContent');
    content.innerHTML += `<div class="log-entry ${type}">${msg}</div>`;
    content.scrollTop = content.scrollHeight;
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function showDamagePopup(targetId, damage, isCrit = false) {
    const el = document.getElementById(`combatant-${targetId}`);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const popup = document.createElement('div');
    popup.className = 'damage-popup' + (isCrit ? ' critical' : '');
    popup.textContent = typeof damage === 'number' ? `-${damage}` : damage;
    popup.style.left = (rect.left + rect.width / 2) + 'px';
    popup.style.top = rect.top + 'px';

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

function hitEffect(targetId) {
    const el = document.getElementById(`combatant-${targetId}`);
    if (el) {
        el.classList.add('hit');
        setTimeout(() => el.classList.remove('hit'), 300);
    }
}

function togglePause() {
    Game.isPaused = !Game.isPaused;
    document.getElementById('pauseBtn').textContent = Game.isPaused ? '▶ Resume' : '⏸ Pause';
}

function skipToEnd() {
    Game.speed = 10;
    if (Game.isPaused) togglePause();
}

function updateSpeed() {
    Game.speed = 2000 - (document.getElementById('speedSlider').value * 180);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('D&D Monster Battle Simulator V2 loaded!');
    console.log(`${Object.keys(MONSTERS).length} monsters available`);
});
