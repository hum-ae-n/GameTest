// D&D Monster Database V2 - 30+ Monsters
const MONSTERS = {
    // ========== DRAGONS ==========
    "ancient-red-dragon": {
        name: "Ancient Red Dragon", type: "Dragon", size: "Gargantuan", cr: 24, ac: 22, hp: 546,
        icon: "🐉", abilities: { str: 30, dex: 10, con: 29, int: 18, wis: 15, cha: 23 },
        saves: { dex: 7, con: 16, wis: 9, cha: 13 }, immunities: ["fire"],
        attacks: [
            { name: "Bite", hit: 17, dmg: "2d10+10", type: "piercing", extra: { dmg: "2d6", type: "fire" } },
            { name: "Claw", hit: 17, dmg: "2d6+10", type: "slashing" },
            { name: "Tail", hit: 17, dmg: "2d8+10", type: "bludgeoning" }
        ],
        multiattack: ["Bite", "Claw", "Claw"],
        specials: [{
            name: "Fire Breath", recharge: [5,6], recharged: true, save: { stat: "dex", dc: 24 },
            dmg: "26d6", type: "fire", half: true, desc: "90-foot cone"
        }],
        legendary: 3, legActions: [
            { name: "Tail Attack", cost: 1, attack: "Tail" },
            { name: "Wing Attack", cost: 2, dmg: "2d6+10", type: "bludgeoning", save: { stat: "dex", dc: 25 }, aoe: true }
        ],
        traits: ["Legendary Resistance (3/Day)", "Frightful Presence"]
    },
    "ancient-blue-dragon": {
        name: "Ancient Blue Dragon", type: "Dragon", size: "Gargantuan", cr: 23, ac: 22, hp: 481,
        icon: "🐲", abilities: { str: 29, dex: 10, con: 27, int: 18, wis: 17, cha: 21 },
        saves: { dex: 7, con: 15, wis: 10, cha: 12 }, immunities: ["lightning"],
        attacks: [
            { name: "Bite", hit: 16, dmg: "2d10+9", type: "piercing", extra: { dmg: "2d6", type: "lightning" } },
            { name: "Claw", hit: 16, dmg: "2d6+9", type: "slashing" },
            { name: "Tail", hit: 16, dmg: "2d8+9", type: "bludgeoning" }
        ],
        multiattack: ["Bite", "Claw", "Claw"],
        specials: [{
            name: "Lightning Breath", recharge: [5,6], recharged: true, save: { stat: "dex", dc: 23 },
            dmg: "16d10", type: "lightning", half: true, desc: "120-foot line"
        }],
        legendary: 3, legActions: [
            { name: "Tail Attack", cost: 1, attack: "Tail" },
            { name: "Wing Attack", cost: 2, dmg: "2d6+9", type: "bludgeoning", save: { stat: "dex", dc: 24 }, aoe: true }
        ],
        traits: ["Legendary Resistance (3/Day)"]
    },
    "adult-black-dragon": {
        name: "Adult Black Dragon", type: "Dragon", size: "Huge", cr: 14, ac: 19, hp: 195,
        icon: "🐲", abilities: { str: 23, dex: 14, con: 21, int: 14, wis: 13, cha: 17 },
        saves: { dex: 7, con: 10, wis: 6, cha: 8 }, immunities: ["acid"],
        attacks: [
            { name: "Bite", hit: 11, dmg: "2d10+6", type: "piercing", extra: { dmg: "1d8", type: "acid" } },
            { name: "Claw", hit: 11, dmg: "2d6+6", type: "slashing" }
        ],
        multiattack: ["Bite", "Claw", "Claw"],
        specials: [{
            name: "Acid Breath", recharge: [5,6], recharged: true, save: { stat: "dex", dc: 18 },
            dmg: "12d8", type: "acid", half: true, desc: "60-foot line"
        }],
        legendary: 3, legActions: [{ name: "Tail Attack", cost: 1, dmg: "2d8+6", type: "bludgeoning", hit: 11 }],
        traits: ["Legendary Resistance (3/Day)", "Amphibious"]
    },
    "young-white-dragon": {
        name: "Young White Dragon", type: "Dragon", size: "Large", cr: 6, ac: 17, hp: 133,
        icon: "🐉", abilities: { str: 18, dex: 10, con: 18, int: 6, wis: 11, cha: 12 },
        saves: { dex: 3, con: 7, wis: 3, cha: 4 }, immunities: ["cold"],
        attacks: [
            { name: "Bite", hit: 7, dmg: "2d10+4", type: "piercing", extra: { dmg: "1d8", type: "cold" } },
            { name: "Claw", hit: 7, dmg: "2d6+4", type: "slashing" }
        ],
        multiattack: ["Bite", "Claw", "Claw"],
        specials: [{
            name: "Cold Breath", recharge: [5,6], recharged: true, save: { stat: "con", dc: 15 },
            dmg: "10d8", type: "cold", half: true, desc: "30-foot cone"
        }],
        traits: ["Ice Walk"]
    },

    // ========== LEGENDARY MONSTERS ==========
    "tarrasque": {
        name: "Tarrasque", type: "Monstrosity", size: "Gargantuan", cr: 30, ac: 25, hp: 676,
        icon: "🦖", abilities: { str: 30, dex: 11, con: 30, int: 3, wis: 11, cha: 11 },
        saves: { int: 5, wis: 9, cha: 9 }, immunities: ["fire", "poison"],
        conditionImmunities: ["charmed", "frightened", "paralyzed", "poisoned"],
        attacks: [
            { name: "Bite", hit: 19, dmg: "4d12+10", type: "piercing" },
            { name: "Claw", hit: 19, dmg: "4d8+10", type: "slashing" },
            { name: "Horns", hit: 19, dmg: "4d10+10", type: "piercing" },
            { name: "Tail", hit: 19, dmg: "4d6+10", type: "bludgeoning" }
        ],
        multiattack: ["Bite", "Claw", "Claw", "Horns", "Tail"],
        specials: [{
            name: "Frightful Presence", save: { stat: "wis", dc: 17 }, status: "frightened", duration: 10
        }],
        legendary: 3, legActions: [
            { name: "Attack", cost: 1, attack: "Claw" },
            { name: "Chomp", cost: 2, attack: "Bite" }
        ],
        traits: ["Legendary Resistance (3/Day)", "Magic Resistance", "Reflective Carapace", "Siege Monster"]
    },
    "kraken": {
        name: "Kraken", type: "Monstrosity", size: "Gargantuan", cr: 23, ac: 18, hp: 472,
        icon: "🐙", abilities: { str: 30, dex: 11, con: 25, int: 22, wis: 18, cha: 20 },
        saves: { str: 17, dex: 7, con: 14, int: 13, wis: 11 }, immunities: ["lightning"],
        conditionImmunities: ["frightened", "paralyzed"],
        attacks: [
            { name: "Bite", hit: 17, dmg: "3d8+10", type: "piercing" },
            { name: "Tentacle", hit: 17, dmg: "3d6+10", type: "bludgeoning" }
        ],
        multiattack: ["Tentacle", "Tentacle", "Tentacle"],
        specials: [{
            name: "Lightning Storm", recharge: [5,6], recharged: true, save: { stat: "dex", dc: 23 },
            dmg: "22d6", type: "lightning", half: true, desc: "Multiple lightning bolts"
        }],
        legendary: 3, legActions: [
            { name: "Tentacle Attack", cost: 1, attack: "Tentacle" },
            { name: "Fling", cost: 1, dmg: "3d6+10", type: "bludgeoning" }
        ],
        traits: ["Siege Monster", "Freedom of Movement"]
    },

    // ========== ABERRATIONS ==========
    "beholder": {
        name: "Beholder", type: "Aberration", size: "Large", cr: 13, ac: 18, hp: 180,
        icon: "👁", abilities: { str: 10, dex: 14, con: 18, int: 17, wis: 15, cha: 17 },
        saves: { int: 8, wis: 7, cha: 8 }, conditionImmunities: ["prone"],
        attacks: [{ name: "Bite", hit: 5, dmg: "4d6", type: "piercing" }],
        eyeRays: 3,
        specials: [
            { name: "Charm Ray", save: { stat: "wis", dc: 16 }, status: "charmed", duration: 10, eyeRay: true },
            { name: "Paralyzing Ray", save: { stat: "con", dc: 16 }, status: "paralyzed", duration: 10, eyeRay: true },
            { name: "Fear Ray", save: { stat: "wis", dc: 16 }, status: "frightened", duration: 10, eyeRay: true },
            { name: "Disintegration Ray", save: { stat: "dex", dc: 16 }, dmg: "10d8", type: "force", eyeRay: true },
            { name: "Death Ray", save: { stat: "dex", dc: 16 }, dmg: "10d10", type: "necrotic", eyeRay: true },
            { name: "Enervation Ray", save: { stat: "con", dc: 16 }, dmg: "8d8", type: "necrotic", half: true, eyeRay: true }
        ],
        legendary: 3, legActions: [{ name: "Eye Ray", cost: 1, desc: "Uses one random eye ray" }],
        traits: ["Antimagic Cone"]
    },
    "mind-flayer": {
        name: "Mind Flayer", type: "Aberration", size: "Medium", cr: 7, ac: 15, hp: 71,
        icon: "🦑", abilities: { str: 11, dex: 12, con: 12, int: 19, wis: 17, cha: 17 },
        saves: { int: 7, wis: 6, cha: 6 },
        attacks: [{ name: "Tentacles", hit: 7, dmg: "2d10+4", type: "psychic" }],
        specials: [{
            name: "Mind Blast", recharge: [5,6], recharged: true, save: { stat: "int", dc: 15 },
            dmg: "4d8+4", type: "psychic", status: "stunned", duration: 3, desc: "60-foot cone"
        }],
        traits: ["Magic Resistance", "Innate Spellcasting"]
    },
    "aboleth": {
        name: "Aboleth", type: "Aberration", size: "Large", cr: 10, ac: 17, hp: 135,
        icon: "🐟", abilities: { str: 21, dex: 9, con: 15, int: 18, wis: 15, cha: 18 },
        saves: { con: 6, int: 8, wis: 6 },
        attacks: [{ name: "Tentacle", hit: 9, dmg: "2d6+5", type: "bludgeoning" }],
        multiattack: ["Tentacle", "Tentacle", "Tentacle"],
        specials: [
            { name: "Enslave", save: { stat: "wis", dc: 14 }, status: "charmed", duration: 99 },
            { name: "Psychic Drain", save: { stat: "wis", dc: 14 }, dmg: "3d6", type: "psychic" }
        ],
        legendary: 3, legActions: [
            { name: "Detect", cost: 1 },
            { name: "Tail Swipe", cost: 1, dmg: "2d6+5", type: "bludgeoning", save: { stat: "dex", dc: 17 } },
            { name: "Psychic Drain", cost: 2, dmg: "3d6", type: "psychic", save: { stat: "wis", dc: 14 } }
        ],
        traits: ["Amphibious", "Mucous Cloud", "Probing Telepathy"]
    },

    // ========== UNDEAD ==========
    "lich": {
        name: "Lich", type: "Undead", size: "Medium", cr: 21, ac: 17, hp: 135,
        icon: "💀", abilities: { str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16 },
        saves: { con: 10, int: 12, wis: 9 }, immunities: ["poison", "necrotic"],
        resistances: ["cold", "lightning"],
        conditionImmunities: ["charmed", "exhaustion", "frightened", "paralyzed", "poisoned"],
        attacks: [{ name: "Paralyzing Touch", hit: 12, dmg: "3d6", type: "cold", status: "paralyzed", statusSave: { stat: "con", dc: 18 } }],
        spells: [
            { name: "Power Word Kill", level: 9, instant: true, threshold: 100, slots: 1 },
            { name: "Finger of Death", level: 7, dmg: "7d8+30", type: "necrotic", save: { stat: "con", dc: 20 }, half: true, slots: 1 },
            { name: "Disintegrate", level: 6, dmg: "10d6+40", type: "force", save: { stat: "dex", dc: 20 }, slots: 1 },
            { name: "Cloudkill", level: 5, dmg: "5d8", type: "poison", save: { stat: "con", dc: 20 }, half: true, slots: 2 },
            { name: "Fireball", level: 3, dmg: "8d6", type: "fire", save: { stat: "dex", dc: 20 }, half: true, slots: 3 }
        ],
        legendary: 3, legActions: [
            { name: "Cantrip", cost: 1, dmg: "3d8", type: "necrotic" },
            { name: "Frightening Gaze", cost: 2, save: { stat: "wis", dc: 18 }, status: "frightened", duration: 1 },
            { name: "Disrupt Life", cost: 3, dmg: "6d6", type: "necrotic", save: { stat: "con", dc: 18 }, aoe: true }
        ],
        traits: ["Legendary Resistance (3/Day)", "Rejuvenation", "Turn Resistance", "Spellcasting (18th level)"]
    },
    "vampire": {
        name: "Vampire", type: "Undead", size: "Medium", cr: 13, ac: 16, hp: 144,
        icon: "🧛", abilities: { str: 18, dex: 18, con: 18, int: 17, wis: 15, cha: 18 },
        saves: { dex: 9, wis: 7, cha: 9 }, resistances: ["necrotic"],
        attacks: [
            { name: "Unarmed Strike", hit: 9, dmg: "1d8+4", type: "bludgeoning" },
            { name: "Bite", hit: 9, dmg: "1d6+4", type: "piercing", extra: { dmg: "3d6", type: "necrotic" } }
        ],
        multiattack: ["Unarmed Strike", "Unarmed Strike"],
        specials: [{ name: "Charm", save: { stat: "wis", dc: 17 }, status: "charmed", duration: 99 }],
        regeneration: 20,
        legendary: 3, legActions: [
            { name: "Move", cost: 1 },
            { name: "Unarmed Strike", cost: 1, attack: "Unarmed Strike" },
            { name: "Bite", cost: 2, attack: "Bite" }
        ],
        traits: ["Legendary Resistance (3/Day)", "Regeneration", "Spider Climb", "Shapechanger"]
    },
    "death-knight": {
        name: "Death Knight", type: "Undead", size: "Medium", cr: 17, ac: 20, hp: 180,
        icon: "⚔️", abilities: { str: 20, dex: 11, con: 20, int: 12, wis: 16, cha: 18 },
        saves: { dex: 6, wis: 9, cha: 10 }, immunities: ["necrotic", "poison"],
        conditionImmunities: ["exhaustion", "frightened", "poisoned"],
        attacks: [{ name: "Longsword", hit: 11, dmg: "1d8+5", type: "slashing", extra: { dmg: "4d8", type: "necrotic" } }],
        multiattack: ["Longsword", "Longsword", "Longsword"],
        specials: [{
            name: "Hellfire Orb", recharge: [6], recharged: true, save: { stat: "dex", dc: 18 },
            dmg: "10d6", type: "fire", extra: { dmg: "10d6", type: "necrotic" }, half: true, desc: "20-foot radius"
        }],
        spells: [
            { name: "Destructive Wave", level: 5, dmg: "5d6", type: "necrotic", extra: { dmg: "5d6", type: "thunder" }, save: { stat: "con", dc: 18 }, half: true, slots: 1 }
        ],
        traits: ["Magic Resistance", "Marshal Undead"]
    },
    "mummy-lord": {
        name: "Mummy Lord", type: "Undead", size: "Medium", cr: 15, ac: 17, hp: 97,
        icon: "🧟", abilities: { str: 18, dex: 10, con: 17, int: 11, wis: 18, cha: 16 },
        saves: { con: 8, int: 5, wis: 9, cha: 8 }, immunities: ["necrotic", "poison"],
        conditionImmunities: ["charmed", "exhaustion", "frightened", "paralyzed", "poisoned"],
        attacks: [{ name: "Rotting Fist", hit: 9, dmg: "3d6+4", type: "bludgeoning", extra: { dmg: "6d6", type: "necrotic" } }],
        multiattack: ["Rotting Fist", "Rotting Fist"],
        specials: [{
            name: "Dreadful Glare", save: { stat: "wis", dc: 16 }, status: "frightened", duration: 10
        }],
        spells: [
            { name: "Harm", level: 6, dmg: "14d6", type: "necrotic", save: { stat: "con", dc: 17 }, slots: 1 },
            { name: "Contagion", level: 5, status: "poisoned", duration: 99, slots: 1 },
            { name: "Insect Plague", level: 5, dmg: "4d10", type: "piercing", save: { stat: "con", dc: 17 }, half: true, slots: 1 }
        ],
        legendary: 3, legActions: [
            { name: "Attack", cost: 1, attack: "Rotting Fist" },
            { name: "Blinding Dust", cost: 2, save: { stat: "con", dc: 16 }, status: "blinded", duration: 2 },
            { name: "Channel Negative Energy", cost: 3, dmg: "4d6", type: "necrotic", aoe: true }
        ],
        traits: ["Legendary Resistance (3/Day)", "Magic Resistance", "Rejuvenation"]
    },

    // ========== FIENDS ==========
    "pit-fiend": {
        name: "Pit Fiend", type: "Fiend", size: "Large", cr: 20, ac: 19, hp: 300,
        icon: "👿", abilities: { str: 26, dex: 14, con: 24, int: 22, wis: 18, cha: 24 },
        saves: { dex: 8, con: 13, wis: 10 }, immunities: ["fire", "poison"],
        resistances: ["cold"], conditionImmunities: ["poisoned"],
        attacks: [
            { name: "Bite", hit: 14, dmg: "4d6+8", type: "piercing", extra: { dmg: "6d6", type: "poison", save: { stat: "con", dc: 21 } } },
            { name: "Claw", hit: 14, dmg: "2d8+8", type: "slashing" },
            { name: "Mace", hit: 14, dmg: "2d6+8", type: "bludgeoning", extra: { dmg: "6d6", type: "fire" } },
            { name: "Tail", hit: 14, dmg: "3d10+8", type: "bludgeoning" }
        ],
        multiattack: ["Bite", "Claw", "Mace", "Tail"],
        specials: [{
            name: "Fireball", dmg: "10d6", type: "fire", save: { stat: "dex", dc: 21 }, half: true
        }],
        traits: ["Fear Aura", "Magic Resistance", "Magic Weapons", "Innate Spellcasting"]
    },
    "balor": {
        name: "Balor", type: "Fiend", size: "Huge", cr: 19, ac: 19, hp: 262,
        icon: "🔥", abilities: { str: 26, dex: 15, con: 22, int: 20, wis: 16, cha: 22 },
        saves: { str: 14, con: 12, wis: 9, cha: 12 }, immunities: ["fire", "poison"],
        resistances: ["cold", "lightning"], conditionImmunities: ["poisoned"],
        attacks: [
            { name: "Longsword", hit: 14, dmg: "3d8+8", type: "slashing", extra: { dmg: "3d8", type: "lightning" } },
            { name: "Whip", hit: 14, dmg: "2d6+8", type: "slashing", extra: { dmg: "3d6", type: "fire" } }
        ],
        multiattack: ["Longsword", "Whip"],
        specials: [{
            name: "Fire Aura", autoStart: true, dmg: "3d6", type: "fire", desc: "Damages nearby enemies"
        }],
        traits: ["Death Throes", "Fire Aura", "Magic Resistance", "Magic Weapons"]
    },
    "marilith": {
        name: "Marilith", type: "Fiend", size: "Large", cr: 16, ac: 18, hp: 189,
        icon: "🐍", abilities: { str: 18, dex: 20, con: 20, int: 18, wis: 16, cha: 20 },
        saves: { str: 9, con: 10, wis: 8, cha: 10 }, immunities: ["poison"],
        resistances: ["cold", "fire", "lightning"], conditionImmunities: ["poisoned"],
        attacks: [
            { name: "Longsword", hit: 9, dmg: "2d8+4", type: "slashing" },
            { name: "Tail", hit: 9, dmg: "2d10+4", type: "bludgeoning" }
        ],
        multiattack: ["Longsword", "Longsword", "Longsword", "Longsword", "Longsword", "Longsword", "Tail"],
        traits: ["Magic Resistance", "Magic Weapons", "Reactive"]
    },

    // ========== GIANTS ==========
    "frost-giant": {
        name: "Frost Giant", type: "Giant", size: "Huge", cr: 8, ac: 15, hp: 138,
        icon: "❄️", abilities: { str: 23, dex: 9, con: 21, int: 9, wis: 10, cha: 12 },
        saves: { con: 8, wis: 3, cha: 4 }, immunities: ["cold"],
        attacks: [
            { name: "Greataxe", hit: 9, dmg: "3d12+6", type: "slashing" },
            { name: "Rock", hit: 9, dmg: "4d10+6", type: "bludgeoning" }
        ],
        multiattack: ["Greataxe", "Greataxe"],
        traits: []
    },
    "fire-giant": {
        name: "Fire Giant", type: "Giant", size: "Huge", cr: 9, ac: 18, hp: 162,
        icon: "🔥", abilities: { str: 25, dex: 9, con: 23, int: 10, wis: 14, cha: 13 },
        saves: { dex: 3, con: 10, cha: 5 }, immunities: ["fire"],
        attacks: [
            { name: "Greatsword", hit: 11, dmg: "6d6+7", type: "slashing" },
            { name: "Rock", hit: 11, dmg: "4d10+7", type: "bludgeoning" }
        ],
        multiattack: ["Greatsword", "Greatsword"],
        traits: []
    },
    "storm-giant": {
        name: "Storm Giant", type: "Giant", size: "Huge", cr: 13, ac: 16, hp: 230,
        icon: "⛈️", abilities: { str: 29, dex: 14, con: 20, int: 16, wis: 18, cha: 18 },
        saves: { str: 14, con: 10, wis: 9, cha: 9 }, immunities: ["lightning", "thunder"],
        resistances: ["cold"],
        attacks: [
            { name: "Greatsword", hit: 14, dmg: "6d6+9", type: "slashing" },
            { name: "Rock", hit: 14, dmg: "4d12+9", type: "bludgeoning" }
        ],
        multiattack: ["Greatsword", "Greatsword"],
        specials: [{
            name: "Lightning Strike", recharge: [5,6], recharged: true, save: { stat: "dex", dc: 17 },
            dmg: "12d8", type: "lightning", half: true
        }],
        traits: ["Amphibious", "Innate Spellcasting"]
    },

    // ========== CONSTRUCTS ==========
    "iron-golem": {
        name: "Iron Golem", type: "Construct", size: "Large", cr: 16, ac: 20, hp: 210,
        icon: "🤖", abilities: { str: 24, dex: 9, con: 20, int: 3, wis: 11, cha: 1 },
        immunities: ["fire", "poison", "psychic"],
        conditionImmunities: ["charmed", "exhaustion", "frightened", "paralyzed", "petrified", "poisoned"],
        attacks: [
            { name: "Slam", hit: 13, dmg: "3d8+7", type: "bludgeoning" },
            { name: "Sword", hit: 13, dmg: "3d10+7", type: "slashing" }
        ],
        multiattack: ["Slam", "Sword"],
        specials: [{
            name: "Poison Breath", recharge: [5,6], recharged: true, save: { stat: "con", dc: 19 },
            dmg: "10d8", type: "poison", half: true, desc: "15-foot cone"
        }],
        fireAbsorption: true,
        traits: ["Fire Absorption", "Immutable Form", "Magic Resistance", "Magic Weapons"]
    },
    "shield-guardian": {
        name: "Shield Guardian", type: "Construct", size: "Large", cr: 7, ac: 17, hp: 142,
        icon: "🛡️", abilities: { str: 18, dex: 8, con: 18, int: 7, wis: 10, cha: 3 },
        immunities: ["poison"], conditionImmunities: ["charmed", "exhaustion", "frightened", "paralyzed", "poisoned"],
        attacks: [{ name: "Fist", hit: 7, dmg: "2d6+4", type: "bludgeoning" }],
        multiattack: ["Fist", "Fist"],
        regeneration: 10,
        traits: ["Bound", "Regeneration", "Spell Storing"]
    },

    // ========== MONSTROSITIES ==========
    "purple-worm": {
        name: "Purple Worm", type: "Monstrosity", size: "Gargantuan", cr: 15, ac: 18, hp: 247,
        icon: "🪱", abilities: { str: 28, dex: 7, con: 22, int: 1, wis: 8, cha: 4 },
        saves: { con: 11, wis: 4 },
        attacks: [
            { name: "Bite", hit: 14, dmg: "3d8+9", type: "piercing" },
            { name: "Tail Stinger", hit: 14, dmg: "3d6+9", type: "piercing", extra: { dmg: "12d6", type: "poison", save: { stat: "con", dc: 19 } } }
        ],
        multiattack: ["Bite", "Tail Stinger"],
        traits: ["Tunneler"]
    },
    "hydra": {
        name: "Hydra", type: "Monstrosity", size: "Huge", cr: 8, ac: 15, hp: 172,
        icon: "🐍", abilities: { str: 20, dex: 12, con: 20, int: 2, wis: 10, cha: 7 },
        attacks: [{ name: "Bite", hit: 8, dmg: "1d10+5", type: "piercing" }],
        multiattack: ["Bite", "Bite", "Bite", "Bite", "Bite"],
        traits: ["Hold Breath", "Multiple Heads", "Reactive Heads", "Wakeful"]
    },
    "roc": {
        name: "Roc", type: "Monstrosity", size: "Gargantuan", cr: 11, ac: 15, hp: 248,
        icon: "🦅", abilities: { str: 28, dex: 10, con: 20, int: 3, wis: 10, cha: 9 },
        saves: { dex: 4, con: 9, wis: 4, cha: 3 },
        attacks: [
            { name: "Beak", hit: 13, dmg: "4d8+9", type: "piercing" },
            { name: "Talons", hit: 13, dmg: "4d6+9", type: "slashing" }
        ],
        multiattack: ["Beak", "Talons"],
        traits: ["Keen Sight"]
    },

    // ========== BEASTS ==========
    "tyrannosaurus-rex": {
        name: "Tyrannosaurus Rex", type: "Beast", size: "Huge", cr: 8, ac: 13, hp: 136,
        icon: "🦖", abilities: { str: 25, dex: 10, con: 19, int: 2, wis: 12, cha: 9 },
        attacks: [
            { name: "Bite", hit: 10, dmg: "4d12+7", type: "piercing" },
            { name: "Tail", hit: 10, dmg: "3d8+7", type: "bludgeoning" }
        ],
        multiattack: ["Bite", "Tail"],
        traits: []
    },
    "mammoth": {
        name: "Mammoth", type: "Beast", size: "Huge", cr: 6, ac: 13, hp: 126,
        icon: "🦣", abilities: { str: 24, dex: 9, con: 21, int: 3, wis: 11, cha: 6 },
        attacks: [
            { name: "Gore", hit: 10, dmg: "4d8+7", type: "piercing" },
            { name: "Stomp", hit: 10, dmg: "4d10+7", type: "bludgeoning" }
        ],
        specials: [{
            name: "Trampling Charge", dmg: "4d10+7", type: "bludgeoning", save: { stat: "str", dc: 18 }
        }],
        traits: ["Trampling Charge"]
    },

    // ========== ELEMENTALS ==========
    "phoenix": {
        name: "Phoenix", type: "Elemental", size: "Gargantuan", cr: 16, ac: 18, hp: 175,
        icon: "🔥", abilities: { str: 19, dex: 26, con: 21, int: 2, wis: 21, cha: 18 },
        saves: { wis: 10, cha: 9 }, immunities: ["fire", "poison"],
        conditionImmunities: ["exhaustion", "grappled", "paralyzed", "petrified", "poisoned", "prone", "restrained", "stunned"],
        attacks: [
            { name: "Beak", hit: 13, dmg: "2d6+8", type: "fire" },
            { name: "Fiery Talons", hit: 13, dmg: "2d8+8", type: "fire" }
        ],
        multiattack: ["Beak", "Fiery Talons", "Fiery Talons"],
        specials: [{
            name: "Fire Form Damage", autoStart: true, dmg: "2d6", type: "fire"
        }],
        traits: ["Fiery Death and Rebirth", "Fire Form", "Flyby", "Illumination"]
    },
    "elder-tempest": {
        name: "Elder Tempest", type: "Elemental", size: "Gargantuan", cr: 23, ac: 19, hp: 264,
        icon: "🌪️", abilities: { str: 23, dex: 28, con: 23, int: 2, wis: 21, cha: 18 },
        saves: { wis: 12, cha: 11 }, immunities: ["lightning", "poison", "thunder"],
        resistances: ["cold"], conditionImmunities: ["exhaustion", "grappled", "paralyzed", "petrified", "poisoned", "prone", "restrained", "stunned"],
        attacks: [{ name: "Thunderous Slam", hit: 16, dmg: "3d12+9", type: "thunder" }],
        multiattack: ["Thunderous Slam", "Thunderous Slam"],
        specials: [{
            name: "Lightning Storm", recharge: [6], recharged: true, dmg: "8d10", type: "lightning", save: { stat: "dex", dc: 21 }, half: true, aoe: true
        }],
        legendary: 3, legActions: [
            { name: "Move", cost: 1 },
            { name: "Lightning Strike", cost: 2, dmg: "3d10", type: "lightning", save: { stat: "dex", dc: 21 } },
            { name: "Screaming Gale", cost: 3, dmg: "4d10", type: "thunder", save: { stat: "str", dc: 24 }, aoe: true }
        ],
        traits: ["Air Form", "Flyby", "Living Storm", "Siege Monster"]
    }
};

// Monster type colors for UI
const TYPE_COLORS = {
    Dragon: "#c41e3a",
    Undead: "#4a7c59",
    Fiend: "#8b0000",
    Aberration: "#6b3fa0",
    Beast: "#8b4513",
    Construct: "#708090",
    Giant: "#4169e1",
    Monstrosity: "#2e8b57",
    Elemental: "#ff6600"
};

// Get all unique monster types
function getMonsterTypes() {
    const types = new Set();
    Object.values(MONSTERS).forEach(m => types.add(m.type));
    return Array.from(types).sort();
}

// Get monsters by type
function getMonstersByType(type) {
    if (!type || type === 'All') return Object.entries(MONSTERS);
    return Object.entries(MONSTERS).filter(([k, m]) => m.type === type);
}

// Get monsters sorted by CR
function getMonstersByCR() {
    return Object.entries(MONSTERS).sort((a, b) => b[1].cr - a[1].cr);
}
