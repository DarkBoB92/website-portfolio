export const projects = [
  {
    id: 0,
    name: 'POTATO BONANZA EXTRAVAGANZA',
    meta: 'ROGUELIKE SHOOTER · GROUP · 2023/24',
    tech: 'UNITY · C#',
    tags: ['ROGUELIKE', 'GROUP PROJECT', 'UNITY', 'C#', '2023/24'],
    section: 'THE GAME',
    description: 'An isometric roguelike twin-stick shooter built in Unity by a team of three. You play a potato fighting back the kitchen tools sent to destroy it, surviving five minutes of escalating waves while dodging environmental hazards. Features a currency-based enemy spawner, three enemy types, a power-up system, and full gamepad support.',
    role: 'Gameplay Programmer & Debugger — Input System migration, shooting/weapon/power-up systems, and the team\'s go-to for fixing broken code.',
    systems: [
      { name: 'Input System Migration', desc: 'Rebuilt the game\'s controls onto Unity\'s new Input System, supporting keyboard, mouse and full gamepad — including menu navigation, all running in one build.' },
      { name: 'Shooting & Weapons', desc: 'Built the firing system for both weapons — a straight-firing knife and a timed explosive egg grenade that can hurt the player too, forcing careful aim.' },
      { name: 'Power-Up System', desc: 'Seven collectable upgrades that change how the player shoots — more projectiles, faster fire rate, bigger throws — dropped between waves.' },
      { name: 'Debugging & Fixes', desc: 'Diagnosed and fixed the two hardest bugs: a spawner that froze when enemies weren\'t cleared from its list, and a wave counter that skipped waves by running a frame too early.' },
    ],
    code: {
      caption: 'The rest-break bug: the wave coroutine advanced before the spawn lists were actually empty. The fix was an explicit check that both lists are clear before incrementing.',
      snippet: `// Only advance the wave once every enemy is truly gone
if (spawnedEnemies.Count == 0 && spawnEnemies.Count == 0)
{
    currentWave++;
    StartCoroutine(CreatingWave());
}`,
    },
    journey: 'My first group project, and the one where I became the team\'s go-to for untangling broken code — a running joke that became reality, since a fresh pair of eyes usually found the flaw. I owned the migration to Unity\'s new Input System after a teammate had started on the old one: the hard part was keeping two input systems alive in the same build, wiring the menu flow, and adapting movement and shooting to the isometric camera. I built the shooting, weapon and power-up systems around it, and took on the debugging nobody else could crack — including a spawner that froze when enemies weren\'t cleared from its list, and a rest-break coroutine that skipped waves by running two frames early. The sharpest lesson came from version control: with the whole team new to Git, a teammate renamed and moved a script onto their own branch, and after a clean merge every Unity reference pointing to it silently broke. Untangling that cost me an afternoon — and taught me more about repositories than any tutorial could.',
    github: '#',
    itch: null,
  },
  {
    id: 1,
    name: 'REIGN OF ELEMENTS',
    meta: 'ACTION-RPG · PUZZLE · 2023/24',
    tech: 'UNITY · C#',
    tags: ['ACTION-RPG', 'PUZZLE', 'UNITY', 'C#', '2023/24'],
    section: 'THE GAME',
    description: 'Reign Of Elements: Legacy Of The Dragon Mages — a top-down pixel-art action-RPG built solo in Unity. Players wield fire, water and earth spells both as weapons and as keys: each element cancels a matching elemental obstacle (fire opens ice, water opens rock, earth opens fire), turning combat and puzzle-solving into the same system. Collecting power gems unlocks a draconic transformation with new abilities.',
    role: 'Solo Developer — full architecture, gameplay systems, and pixel art. My first project built deliberately around clean object-oriented design.',
    systems: [
      { name: 'Shared Element System', desc: 'A single source of truth for the three elements, used everywhere — casting a spell, taking damage, and opening the matching puzzle doors all reference the same definition, so adding an element later means changing one file.' },
      { name: 'Universal Health Component', desc: 'One reusable health system that any object — player, enemy, or destructible — can use to take damage and track status effects, written once instead of duplicated per character.' },
      { name: 'Inheritance-Based Enemies & Items', desc: 'Enemies and collectibles share common parent behaviour, with specific types (melee/ranged enemies, keys/potions/gems) extending it — keeping the code clean and easy to expand.' },
      { name: 'Player Transformation', desc: 'Collecting power gems transforms the mage into a draconic form, swapping sprites, animations and available spells at runtime.' },
    ],
    code: {
      caption: 'The shared element type lives in its own namespace, so every system references the same definition instead of each script defining its own.',
      snippet: `namespace SpellType
{
    public enum Element { Neutral, Fire, Water, Earth }
}

// Used identically across spells, doors, altars and enemies
if (spell.element == door.element)
    door.Open();`,
    },
    journey: 'This is the project that set my programming style — the baseline I have built from ever since. Coming straight off my first group game, where the shared build ended up with two competing health systems, I went solo here determined to do it properly: write each system once, cleanly, so it is easy to change later. That produced a universal Health component any object can use, and two abstract parent classes — Enemy and Collectible — with Melee/Ranged and Key/Potion/PowerGem inheriting and overriding from them. The design decision I am most satisfied with is the SpellType namespace: rather than scatter the element enum across scripts, I gave every system — spell casting, damage, and the puzzle-door logic — a single shared source of truth, so extending the elements later meant touching one file, not hunting through many. It was the first time architecture felt deliberate rather than incidental, and everything I have built since has improved from this point.',
    github: '#',
    itch: null,
  },
  {
    id: 2,
    name: 'THE BIZARRE GRAMOPHONE',
    meta: 'PHYSICAL COMPUTING · 2024/25',
    tech: 'ARDUINO · C/C++',
    tags: ['PHYSICAL COMPUTING', 'GROUP PROJECT', 'ARDUINO', '2024/25'],
    section: 'THE PROJECT',
    description: 'A physical computing group project built for the Physical Computing module. The Bizarre Gramophone is an interactive puzzle box controlled by an Arduino, combining electronics, sensors and custom firmware to create a tactile puzzle experience.',
    journey: 'This project pushed into hardware territory — wiring sensors and outputs, writing low-level C/C++ firmware for the Arduino, and making physical components behave reliably as part of an interactive system. Bridging the gap between software logic and real-world electronics was a genuinely different challenge from purely digital projects.',
    github: '#',
    itch: null,
  },
  {
    id: 3,
    name: 'ECHOES OF ALCHEMY',
    meta: 'GAMEPLAY · 2024/25',
    tech: 'UNREAL · BLUEPRINTS',
    tags: ['GAMEPLAY', 'UNREAL', 'BLUEPRINTS', '2024/25'],
    section: 'THE GAME',
    description: 'Second year project built in Unreal Engine using Blueprints. An alchemy-themed gameplay prototype where players combine elemental reagents to solve puzzles and progress through an atmospheric world.',
    journey: 'First deep dive into Unreal Engine and the Blueprint visual scripting system. Learning to think in event-driven, node-based logic rather than imperative code was a significant mental shift — opening the door to understanding how visual scripting maps to underlying C++ systems.',
    github: '#',
    itch: null,
  },
  {
    id: 4,
    name: 'PROCEDURAL SCENE POPULATOR',
    meta: 'DEV TOOL · 2024/25',
    tech: 'UNREAL · C++',
    tags: ['DEV TOOL', 'UNREAL', 'C++', '2024/25'],
    section: 'THE TOOL',
    description: 'A custom Unreal Engine editor tool built entirely in C++. The Procedural Scene Populator allows level designers to populate scenes with assets procedurally using rule-based placement, dramatically reducing manual asset placement time.',
    journey: 'Building editor tooling in C++ required understanding Unreal\'s module system, Slate UI framework, and the editor subsystem architecture at a low level. Gave direct insight into how professional studios build internal tooling pipelines.',
    github: '#',
    itch: null,
  },
  {
    id: 5,
    name: 'CATPPUCCINO',
    meta: 'GROUP PROJECT · 2025/26',
    tech: 'UNITY · C#',
    tags: ['GROUP PROJECT', 'UNITY', 'C#', '2025/26'],
    section: 'THE GAME',
    description: 'Final year group project built in Unity. Catppuccino features a live weather API integration that dynamically affects gameplay based on real-world weather conditions at the player\'s location.',
    journey: 'Role: external API configuration and save file system. Architecting a robust weather API pipeline in Unity — handling async requests, parsing JSON responses, mapping real-world weather to in-game state, and persisting player data reliably — required a systems-thinking approach tying together several disciplines at once.',
    github: '#',
    itch: 'https://itsazel.itch.io/catpuccino',
  },
  {
    id: 6,
    name: 'CELLULAR AUTOMATA',
    meta: 'SIMULATION · AI · 2025/26',
    tech: 'UNITY · C#',
    tags: ['SIMULATION', 'AI', 'UNITY', 'C#', '2025/26'],
    section: 'THE PROJECT',
    description: 'A third year AI project exploring emergent behaviour through cellular automata simulation, implemented in Unity (C#). Studies how complex, lifelike patterns emerge from simple rule sets applied across a grid.',
    journey: 'Working at the intersection of AI theory and visual simulation, this project sparked a sustained interest in emergent systems and their applications in game AI — how simple agent rules produce complex, believable behaviour without central coordination.',
    github: '#',
    itch: null,
  },
  {
    id: 7,
    name: 'AUDIO-REACTIVE SHADERS',
    meta: 'VFX · 2025/26',
    tech: 'UNREAL · HLSL',
    tags: ['VFX', 'UNREAL', 'HLSL', 'BLUEPRINTS', '2025/26'],
    section: 'THE PROJECT',
    description: 'A real-time audio-reactive visual system in Unreal Engine. Audio drives spectral band analysis feeding into a custom HLSL shader pipeline — controlling UV distortion, colour modulation, and post-process effects in real time. Shaders range from lightweight geometric patterns to heavy raymarching fractals.',
    journey: 'Pipeline: audio submix → Blueprint spectral analysis → normalisation → parameter mapping → HLSL custom nodes and post-process materials. Performance ranged from 80–100 FPS on simple shaders to ~30 FPS on complex raymarching — a direct lesson in GPU budget management and real-time performance trade-offs.',
    github: '#',
    itch: null,
  },
  {
    id: 8,
    name: 'VR ESCAPE ROOM',
    meta: 'PUZZLE · VR · 2025/26',
    tech: 'UNITY · XR TOOLKIT',
    tags: ['PUZZLE', 'CO-OP', 'VR', 'UNITY', '2025/26'],
    section: 'THE GAME',
    description: 'A multiplayer VR escape room built in Unity using XR Interaction Toolkit 3.0 and Netcode for GameObjects 2.x. Players collaborate in VR to solve interconnected puzzles, with networked object interaction and synchronised game state across clients.',
    journey: 'As Game Mechanics Programmer, building robust networked XR interactions required solving Netcode latency issues and XR-specific edge cases like hand tracking drift and collider mismatches. Deepened both networking and VR development expertise significantly.',
    github: '#',
    itch: null,
  },
  {
    id: 9,
    name: 'XR TRAINING SIM',
    meta: 'DISSERTATION · 2025/26',
    tech: 'UNITY · MR · QUEST 3',
    tags: ['RESEARCH', 'UNITY', 'MR', 'QUEST 3', '2025/26'],
    section: 'THE PROJECT',
    description: 'BSc Dissertation: "Assessing the Effectiveness of Extended Reality Simulation Training for Learning a Physical Skill." A custom Mixed Reality training application in Unity 6 for Meta Quest 3, paired with a physical target system using FSRs and an Arduino Mega 2560. Pre-test/post-test study of 20 participants. Awarded First Class Honours.',
    journey: 'The central finding — conditional negative transfer — showed that MR proficiency alone does not predict physical performance improvement; application strategy matters more than accuracy score. The T5 vs T9 contrast was the key result that challenged the initial hypothesis and led to the most interesting analysis.',
    github: '#',
    itch: null,
  },
]

export const skills = [
  {
    group: 'ENGINES',
    items: [
      {
        name: 'UNITY',
        icon: 'cube',
        spec: 'Gameplay systems · OOP architecture · Networked multiplayer · External API integration · Mobile (Android)',
        match: ['UNITY'],
      },
      {
        name: 'UNREAL ENGINE',
        icon: 'engine',
        spec: 'Companion AI · Physics-driven puzzles · Blueprints · Material nodes & HLSL shaders · Niagara VFX · Slate editor tooling',
        match: ['UNREAL'],
      },
    ],
  },
  {
    group: 'LANGUAGES',
    items: [
      {
        name: 'C#',
        icon: 'brackets',
        spec: 'Gameplay logic · Networking · API integration · Tool scripting',
        match: ['C#'],
      },
      {
        name: 'C++',
        icon: 'brackets',
        spec: 'Unreal systems & editor tooling · Arduino firmware',
        match: ['C++', 'C/C++'],
      },
      {
        name: 'HLSL',
        icon: 'shader',
        spec: 'Audio-reactive shaders · Material & VFX work',
        match: ['HLSL'],
      },
    ],
  },
]
