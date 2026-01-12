// D&D Monster Database V3 - 50+ Monsters
const MONSTERS = {
    // ==================== DRAGONS ====================
    "ancient-red-dragon": {
        name: "Ancient Red Dragon", icon: "🐉", type: "dragon", cr: 24, hp: 546, ac: 22, color: 0xff3300,
        abilities: { str: 30, dex: 10, con: 29, int: 18, wis: 15, cha: 23 },
        speed: 40, size: "gargantuan",
        attacks: [{ name: "Bite", hit: 17, dmg: "4d10+10", type: "piercing" }, { name: "Claw", hit: 17, dmg: "2d6+10", type: "slashing" }],
        multiattack: 3,
        special: { name: "Fire Breath", dmg: "26d6", type: "fire", save: { stat: "dex", dc: 24 }, recharge: [5,6], desc: "90-foot cone" },
        immunities: ["fire"], legendary: 3
    },
    "ancient-blue-dragon": {
        name: "Ancient Blue Dragon", icon: "🐲", type: "dragon", cr: 23, hp: 481, ac: 22, color: 0x0066ff,
        abilities: { str: 29, dex: 10, con: 27, int: 18, wis: 17, cha: 21 },
        speed: 40, size: "gargantuan",
        attacks: [{ name: "Bite", hit: 16, dmg: "2d10+9", type: "piercing" }, { name: "Claw", hit: 16, dmg: "2d6+9", type: "slashing" }],
        multiattack: 3,
        special: { name: "Lightning Breath", dmg: "16d10", type: "lightning", save: { stat: "dex", dc: 23 }, recharge: [5,6], desc: "120-foot line" },
        immunities: ["lightning"], legendary: 3
    },
    "ancient-green-dragon": {
        name: "Ancient Green Dragon", icon: "🐉", type: "dragon", cr: 22, hp: 385, ac: 21, color: 0x228b22,
        abilities: { str: 27, dex: 12, con: 25, int: 20, wis: 17, cha: 19 },
        speed: 40, size: "gargantuan",
        attacks: [{ name: "Bite", hit: 15, dmg: "2d10+8", type: "piercing" }, { name: "Claw", hit: 15, dmg: "2d6+8", type: "slashing" }],
        multiattack: 3,
        special: { name: "Poison Breath", dmg: "22d6", type: "poison", save: { stat: "con", dc: 22 }, recharge: [5,6], desc: "90-foot cone" },
        immunities: ["poison"], legendary: 3
    },
    "adult-black-dragon": {
        name: "Adult Black Dragon", icon: "🐲", type: "dragon", cr: 14, hp: 195, ac: 19, color: 0x1a1a1a,
        abilities: { str: 23, dex: 14, con: 21, int: 14, wis: 13, cha: 17 },
        speed: 40, size: "huge",
        attacks: [{ name: "Bite", hit: 11, dmg: "2d10+6", type: "piercing" }, { name: "Claw", hit: 11, dmg: "2d6+6", type: "slashing" }],
        multiattack: 3,
        special: { name: "Acid Breath", dmg: "12d8", type: "acid", save: { stat: "dex", dc: 18 }, recharge: [5,6], desc: "60-foot line" },
        immunities: ["acid"], legendary: 3
    },
    "adult-white-dragon": {
        name: "Adult White Dragon", icon: "🐉", type: "dragon", cr: 13, hp: 200, ac: 18, color: 0xf0f0ff,
        abilities: { str: 22, dex: 10, con: 22, int: 8, wis: 12, cha: 12 },
        speed: 40, size: "huge",
        attacks: [{ name: "Bite", hit: 11, dmg: "2d10+6", type: "piercing" }, { name: "Claw", hit: 11, dmg: "2d6+6", type: "slashing" }],
        multiattack: 3,
        special: { name: "Cold Breath", dmg: "12d8", type: "cold", save: { stat: "con", dc: 19 }, recharge: [5,6], desc: "60-foot cone" },
        immunities: ["cold"], legendary: 3
    },
    "young-red-dragon": {
        name: "Young Red Dragon", icon: "🐉", type: "dragon", cr: 10, hp: 178, ac: 18, color: 0xcc2200,
        abilities: { str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19 },
        speed: 40, size: "large",
        attacks: [{ name: "Bite", hit: 10, dmg: "2d10+6", type: "piercing" }, { name: "Claw", hit: 10, dmg: "2d6+6", type: "slashing" }],
        multiattack: 3,
        special: { name: "Fire Breath", dmg: "16d6", type: "fire", save: { stat: "dex", dc: 17 }, recharge: [5,6] },
        immunities: ["fire"]
    },

    // ==================== LEGENDARY MONSTERS ====================
    "tarrasque": {
        name: "Tarrasque", icon: "🦖", type: "monstrosity", cr: 30, hp: 676, ac: 25, color: 0x4a3728,
        abilities: { str: 30, dex: 11, con: 30, int: 3, wis: 11, cha: 11 },
        speed: 40, size: "gargantuan",
        attacks: [{ name: "Bite", hit: 19, dmg: "4d12+10", type: "piercing" }, { name: "Claw", hit: 19, dmg: "4d8+10", type: "slashing" },
                  { name: "Horns", hit: 19, dmg: "4d10+10", type: "piercing" }, { name: "Tail", hit: 19, dmg: "4d6+10", type: "bludgeoning" }],
        multiattack: 5,
        special: { name: "Frightful Presence", status: "frightened", save: { stat: "wis", dc: 17 } },
        immunities: ["fire", "poison"], legendary: 3
    },
    "kraken": {
        name: "Kraken", icon: "🐙", type: "monstrosity", cr: 23, hp: 472, ac: 18, color: 0x1e3a5f,
        abilities: { str: 30, dex: 11, con: 25, int: 22, wis: 18, cha: 20 },
        speed: 20, size: "gargantuan",
        attacks: [{ name: "Tentacle", hit: 17, dmg: "3d6+10", type: "bludgeoning" }, { name: "Bite", hit: 17, dmg: "3d8+10", type: "piercing" }],
        multiattack: 3,
        special: { name: "Lightning Storm", dmg: "22d6", type: "lightning", save: { stat: "dex", dc: 23 }, recharge: [5,6] },
        immunities: ["lightning"], legendary: 3
    },

    // ==================== ABERRATIONS ====================
    "beholder": {
        name: "Beholder", icon: "👁", type: "aberration", cr: 13, hp: 180, ac: 18, color: 0x6b3fa0,
        abilities: { str: 10, dex: 14, con: 18, int: 17, wis: 15, cha: 17 },
        speed: 0, fly: 20, size: "large",
        attacks: [{ name: "Bite", hit: 5, dmg: "4d6", type: "piercing" }],
        special: { name: "Disintegration Ray", dmg: "10d8", type: "force", save: { stat: "dex", dc: 16 } },
        eyeRays: true, legendary: 3
    },
    "mind-flayer": {
        name: "Mind Flayer", icon: "🦑", type: "aberration", cr: 7, hp: 71, ac: 15, color: 0x9932cc,
        abilities: { str: 11, dex: 12, con: 12, int: 19, wis: 17, cha: 17 },
        speed: 30, size: "medium",
        attacks: [{ name: "Tentacles", hit: 7, dmg: "2d10+4", type: "psychic" }],
        special: { name: "Mind Blast", dmg: "4d8+4", type: "psychic", save: { stat: "int", dc: 15 }, recharge: [5,6], stun: true }
    },
    "aboleth": {
        name: "Aboleth", icon: "🐟", type: "aberration", cr: 10, hp: 135, ac: 17, color: 0x2f4f4f,
        abilities: { str: 21, dex: 9, con: 15, int: 18, wis: 15, cha: 18 },
        speed: 10, swim: 40, size: "large",
        attacks: [{ name: "Tentacle", hit: 9, dmg: "2d6+5", type: "bludgeoning" }],
        multiattack: 3,
        special: { name: "Psychic Drain", dmg: "3d6", type: "psychic", save: { stat: "wis", dc: 14 } },
        legendary: 3
    },

    // ==================== UNDEAD ====================
    "lich": {
        name: "Lich", icon: "💀", type: "undead", cr: 21, hp: 135, ac: 17, color: 0x4a7c59,
        abilities: { str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16 },
        speed: 30, size: "medium",
        attacks: [{ name: "Paralyzing Touch", hit: 12, dmg: "3d6", type: "cold" }],
        special: { name: "Power Word Kill", instant: true, threshold: 100 },
        spellcaster: true, immunities: ["poison", "necrotic"], legendary: 3
    },
    "vampire": {
        name: "Vampire", icon: "🧛", type: "undead", cr: 13, hp: 144, ac: 16, color: 0x4a0000,
        abilities: { str: 18, dex: 18, con: 18, int: 17, wis: 15, cha: 18 },
        speed: 30, size: "medium",
        attacks: [{ name: "Unarmed", hit: 9, dmg: "1d8+4", type: "bludgeoning" }, { name: "Bite", hit: 9, dmg: "1d6+4", type: "piercing", extra: "3d6 necrotic" }],
        multiattack: 2,
        special: { name: "Charm", status: "charmed", save: { stat: "wis", dc: 17 } },
        regeneration: 20, legendary: 3
    },
    "death-knight": {
        name: "Death Knight", icon: "⚔️", type: "undead", cr: 17, hp: 180, ac: 20, color: 0x2f4f4f,
        abilities: { str: 20, dex: 11, con: 20, int: 12, wis: 16, cha: 18 },
        speed: 30, size: "medium",
        attacks: [{ name: "Longsword", hit: 11, dmg: "1d8+5", type: "slashing", extra: "4d8 necrotic" }],
        multiattack: 3,
        special: { name: "Hellfire Orb", dmg: "10d6", type: "fire", extra: "10d6 necrotic", save: { stat: "dex", dc: 18 }, recharge: [6] },
        immunities: ["necrotic", "poison"]
    },
    "mummy-lord": {
        name: "Mummy Lord", icon: "🧟", type: "undead", cr: 15, hp: 97, ac: 17, color: 0xc2b280,
        abilities: { str: 18, dex: 10, con: 17, int: 11, wis: 18, cha: 16 },
        speed: 20, size: "medium",
        attacks: [{ name: "Rotting Fist", hit: 9, dmg: "3d6+4", type: "bludgeoning", extra: "6d6 necrotic" }],
        multiattack: 2,
        special: { name: "Dreadful Glare", status: "frightened", save: { stat: "wis", dc: 16 } },
        immunities: ["necrotic", "poison"], legendary: 3
    },
    "demilich": {
        name: "Demilich", icon: "💀", type: "undead", cr: 18, hp: 80, ac: 20, color: 0xffd700,
        abilities: { str: 1, dex: 20, con: 10, int: 20, wis: 17, cha: 20 },
        speed: 0, fly: 30, size: "tiny",
        attacks: [],
        special: { name: "Howl", dmg: "10d6", type: "necrotic", save: { stat: "con", dc: 15 } },
        immunities: ["necrotic", "poison", "psychic"], legendary: 3
    },
    "ghost": {
        name: "Ghost", icon: "👻", type: "undead", cr: 4, hp: 45, ac: 11, color: 0xaaaaaa,
        abilities: { str: 7, dex: 13, con: 10, int: 10, wis: 12, cha: 17 },
        speed: 0, fly: 40, size: "medium",
        attacks: [{ name: "Withering Touch", hit: 5, dmg: "4d6+3", type: "necrotic" }],
        special: { name: "Horrifying Visage", status: "frightened", save: { stat: "wis", dc: 13 } },
        resistances: ["acid", "fire", "lightning", "thunder"]
    },
    "wraith": {
        name: "Wraith", icon: "👤", type: "undead", cr: 5, hp: 67, ac: 13, color: 0x333333,
        abilities: { str: 6, dex: 16, con: 16, int: 12, wis: 14, cha: 15 },
        speed: 0, fly: 60, size: "medium",
        attacks: [{ name: "Life Drain", hit: 6, dmg: "4d8+3", type: "necrotic" }],
        immunities: ["necrotic", "poison"], resistances: ["acid", "cold", "fire", "lightning", "thunder"]
    },
    "flameskull": {
        name: "Flameskull", icon: "🔥", type: "undead", cr: 4, hp: 40, ac: 13, color: 0xff4400,
        abilities: { str: 1, dex: 17, con: 14, int: 16, wis: 10, cha: 11 },
        speed: 0, fly: 40, size: "tiny",
        attacks: [],
        special: { name: "Fire Ray", dmg: "3d6", type: "fire", ranged: true },
        spellcaster: true, immunities: ["fire", "poison"]
    },

    // ==================== FIENDS ====================
    "pit-fiend": {
        name: "Pit Fiend", icon: "👿", type: "fiend", cr: 20, hp: 300, ac: 19, color: 0x8b0000,
        abilities: { str: 26, dex: 14, con: 24, int: 22, wis: 18, cha: 24 },
        speed: 30, fly: 60, size: "large",
        attacks: [{ name: "Bite", hit: 14, dmg: "4d6+8", type: "piercing" }, { name: "Mace", hit: 14, dmg: "2d6+8", type: "bludgeoning", extra: "6d6 fire" }],
        multiattack: 4,
        special: { name: "Fireball", dmg: "10d6", type: "fire", save: { stat: "dex", dc: 21 } },
        immunities: ["fire", "poison"]
    },
    "balor": {
        name: "Balor", icon: "🔥", type: "fiend", cr: 19, hp: 262, ac: 19, color: 0xff4400,
        abilities: { str: 26, dex: 15, con: 22, int: 20, wis: 16, cha: 22 },
        speed: 40, fly: 80, size: "huge",
        attacks: [{ name: "Longsword", hit: 14, dmg: "3d8+8", type: "slashing", extra: "3d8 lightning" }, { name: "Whip", hit: 14, dmg: "2d6+8", type: "fire" }],
        multiattack: 2,
        special: { name: "Fire Aura", dmg: "3d6", type: "fire", aura: true },
        immunities: ["fire", "poison"]
    },
    "marilith": {
        name: "Marilith", icon: "🐍", type: "fiend", cr: 16, hp: 189, ac: 18, color: 0x8b0000,
        abilities: { str: 18, dex: 20, con: 20, int: 18, wis: 16, cha: 20 },
        speed: 40, size: "large",
        attacks: [{ name: "Longsword", hit: 9, dmg: "2d8+4", type: "slashing" }, { name: "Tail", hit: 9, dmg: "2d10+4", type: "bludgeoning" }],
        multiattack: 7,
        immunities: ["poison"], resistances: ["cold", "fire", "lightning"]
    },
    "vrock": {
        name: "Vrock", icon: "🦅", type: "fiend", cr: 6, hp: 104, ac: 15, color: 0x4a4a4a,
        abilities: { str: 17, dex: 15, con: 18, int: 8, wis: 13, cha: 8 },
        speed: 40, fly: 60, size: "large",
        attacks: [{ name: "Beak", hit: 6, dmg: "2d6+3", type: "piercing" }, { name: "Talons", hit: 6, dmg: "2d10+3", type: "slashing" }],
        multiattack: 2,
        special: { name: "Spores", dmg: "1d10", type: "poison", save: { stat: "con", dc: 14 }, recharge: [6] },
        resistances: ["cold", "fire", "lightning"]
    },
    "hezrou": {
        name: "Hezrou", icon: "🐸", type: "fiend", cr: 8, hp: 136, ac: 16, color: 0x556b2f,
        abilities: { str: 19, dex: 17, con: 20, int: 5, wis: 12, cha: 13 },
        speed: 30, size: "large",
        attacks: [{ name: "Bite", hit: 7, dmg: "2d10+4", type: "piercing" }, { name: "Claw", hit: 7, dmg: "2d6+4", type: "slashing" }],
        multiattack: 3,
        special: { name: "Stench", status: "poisoned", save: { stat: "con", dc: 14 }, aura: true },
        resistances: ["cold", "fire", "lightning"]
    },
    "glabrezu": {
        name: "Glabrezu", icon: "🦂", type: "fiend", cr: 9, hp: 157, ac: 17, color: 0x8b4513,
        abilities: { str: 20, dex: 15, con: 21, int: 19, wis: 17, cha: 16 },
        speed: 40, size: "large",
        attacks: [{ name: "Pincer", hit: 9, dmg: "2d10+5", type: "bludgeoning" }, { name: "Fist", hit: 9, dmg: "2d4+5", type: "bludgeoning" }],
        multiattack: 4,
        resistances: ["cold", "fire", "lightning"]
    },
    "succubus": {
        name: "Succubus", icon: "😈", type: "fiend", cr: 4, hp: 66, ac: 15, color: 0xff69b4,
        abilities: { str: 8, dex: 17, con: 13, int: 15, wis: 12, cha: 20 },
        speed: 30, fly: 60, size: "medium",
        attacks: [{ name: "Claw", hit: 5, dmg: "1d6+3", type: "slashing" }],
        special: { name: "Draining Kiss", dmg: "5d10+5", type: "psychic" },
        resistances: ["cold", "fire", "lightning", "poison"]
    },
    "night-hag": {
        name: "Night Hag", icon: "🧙‍♀️", type: "fiend", cr: 5, hp: 112, ac: 17, color: 0x483d8b,
        abilities: { str: 18, dex: 15, con: 16, int: 16, wis: 14, cha: 16 },
        speed: 30, size: "medium",
        attacks: [{ name: "Claw", hit: 7, dmg: "2d8+4", type: "slashing" }],
        special: { name: "Nightmare Haunting", dmg: "2d6", type: "psychic" },
        resistances: ["cold", "fire"]
    },

    // ==================== GIANTS ====================
    "storm-giant": {
        name: "Storm Giant", icon: "⛈️", type: "giant", cr: 13, hp: 230, ac: 16, color: 0x4169e1,
        abilities: { str: 29, dex: 14, con: 20, int: 16, wis: 18, cha: 18 },
        speed: 50, size: "huge",
        attacks: [{ name: "Greatsword", hit: 14, dmg: "6d6+9", type: "slashing" }, { name: "Rock", hit: 14, dmg: "4d12+9", type: "bludgeoning", ranged: true }],
        multiattack: 2,
        special: { name: "Lightning Strike", dmg: "12d8", type: "lightning", save: { stat: "dex", dc: 17 }, recharge: [5,6] },
        immunities: ["lightning", "thunder"]
    },
    "fire-giant": {
        name: "Fire Giant", icon: "🔥", type: "giant", cr: 9, hp: 162, ac: 18, color: 0xb22222,
        abilities: { str: 25, dex: 9, con: 23, int: 10, wis: 14, cha: 13 },
        speed: 30, size: "huge",
        attacks: [{ name: "Greatsword", hit: 11, dmg: "6d6+7", type: "slashing" }, { name: "Rock", hit: 11, dmg: "4d10+7", type: "bludgeoning", ranged: true }],
        multiattack: 2,
        immunities: ["fire"]
    },
    "frost-giant": {
        name: "Frost Giant", icon: "❄️", type: "giant", cr: 8, hp: 138, ac: 15, color: 0x87ceeb,
        abilities: { str: 23, dex: 9, con: 21, int: 9, wis: 10, cha: 12 },
        speed: 40, size: "huge",
        attacks: [{ name: "Greataxe", hit: 9, dmg: "3d12+6", type: "slashing" }, { name: "Rock", hit: 9, dmg: "4d10+6", type: "bludgeoning", ranged: true }],
        multiattack: 2,
        immunities: ["cold"]
    },
    "hill-giant": {
        name: "Hill Giant", icon: "🗻", type: "giant", cr: 5, hp: 105, ac: 13, color: 0x8b7355,
        abilities: { str: 21, dex: 8, con: 19, int: 5, wis: 9, cha: 6 },
        speed: 40, size: "huge",
        attacks: [{ name: "Greatclub", hit: 8, dmg: "3d8+5", type: "bludgeoning" }, { name: "Rock", hit: 8, dmg: "3d10+5", type: "bludgeoning", ranged: true }],
        multiattack: 2
    },
    "stone-giant": {
        name: "Stone Giant", icon: "🪨", type: "giant", cr: 7, hp: 126, ac: 17, color: 0x808080,
        abilities: { str: 23, dex: 15, con: 20, int: 10, wis: 12, cha: 9 },
        speed: 40, size: "huge",
        attacks: [{ name: "Greatclub", hit: 9, dmg: "3d8+6", type: "bludgeoning" }, { name: "Rock", hit: 9, dmg: "4d10+6", type: "bludgeoning", ranged: true }],
        multiattack: 2
    },

    // ==================== CONSTRUCTS ====================
    "iron-golem": {
        name: "Iron Golem", icon: "🤖", type: "construct", cr: 16, hp: 210, ac: 20, color: 0x708090,
        abilities: { str: 24, dex: 9, con: 20, int: 3, wis: 11, cha: 1 },
        speed: 30, size: "large",
        attacks: [{ name: "Slam", hit: 13, dmg: "3d8+7", type: "bludgeoning" }, { name: "Sword", hit: 13, dmg: "3d10+7", type: "slashing" }],
        multiattack: 2,
        special: { name: "Poison Breath", dmg: "10d8", type: "poison", save: { stat: "con", dc: 19 }, recharge: [5,6] },
        immunities: ["fire", "poison", "psychic"], fireAbsorption: true
    },
    "stone-golem": {
        name: "Stone Golem", icon: "🗿", type: "construct", cr: 10, hp: 178, ac: 17, color: 0x696969,
        abilities: { str: 22, dex: 9, con: 20, int: 3, wis: 11, cha: 1 },
        speed: 30, size: "large",
        attacks: [{ name: "Slam", hit: 10, dmg: "3d8+6", type: "bludgeoning" }],
        multiattack: 2,
        special: { name: "Slow", status: "slowed", save: { stat: "wis", dc: 17 }, recharge: [5,6] },
        immunities: ["poison", "psychic"]
    },
    "clay-golem": {
        name: "Clay Golem", icon: "🏺", type: "construct", cr: 9, hp: 133, ac: 14, color: 0xd2691e,
        abilities: { str: 20, dex: 9, con: 18, int: 3, wis: 8, cha: 1 },
        speed: 20, size: "large",
        attacks: [{ name: "Slam", hit: 8, dmg: "2d10+5", type: "bludgeoning" }],
        multiattack: 2,
        special: { name: "Haste", buff: true, recharge: [6] },
        immunities: ["acid", "poison", "psychic"]
    },
    "flesh-golem": {
        name: "Flesh Golem", icon: "🧟", type: "construct", cr: 5, hp: 93, ac: 9, color: 0x90ee90,
        abilities: { str: 19, dex: 9, con: 18, int: 6, wis: 10, cha: 5 },
        speed: 30, size: "medium",
        attacks: [{ name: "Slam", hit: 7, dmg: "2d8+4", type: "bludgeoning" }],
        multiattack: 2,
        immunities: ["lightning", "poison"], lightningAbsorption: true
    },
    "shield-guardian": {
        name: "Shield Guardian", icon: "🛡️", type: "construct", cr: 7, hp: 142, ac: 17, color: 0x4682b4,
        abilities: { str: 18, dex: 8, con: 18, int: 7, wis: 10, cha: 3 },
        speed: 30, size: "large",
        attacks: [{ name: "Fist", hit: 7, dmg: "2d6+4", type: "bludgeoning" }],
        multiattack: 2,
        regeneration: 10, immunities: ["poison"]
    },

    // ==================== MONSTROSITIES ====================
    "purple-worm": {
        name: "Purple Worm", icon: "🪱", type: "monstrosity", cr: 15, hp: 247, ac: 18, color: 0x800080,
        abilities: { str: 28, dex: 7, con: 22, int: 1, wis: 8, cha: 4 },
        speed: 50, size: "gargantuan",
        attacks: [{ name: "Bite", hit: 14, dmg: "3d8+9", type: "piercing" }, { name: "Tail Stinger", hit: 14, dmg: "3d6+9", type: "piercing", extra: "12d6 poison" }],
        multiattack: 2
    },
    "hydra": {
        name: "Hydra", icon: "🐍", type: "monstrosity", cr: 8, hp: 172, ac: 15, color: 0x2e8b57,
        abilities: { str: 20, dex: 12, con: 20, int: 2, wis: 10, cha: 7 },
        speed: 30, swim: 30, size: "huge",
        attacks: [{ name: "Bite", hit: 8, dmg: "1d10+5", type: "piercing" }],
        multiattack: 5
    },
    "chimera": {
        name: "Chimera", icon: "🦁", type: "monstrosity", cr: 6, hp: 114, ac: 14, color: 0xdaa520,
        abilities: { str: 19, dex: 11, con: 19, int: 3, wis: 14, cha: 10 },
        speed: 30, fly: 60, size: "large",
        attacks: [{ name: "Bite", hit: 7, dmg: "2d6+4", type: "piercing" }, { name: "Horns", hit: 7, dmg: "1d12+4", type: "bludgeoning" }, { name: "Claws", hit: 7, dmg: "2d6+4", type: "slashing" }],
        multiattack: 3,
        special: { name: "Fire Breath", dmg: "7d8", type: "fire", save: { stat: "dex", dc: 15 }, recharge: [5,6] }
    },
    "manticore": {
        name: "Manticore", icon: "🦂", type: "monstrosity", cr: 3, hp: 68, ac: 14, color: 0xcd853f,
        abilities: { str: 17, dex: 16, con: 17, int: 7, wis: 12, cha: 8 },
        speed: 30, fly: 50, size: "large",
        attacks: [{ name: "Bite", hit: 5, dmg: "1d8+3", type: "piercing" }, { name: "Claw", hit: 5, dmg: "1d6+3", type: "slashing" }, { name: "Tail Spike", hit: 5, dmg: "1d8+3", type: "piercing", ranged: true }],
        multiattack: 3
    },
    "basilisk": {
        name: "Basilisk", icon: "🦎", type: "monstrosity", cr: 3, hp: 52, ac: 15, color: 0x556b2f,
        abilities: { str: 16, dex: 8, con: 15, int: 2, wis: 8, cha: 7 },
        speed: 20, size: "medium",
        attacks: [{ name: "Bite", hit: 5, dmg: "2d6+3", type: "piercing", extra: "2d6 poison" }],
        special: { name: "Petrifying Gaze", status: "petrified", save: { stat: "con", dc: 12 } }
    },
    "roc": {
        name: "Roc", icon: "🦅", type: "monstrosity", cr: 11, hp: 248, ac: 15, color: 0x8b4513,
        abilities: { str: 28, dex: 10, con: 20, int: 3, wis: 10, cha: 9 },
        speed: 20, fly: 120, size: "gargantuan",
        attacks: [{ name: "Beak", hit: 13, dmg: "4d8+9", type: "piercing" }, { name: "Talons", hit: 13, dmg: "4d6+9", type: "slashing" }],
        multiattack: 2
    },
    "owlbear": {
        name: "Owlbear", icon: "🦉", type: "monstrosity", cr: 3, hp: 59, ac: 13, color: 0x8b4513,
        abilities: { str: 20, dex: 12, con: 17, int: 3, wis: 12, cha: 7 },
        speed: 40, size: "large",
        attacks: [{ name: "Beak", hit: 7, dmg: "1d10+5", type: "piercing" }, { name: "Claws", hit: 7, dmg: "2d8+5", type: "slashing" }],
        multiattack: 2
    },
    "displacer-beast": {
        name: "Displacer Beast", icon: "🐆", type: "monstrosity", cr: 3, hp: 85, ac: 13, color: 0x191970,
        abilities: { str: 18, dex: 15, con: 16, int: 6, wis: 12, cha: 8 },
        speed: 40, size: "large",
        attacks: [{ name: "Tentacle", hit: 6, dmg: "1d6+4", type: "bludgeoning", extra: "1d6 piercing" }],
        multiattack: 2
    },
    "bulette": {
        name: "Bulette", icon: "🦈", type: "monstrosity", cr: 5, hp: 94, ac: 17, color: 0x696969,
        abilities: { str: 19, dex: 11, con: 21, int: 2, wis: 10, cha: 5 },
        speed: 40, burrow: 40, size: "large",
        attacks: [{ name: "Bite", hit: 7, dmg: "4d12+4", type: "piercing" }],
        special: { name: "Deadly Leap", dmg: "3d6+4", type: "bludgeoning", extra: "3d6+4 slashing", save: { stat: "dex", dc: 16 } }
    },
    "umber-hulk": {
        name: "Umber Hulk", icon: "🐜", type: "monstrosity", cr: 5, hp: 93, ac: 18, color: 0x8b4513,
        abilities: { str: 20, dex: 13, con: 16, int: 9, wis: 10, cha: 10 },
        speed: 30, burrow: 20, size: "large",
        attacks: [{ name: "Claw", hit: 8, dmg: "1d8+5", type: "slashing" }, { name: "Mandibles", hit: 8, dmg: "2d8+5", type: "slashing" }],
        multiattack: 3,
        special: { name: "Confusing Gaze", status: "confused", save: { stat: "cha", dc: 15 } }
    },

    // ==================== OOZES ====================
    "gelatinous-cube": {
        name: "Gelatinous Cube", icon: "🟩", type: "ooze", cr: 2, hp: 84, ac: 6, color: 0x00ff7f,
        abilities: { str: 14, dex: 3, con: 20, int: 1, wis: 6, cha: 1 },
        speed: 15, size: "large",
        attacks: [{ name: "Pseudopod", hit: 4, dmg: "3d6", type: "acid" }],
        special: { name: "Engulf", dmg: "3d6", type: "acid", save: { stat: "dex", dc: 12 } },
        immunities: ["acid"]
    },
    "black-pudding": {
        name: "Black Pudding", icon: "⬛", type: "ooze", cr: 4, hp: 85, ac: 7, color: 0x1a1a1a,
        abilities: { str: 16, dex: 5, con: 16, int: 1, wis: 6, cha: 1 },
        speed: 20, size: "large",
        attacks: [{ name: "Pseudopod", hit: 5, dmg: "1d6+3", type: "bludgeoning", extra: "4d8 acid" }],
        immunities: ["acid", "cold", "lightning"]
    },

    // ==================== BEASTS ====================
    "tyrannosaurus-rex": {
        name: "Tyrannosaurus Rex", icon: "🦖", type: "beast", cr: 8, hp: 136, ac: 13, color: 0x228b22,
        abilities: { str: 25, dex: 10, con: 19, int: 2, wis: 12, cha: 9 },
        speed: 50, size: "huge",
        attacks: [{ name: "Bite", hit: 10, dmg: "4d12+7", type: "piercing" }, { name: "Tail", hit: 10, dmg: "3d8+7", type: "bludgeoning" }],
        multiattack: 2
    },
    "mammoth": {
        name: "Mammoth", icon: "🦣", type: "beast", cr: 6, hp: 126, ac: 13, color: 0x8b4513,
        abilities: { str: 24, dex: 9, con: 21, int: 3, wis: 11, cha: 6 },
        speed: 40, size: "huge",
        attacks: [{ name: "Gore", hit: 10, dmg: "4d8+7", type: "piercing" }, { name: "Stomp", hit: 10, dmg: "4d10+7", type: "bludgeoning" }],
        multiattack: 2
    },
    "giant-ape": {
        name: "Giant Ape", icon: "🦍", type: "beast", cr: 7, hp: 157, ac: 12, color: 0x2f4f4f,
        abilities: { str: 23, dex: 14, con: 18, int: 7, wis: 12, cha: 7 },
        speed: 40, size: "huge",
        attacks: [{ name: "Fist", hit: 9, dmg: "3d10+6", type: "bludgeoning" }, { name: "Rock", hit: 9, dmg: "7d6+6", type: "bludgeoning", ranged: true }],
        multiattack: 2
    },

    // ==================== MISC ====================
    "mimic": {
        name: "Mimic", icon: "📦", type: "monstrosity", cr: 2, hp: 58, ac: 12, color: 0x8b4513,
        abilities: { str: 17, dex: 12, con: 15, int: 5, wis: 13, cha: 8 },
        speed: 15, size: "medium",
        attacks: [{ name: "Pseudopod", hit: 5, dmg: "1d8+3", type: "bludgeoning" }, { name: "Bite", hit: 5, dmg: "1d8+3", type: "piercing", extra: "1d8 acid" }],
        multiattack: 2
    },
    "rust-monster": {
        name: "Rust Monster", icon: "🦗", type: "monstrosity", cr: 0.5, hp: 27, ac: 14, color: 0xb87333,
        abilities: { str: 13, dex: 12, con: 13, int: 2, wis: 13, cha: 6 },
        speed: 40, size: "medium",
        attacks: [{ name: "Bite", hit: 3, dmg: "1d8+1", type: "piercing" }],
        special: { name: "Antennae", desc: "Rusts metal equipment" }
    },
    "troll": {
        name: "Troll", icon: "👹", type: "giant", cr: 5, hp: 84, ac: 15, color: 0x228b22,
        abilities: { str: 18, dex: 13, con: 20, int: 7, wis: 9, cha: 7 },
        speed: 30, size: "large",
        attacks: [{ name: "Bite", hit: 7, dmg: "1d6+4", type: "piercing" }, { name: "Claw", hit: 7, dmg: "2d6+4", type: "slashing" }],
        multiattack: 3,
        regeneration: 10
    },
    "rakshasa": {
        name: "Rakshasa", icon: "🐯", type: "fiend", cr: 13, hp: 110, ac: 16, color: 0xff8c00,
        abilities: { str: 14, dex: 17, con: 18, int: 13, wis: 16, cha: 20 },
        speed: 40, size: "medium",
        attacks: [{ name: "Claw", hit: 7, dmg: "2d6+2", type: "slashing" }],
        multiattack: 2,
        spellcaster: true
    }
};

// Type colors for UI
const TYPE_COLORS = {
    dragon: 0xc41e3a, undead: 0x4a7c59, fiend: 0x8b0000, aberration: 0x6b3fa0,
    beast: 0x8b4513, construct: 0x708090, giant: 0x4169e1, monstrosity: 0x2e8b57,
    ooze: 0x00ff7f, elemental: 0xff6600
};

// Get all monster keys sorted by CR
function getMonstersByCR() {
    return Object.entries(MONSTERS).sort((a, b) => b[1].cr - a[1].cr);
}

// Get unique types
function getMonsterTypes() {
    return [...new Set(Object.values(MONSTERS).map(m => m.type))].sort();
}
