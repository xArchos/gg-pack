// Copies of default MineColonies 1.1.1420 researches that colonies/eras.js overrides
// (data/minecolonies/researches/** in the jar). Refresh after a MineColonies update.
global.ggColonyDefaultResearch = {
  // Default hut unlocks; the era researches take over the hut effects.
  unlocks: {
    "minecolonies:civilian/ambition": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 1,
          "item": "minecraft:diamond"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutmysticalsite",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutmysticalsite",
      "researchLevel": 1,
      "sortOrder": 5
    },
    "minecolonies:civilian/higherlearning": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 3,
          "item": "minecraft:book"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutschool",
          "level": 1
        }
      ],
      "exclusiveChildResearch": true,
      "icon": "minecolonies:blockhutschool",
      "requirements": [
        {
          "building": "minecolonies:residence",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 1,
      "sortOrder": 4,
      "subtitle": "com.minecolonies.research.civilian.higherlearning.subtitle"
    },
    "minecolonies:civilian/keen": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 3,
          "item": "minecraft:book"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutlibrary",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutlibrary",
      "requirements": [
        {
          "building": "minecolonies:residence",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 1,
      "sortOrder": 2
    },
    "minecolonies:civilian/remembrance": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 8,
          "item": "minecraft:bone"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutgraveyard",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutgraveyard",
      "requirements": [
        {
          "building": "minecolonies:townhall",
          "level": 2,
          "type": "minecolonies:single-building"
        }
      ],
      "researchLevel": 1,
      "sortOrder": 6,
      "subtitle": "com.minecolonies.research.civilian.remembrance.subtitle"
    },
    "minecolonies:civilian/stamina": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 1,
          "item": "minecraft:carrot"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhuthospital",
          "level": 1
        }
      ],
      "exclusiveChildResearch": true,
      "icon": "minecolonies:blockhuthospital",
      "researchLevel": 1
    },
    "minecolonies:combat/improvedbows": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 6,
          "item": "minecraft:iron_block"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutarchery",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutarchery",
      "parentResearch": "minecolonies:combat/tactictraining",
      "requirements": [
        {
          "building": "minecolonies:barracks",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2,
      "sortOrder": 2,
      "subtitle": "com.minecolonies.research.combat.improvedbows.subtitle"
    },
    "minecolonies:combat/improvedswords": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 6,
          "item": "minecraft:iron_block"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutcombatacademy",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutcombatacademy",
      "parentResearch": "minecolonies:combat/tactictraining",
      "requirements": [
        {
          "building": "minecolonies:barracks",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2,
      "subtitle": "com.minecolonies.research.combat.improvedswords.subtitle"
    },
    "minecolonies:combat/mountedcombat": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 1,
          "item": "minecraft:saddle"
        },
        {
          "count": 1,
          "item": "minecraft:lead"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutstable",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutstable",
      "parentResearch": "minecolonies:combat/tactictraining",
      "researchLevel": 2,
      "subtitle": "com.minecolonies.research.combat.mountedcombat.subtitle"
    },
    "minecolonies:combat/tactictraining": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 3,
          "item": "minecraft:iron_block"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutbarracks",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutbarrackstower",
      "requirements": [
        {
          "building": "minecolonies:guardtower",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 1,
      "sortOrder": 2
    },
    "minecolonies:technology/alchemist": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 16,
          "item": "minecraft:nether_wart"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutalchemist",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutalchemist",
      "parentResearch": "minecolonies:technology/opennether",
      "researchLevel": 3,
      "subtitle": "com.minecolonies.research.technology.alchemist.subtitle"
    },
    "minecolonies:technology/biodegradable": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:bone_meal"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutcomposter",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutcomposter",
      "requirements": [
        {
          "building": "minecolonies:farmer",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 1,
      "subtitle": "com.minecolonies.research.technology.biodegradable.subtitle"
    },
    "minecolonies:technology/flowerpower": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "item": "minecolonies:compost"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutflorist",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutflorist",
      "parentResearch": "minecolonies:technology/biodegradable",
      "requirements": [
        {
          "building": "minecolonies:composter",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2
    },
    "minecolonies:technology/hittingiron": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 1,
          "item": "minecraft:anvil"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutblacksmith",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutblacksmith",
      "requirements": [
        {
          "building": "minecolonies:miner",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 1,
      "sortOrder": 7,
      "subtitle": "com.minecolonies.research.technology.hittingiron.subtitle"
    },
    "minecolonies:technology/hot": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 4,
          "item": "minecraft:lava_bucket"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutsmeltery",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutsmeltery",
      "requirements": [
        {
          "building": "minecolonies:miner",
          "level": 2,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 1,
      "sortOrder": 6
    },
    "minecolonies:technology/letitgrow": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 16,
          "item": "minecolonies:compost"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutplantation",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutplantation",
      "parentResearch": "minecolonies:technology/biodegradable",
      "requirements": [
        {
          "building": "minecolonies:farmer",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2,
      "sortOrder": 2,
      "subtitle": "com.minecolonies.research.technology.letitgrow.subtitle"
    },
    "minecolonies:technology/opennether": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 3,
          "item": "minecraft:gilded_blackstone"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutnetherworker",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutnetherworker",
      "parentResearch": "minecolonies:technology/morescrolls",
      "researchLevel": 2,
      "sortOrder": 1,
      "subtitle": "com.minecolonies.research.technology.opennether.subtitle"
    },
    "minecolonies:technology/pavetheroad": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 32,
          "tag": "minecolonies:concrete"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutconcretemixer",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutconcretemixer",
      "parentResearch": "minecolonies:technology/rockingroll",
      "requirements": [
        {
          "building": "minecolonies:crusher",
          "level": 1,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 3,
      "sortOrder": 2,
      "subtitle": "com.minecolonies.research.technology.pavetheroad.subtitle"
    },
    "minecolonies:technology/rainbowheaven": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:poppy"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutdyer",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutcomposter",
      "parentResearch": "minecolonies:technology/biodegradable",
      "requirements": [
        {
          "building": "minecolonies:composter",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2,
      "subtitle": "com.minecolonies.research.technology.rainbowheaven.subtitle"
    },
    "minecolonies:technology/rockingroll": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:stone"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutcrusher",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutcrusher",
      "parentResearch": "minecolonies:technology/stonecake",
      "requirements": [
        {
          "building": "minecolonies:stonemason",
          "level": 1,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2
    },
    "minecolonies:technology/sieving": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:string"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutsifter",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutsifter",
      "parentResearch": "minecolonies:technology/woodwork",
      "requirements": [
        {
          "building": "minecolonies:fisherman",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2,
      "sortOrder": 2,
      "subtitle": "com.minecolonies.research.technology.sieving.subtitle"
    },
    "minecolonies:technology/stonecake": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:chiseled_stone_bricks"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutstonemason",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutstonemason",
      "requirements": [
        {
          "building": "minecolonies:miner",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 1,
      "sortOrder": 4,
      "subtitle": "com.minecolonies.research.technology.stonecake.subtitle"
    },
    "minecolonies:technology/stringwork": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 16,
          "item": "minecraft:string"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutfletcher",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutfletcher",
      "parentResearch": "minecolonies:technology/woodwork",
      "requirements": [
        {
          "building": "minecolonies:sawmill",
          "level": 1,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2
    },
    "minecolonies:technology/theflintstones": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:brick"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutstonesmeltery",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutstonesmeltery",
      "parentResearch": "minecolonies:technology/stonecake",
      "requirements": [
        {
          "building": "minecolonies:stonemason",
          "level": 1,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2,
      "subtitle": "com.minecolonies.research.technology.theflintstones.subtitle"
    },
    "minecolonies:technology/thoselungs": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:glass"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutglassblower",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutglassblower",
      "parentResearch": "minecolonies:technology/hot",
      "requirements": [
        {
          "building": "minecolonies:smeltery",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2,
      "subtitle": "com.minecolonies.research.technology.thoselungs.subtitle"
    },
    "minecolonies:technology/whatyaneed": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:redstone"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutmechanic",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutmechanic",
      "parentResearch": "minecolonies:technology/hittingiron",
      "requirements": [
        {
          "building": "minecolonies:blacksmith",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 2,
      "subtitle": "com.minecolonies.research.technology.whatyaneed.subtitle"
    },
    "minecolonies:technology/woodwork": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "tag": "minecraft:planks"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockhutsawmill",
          "level": 1
        }
      ],
      "icon": "minecolonies:blockhutsawmill",
      "requirements": [
        {
          "building": "minecolonies:lumberjack",
          "level": 3,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 1,
      "sortOrder": 5,
      "subtitle": "com.minecolonies.research.technology.woodwork.subtitle"
    }
  },
  // Tier 6 capstones; gated behind the Atom era.
  capstones: {
    "minecolonies:civilian/academic": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 128,
          "item": "minecraft:book"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/levelingmultiplier",
          "level": 5
        }
      ],
      "icon": "minecraft:experience_bottle:5",
      "parentResearch": "minecolonies:civilian/reflective",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.civilian.academic.subtitle"
    },
    "minecolonies:civilian/athlete": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:rabbit_foot"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/walkingmultiplier",
          "level": 5
        }
      ],
      "icon": "minecolonies:textures/icons/research/speed4.png",
      "parentResearch": "minecolonies:civilian/swift",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.civilian.athlete.subtitle"
    },
    "minecolonies:civilian/beanstalk": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 512,
          "item": "minecraft:cooked_chicken"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/growthmultiplier",
          "level": 5
        }
      ],
      "icon": "minecolonies:textures/icons/research/childgrowth5.png",
      "parentResearch": "minecolonies:civilian/growth",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.civilian.beanstalk.subtitle"
    },
    "minecolonies:civilian/cast": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:golden_carrot"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/regenerationmultiplier",
          "level": 5
        }
      ],
      "icon": "minecolonies:textures/icons/research/regeneration5.png",
      "parentResearch": "minecolonies:civilian/compress",
      "researchLevel": 6
    },
    "minecolonies:civilian/glutton": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 512,
          "item": "minecraft:cookie"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/saturationmultiplier",
          "level": 5
        }
      ],
      "icon": "minecolonies:textures/icons/research/saturation5.png",
      "parentResearch": "minecolonies:civilian/epicure",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.civilian.glutton.subtitle"
    },
    "minecolonies:civilian/guardianangel2": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 256,
          "item": "minecraft:hay_block"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/healthaddition",
          "level": 6
        }
      ],
      "icon": "minecolonies:textures/icons/research/hp6.png",
      "parentResearch": "minecolonies:civilian/guardianangel",
      "researchLevel": 6
    },
    "minecolonies:civilian/indefatigability": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:golden_apple"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/healingsaturationlimitaddition",
          "level": 5
        }
      ],
      "icon": "minecraft:experience_bottle",
      "parentResearch": "minecolonies:civilian/fortitude",
      "researchLevel": 6
    },
    "minecolonies:civilian/phd": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:bookshelf"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/teachingmultiplier",
          "level": 5
        }
      ],
      "icon": "minecolonies:textures/icons/research/xpgain5.png",
      "parentResearch": "minecolonies:civilian/master",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.civilian.phd.subtitle"
    },
    "minecolonies:civilian/theater": {
      "branch": "minecolonies:civilian",
      "costs": [
        {
          "count": 16,
          "item": "minecraft:enchanted_golden_apple"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/happinessmultiplier",
          "level": 5
        }
      ],
      "icon": "minecolonies:textures/icons/research/happy5.png",
      "parentResearch": "minecolonies:civilian/opera",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.civilian.theater.subtitle"
    },
    "minecolonies:combat/agilearcher": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:diamond"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/archerarmormultiplier",
          "level": 5
        }
      ],
      "icon": "minecraft:diamond_boots",
      "parentResearch": "minecolonies:combat/improvedevasion",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.combat.agilearcher.subtitle"
    },
    "minecolonies:combat/bucephalus": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 1,
          "item": "minecraft:nether_star"
        },
        {
          "count": 1,
          "item": "minecraft:black_banner"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/mounthealth",
          "level": 4
        }
      ],
      "icon": "minecraft:nether_star",
      "parentResearch": "minecolonies:combat/exerciseregimen",
      "requirements": [
        {
          "building": "minecolonies:stable",
          "level": 5,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.combat.bucephalus.subtitle"
    },
    "minecolonies:combat/captainoftheguard": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 27,
          "item": "minecraft:shield"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockattacksmultiplier",
          "level": 4
        }
      ],
      "icon": "minecraft:iron_block",
      "parentResearch": "minecolonies:combat/captaintraining",
      "researchLevel": 6
    },
    "minecolonies:combat/deadlyaim": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 256,
          "item": "minecraft:flint"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/archerdamageaddition",
          "level": 5
        }
      ],
      "icon": "minecraft:tipped_arrow",
      "parentResearch": "minecolonies:combat/woundingshot",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.combat.deadlyaim.subtitle"
    },
    "minecolonies:combat/diamondskin": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:diamond"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/armordurabilitymultiplier",
          "level": 6
        }
      ],
      "icon": "minecraft:diamond_helmet",
      "parentResearch": "minecolonies:combat/steelarmor",
      "researchLevel": 6
    },
    "minecolonies:combat/fullretreat": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:emerald"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/fleeingdamagemultiplier",
          "level": 4
        }
      ],
      "icon": "minecraft:diamond_boots",
      "parentResearch": "minecolonies:combat/retreat",
      "researchLevel": 6
    },
    "minecolonies:combat/hotfoot": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:emerald"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/fleeingspeedaddition",
          "level": 4
        }
      ],
      "icon": "minecraft:chicken",
      "parentResearch": "minecolonies:combat/flee",
      "researchLevel": 6
    },
    "minecolonies:combat/masterbarding": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 1,
          "item": "minecraft:diamond_horse_armor"
        },
        {
          "count": 5,
          "item": "minecraft:netherite_ingot"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/mountarmor",
          "level": 4
        }
      ],
      "icon": "minecraft:diamond_horse_armor",
      "parentResearch": "minecolonies:combat/advancedbarding",
      "requirements": [
        {
          "building": "minecolonies:stable",
          "level": 5,
          "type": "minecolonies:building"
        },
        {
          "building": "minecolonies:blacksmith",
          "level": 5,
          "type": "minecolonies:building"
        }
      ],
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.combat.masterbarding.subtitle"
    },
    "minecolonies:combat/masterbowman": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 27,
          "item": "minecraft:bow"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/doublearrowsmultiplier",
          "level": 4
        }
      ],
      "icon": "minecraft:blaze_rod",
      "parentResearch": "minecolonies:combat/rapidshot",
      "researchLevel": 6
    },
    "minecolonies:combat/masterswordsman": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 64,
          "item": "minecraft:diamond"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/meleearmormultiplier",
          "level": 5
        }
      ],
      "icon": "minecraft:diamond_chestplate",
      "parentResearch": "minecolonies:combat/provost",
      "researchLevel": 6
    },
    "minecolonies:combat/savagestrike": {
      "branch": "minecolonies:combat",
      "costs": [
        {
          "count": 32,
          "item": "minecraft:iron_block"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/meleedamageaddition",
          "level": 5
        }
      ],
      "icon": "minecraft:diamond_sword",
      "parentResearch": "minecolonies:combat/mightycleave",
      "researchLevel": 6
    },
    "minecolonies:technology/diamondcoated": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 128,
          "item": "minecraft:diamond"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/tooldurabilitymultiplier",
          "level": 5
        }
      ],
      "icon": "minecraft:diamond_pickaxe",
      "parentResearch": "minecolonies:technology/steelbracing",
      "researchLevel": 6
    },
    "minecolonies:technology/heavilyloaded": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 256,
          "item": "minecraft:emerald"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/citizeninvslotsaddition",
          "level": 3
        }
      ],
      "icon": "minecraft:blue_shulker_box",
      "no-reset": true,
      "parentResearch": "minecolonies:technology/loaded",
      "researchLevel": 6
    },
    "minecolonies:technology/lightning": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 2048,
          "item": "minecraft:redstone"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockbreakspeedmultiplier",
          "level": 5
        }
      ],
      "icon": "minecraft:repeater",
      "parentResearch": "minecolonies:technology/whatisthisspeed",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.technology.lightning.subtitle"
    },
    "minecolonies:technology/madness": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 1024,
          "item": "minecraft:iron_ingot"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/blockplacespeedmultiplier",
          "level": 5
        }
      ],
      "icon": "minecraft:spectral_arrow",
      "parentResearch": "minecolonies:technology/seemsautomatic",
      "researchLevel": 6
    },
    "minecolonies:technology/magiccompost": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 2048,
          "item": "minecraft:wheat_seeds"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/farmingmultiplier",
          "level": 5
        }
      ],
      "icon": "minecolonies:barrel_block",
      "parentResearch": "minecolonies:technology/fertilizer",
      "researchLevel": 6
    },
    "minecolonies:technology/motherlode": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 64,
          "tag": "minecraft:diamond_ores"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/moreoresmultiplier",
          "level": 5
        }
      ],
      "icon": "minecraft:diamond_block",
      "parentResearch": "minecolonies:technology/amazingveins",
      "researchLevel": 6
    },
    "minecolonies:technology/rainman": {
      "branch": "minecolonies:technology",
      "costs": [
        {
          "count": 27,
          "item": "minecraft:salmon_bucket"
        }
      ],
      "effects": [
        {
          "id": "minecolonies:effects/workinginrainunlock",
          "level": 1
        }
      ],
      "icon": "minecraft:splash_potion",
      "parentResearch": "minecolonies:technology/rtm",
      "researchLevel": 6,
      "subtitle": "com.minecolonies.research.technology.rainman.subtitle"
    }
  },
}
