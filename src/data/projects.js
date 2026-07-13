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
    video: 'videos/potato-bonanza-showcase.mp4',
    thumbnail: 'images/potato-bonanza-card.png',
    thumbnailVideo: 'videos/potato-bonanza-card-loop.mp4',
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
    video: 'videos/reign-of-elements-showcase.mp4',
    thumbnail: 'images/reign-of-elements-card.png',
    thumbnailVideo: 'videos/reign-of-elements-card-loop.mp4',
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
    meta: 'PHYSICAL COMPUTING · GROUP · 2024/25',
    tech: 'ARDUINO · C/C++',
    tags: ['PHYSICAL COMPUTING', 'GROUP PROJECT', 'ARDUINO', '2024/25'],
    section: 'THE PROJECT',
    thumbnail: 'images/gramophone-card.gif',
    gallery: [
      { src: 'images/gramophone-exterior-front.jpg', caption: 'The finished build — vinyl loaded, tonearm resting on the record' },
      { src: 'images/gramophone-exterior-side.jpg', caption: 'Second exterior angle, showing the drilled panel for the conductive touch-button puzzle' },
      { src: 'images/gramophone-internals.jpg', caption: 'Every sensor, actuator and breadboard wired inside — RFID reader, speaker, capacitive buttons, no game engine involved' },
      { src: 'images/gramophone-early-prototype.jpg', caption: 'Where it started — an early paper-and-cardboard test of the horn and tonearm concept, before any electronics were involved' },
    ],
    description: 'A physical computing group project built for the Physical Computing module. The Bizarre Gramophone is an interactive puzzle box styled as a vintage gramophone, combining a rotary-encoder crank, spinning vinyl, capacitive touch buttons, Hall effect sensors, RFID puzzle selection and audio-driven clues into a working two-puzzle prototype — built entirely on an Arduino Mega, no game engine involved.',
    role: 'Hardware & Electronics Lead — wired and integrated every sensor and actuator in the build, co-designed the puzzle mechanics with a teammate, and debugged the crank/LED sync fault that put the whole progression system at risk close to deadline.',
    systems: [
      { name: 'Electronics Integration', desc: 'Wired and assembled every sensor and actuator into one working chassis: rotary encoder, capacitive touch buttons, Hall effect sensors, a potentiometer, DC motor with driver, RFID reader and the audio/SD playback system.' },
      { name: 'Puzzle Design', desc: 'Co-designed both solvable puzzle paths with a teammate — a hidden-passcode sequence read from audio cues and replayed on touch buttons, and a magnet-placement sequence read by Hall sensors.' },
      { name: 'Crank/LED Sync Fix', desc: 'Close to deadline, the crank counter and its LED progress indicators fell out of sync and stopped resetting correctly. Took ownership of debugging the full rotary logic end to end and found the fault.' },
      { name: 'Physical Build', desc: 'Built the wooden chassis from scratch with a teammate, including refitting the Hall sensors after discovering the electromagnetic latch system was interfering with their magnetic readings.' },
    ],
    journey: 'This was my first project entirely off a game engine — pure microcontroller electronics, which meant proving our understanding with real hardware rather than familiar tools. My role was largely the wiring and integration: every sensor and actuator in the final build passed through my hands, while a teammate and I worked out the puzzle logic together and another teammate adapted the code as the design evolved. Close to the deadline, the crank counter and its LED indicators drifted out of sync and stopped resetting — nobody could pin it down, so I took the whole rotary encoder script under my own steam and traced it through until I found the fault. On the hardware side, we\'d planned the case around Hall effect sensors and an electromagnetic latch, only to find the latch\'s own field was interfering with the sensor readings once installed — meaning I had to physically reposition them alongside a teammate mid-build. What I\'m proudest of is the case itself: starting from a slab of cheap plywood cut at B&Q and building an actual box around all of it by hand. The honest gap is that we never wired the two puzzles into a single continuous loop — each was tested and confirmed working in isolation, but not chained together as one flow, which is the clearest next step if this were taken further.',
    github: '#',
    itch: null,
  },
  {
    id: 3,
    name: 'ECHOES OF ALCHEMY',
    meta: 'PUZZLE-ADVENTURE · 2024/25',
    tech: 'UNREAL · BLUEPRINTS',
    tags: ['PUZZLE-ADVENTURE', 'UNREAL', 'BLUEPRINTS', '2024/25'],
    section: 'THE GAME',
    video: 'videos/echoes-of-alchemy-showcase.mp4',
    thumbnail: 'images/echoes-of-alchemy-card.png',
    thumbnailVideo: 'videos/echoes-of-alchemy-card-loop.mp4',
    description: 'A solo puzzle-adventure built in Unreal Engine, entirely in Blueprints. Players take on alchemist Gideon Blackwood, accompanied by AI companion Brio, exploring a cel-shaded dungeon to craft the legendary Philosopher\'s Stone. Combines environmental puzzles, an alchemical crafting system, and a navmesh-driven companion who can solve puzzles independently — refined across two rounds of playtesting.',
    role: 'Solo Developer — full Blueprint architecture, including companion AI/navmesh, physics-driven puzzle doors, dynamic audio layering, and lighting.',
    systems: [
      { name: 'Companion AI & Navmesh', desc: 'Brio follows the player through the dungeon and can be commanded to solve puzzles independently, using navmesh pathing refined across playtests to stop him blocking the player or getting stuck.' },
      { name: 'Physics-Driven Doors', desc: 'A raycast system detects the player\'s approach direction so stone doors open away from them, whichever way they\'re walking — including reversing direction correctly when backtracking.' },
      { name: 'Alchemical Crafting', desc: 'Players gather materials and combine them at an alchemy table using unlockable pentagram recipes, tying resource gathering directly into puzzle progression.' },
      { name: 'Dynamic Audio & Lighting', desc: 'Ambient soundscapes and music cross-fade between areas based on player state, while dynamic lighting — bloom, shadow casting, flickering torches — reinforces the cel-shaded look and quietly guides the player\'s eye.' },
    ],
    code: {
      caption: 'Simplified from the Blueprint graph — the recurring door bug: with the player and Brio both near the doorway, overlapping collision volumes on the direction-check made the trigger fire twice and occasionally read the wrong direction.',
      snippet: `Event ActorBeginOverlap (Door Trigger)
  → Get Approach Direction (dot product: player forward vs door normal)
  → Branch: Direction == Previous Direction?
      True  → Ignore (debounce duplicate fire)
      False → Open Door (Inverse of Approach Direction)
             → Set Previous Direction`,
    },
    journey: 'This was my first solo project in Unreal, built entirely in Blueprints, and the one where a companion character had to feel genuinely helpful rather than a set piece — Brio needed navmesh logic reliable enough to path around the player and solve puzzles on command, which took several passes of playtesting to stop him blocking doorways or getting stuck on geometry. The hardest technical problem was the physics-driven door system: I used a raycast to detect which way the player was approaching so doors would always open away from them, including on the way back. It worked cleanly most of the time, but when the player and Brio were both near a doorway their overlapping collision volumes confused the direction check, occasionally firing the trigger twice or reading the wrong direction — my marker caught this directly, noting the doors "took several goes to enter". I never fully resolved the overlap case within the project\'s scope, which is the honest gap in an otherwise-working system. Two rounds of peer playtesting shaped most of the rest: the first round flagged puzzle variety and onboarding clarity, which fed into clearer visual cues for interactables; the second surfaced the door and animation bugs alongside requests for a more populated world, which became the basis for my post-submission plan around more NPCs and expanded companion dialogue.',
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
    video: 'videos/procedural-scene-populator-showcase.mp4',
    thumbnail: 'images/procedural-scene-populator-card.png',
    thumbnailVideo: 'videos/procedural-scene-populator-card-loop.mp4',
    description: 'A custom Unreal Engine editor plugin built entirely in C++. The Procedural Scene Populator raycasts across a user-defined grid, checking density, spacing and reference-proximity constraints before spawning and surface-snapping prefabs — automating scene population while keeping the designer in full control of the rules.',
    role: 'Solo Developer — full C++ plugin architecture: the grid-based placement engine, the constraint and spacing system, and the Slate editor UI, built entirely inside Unreal.',
    systems: [
      { name: 'Constraint-Based Placement Engine', desc: 'Raycasts down through each grid cell to find the surface, checks it against a density roll and minimum spacing, then spawns and surface-normal-aligns the prefab so it sits flush on uneven terrain.' },
      { name: 'Reference Influence Zones', desc: 'A dynamic list of actor or static-mesh reference points, each with its own influence radius — restricts spawning to, say, only near a path or fence, with several references combinable at once.' },
      { name: 'Occupancy Grid', desc: 'A boolean grid marks cells around every successful spawn as occupied, so nothing clusters or overlaps within the configured spacing, without needing to re-check every existing actor each time.' },
      { name: 'Editor-Safe Transactions', desc: 'Every placement run is wrapped in an Unreal editor-scoped transaction, so a full batch of spawns undoes in a single Ctrl-Z rather than actor by actor.' },
    ],
    code: {
      caption: 'Simplified from the plugin\'s C++ — the per-cell check before a spawn is attempted: density roll, reference-influence radius, then spacing against anything already placed.',
      snippet: `for (auto& Cell : Grid)
{
    if (Cell.Occupied || FMath::FRand() > Density) continue;
    if (!IsWithinReferenceInfluence(Cell, ReferenceConstraints)) continue;
    if (IsTooCloseToExistingSpawn(Cell, MinimumSpacing)) continue;

    FHitResult Hit;
    if (TraceDownFromCell(Cell, Hit))
    {
        SpawnAndSnapToSurface(Hit, SpawnPrefab);
        MarkNearbyCellsOccupied(Cell, MinimumSpacing);
    }
}`,
    },
    journey: 'This one started ambitious and ended honest. The proposal was built entirely around Stitched Wave Function Collapse — genuine constraint propagation, where each grid cell holds a superposition of possibilities that collapses as its neighbours resolve. Once I got into implementation, getting true WFC working in 3D against an existing static scene turned into far more than a single module could absorb. I made the call to scope it back to something I could actually finish properly: raycast each grid cell, check spacing and reference-influence radii up front, then spawn and surface-snap whatever passes — rather than ship a half-working propagation engine. It behaves like a WFC-style collapse from the outside, but it is honestly closer to constraint-checked procedural placement, and I would rather say that plainly than let the name oversell it.\n\nThe scope call paid off. My marker\'s write-up praised how cleanly it worked end to end, with edge cases handled well enough that they said they could see themselves genuinely using it as a level designer — particularly how placement worked relative to existing surfaces, and how the near-to-only influence constraint held up without breaking. The code was called out as well-structured and well-commented internally, with one fair criticism: I built the Slate UI directly inside the plugin\'s main .cpp instead of pulling it into its own widget class. It works, and it is neat enough for the scope, but it is the first thing I would refactor if I picked this back up — separating the UI from the placement logic properly instead of sharing a file.\n\nOne thing that never made it in: randomised rotation on spawn. Everything places surface-aligned but at identical orientation, which is a small change that would make scattered placement look far less uniform. Known gap, not a hidden one — I ran out of runway before I got to it.',
    github: '#',
    itch: null,
  },
  {
    id: 5,
    name: 'CATPPUCCINO',
    meta: 'CAFE SIM · GROUP · 2025/26',
    tech: 'UNITY · C#',
    tags: ['CAFE SIM', 'GROUP PROJECT', 'MOBILE', 'UNITY', 'C#', '2025/26'],
    section: 'THE GAME',
    video: 'videos/catpuccino-showcase.mp4',
    thumbnail: 'images/catpuccino-card.png',
    thumbnailVideo: 'videos/catpuccino-card-loop.mp4',
    description: 'A cosy cafe-management sim for mobile, built by a five-person team under an external industry brief from Frontier Developments. Serve drinks to customers with distinct personalities, brew and customise orders, and grow a cafe whose foot traffic and mood shift with live real-world weather at the player\'s location. Presented in its final form to a former Frontier Head of Game Design.',
    role: 'Programmer — mobile touch-input character controller, live weather API integration, customer behaviour and mood-meter systems, and camera movement, plus game-flow diagrams and team workflow (Trello/Discord/Drive) for the five-person team.',
    systems: [
      { name: 'Mobile Touch-Input Controller', desc: 'Built the core character movement system from scratch for touch input — first time developing for mobile, so translating a screen drag into consistent movement inside the 3D cafe needed independent research rather than adapting an existing controller.' },
      { name: 'Live Weather API Integration', desc: 'Wired the cafe to real-world weather at the player\'s location — async requests, JSON parsing, and mapping conditions like rain or sun onto in-game customer footfall and mood, tying an external data feed directly into the core loop rather than a cosmetic layer.' },
      { name: 'Customer AI & Mood Meter', desc: 'Designed the customer behaviour and mood-meter logic — how a customer\'s patience and satisfaction respond to order accuracy and wait time, driving repeat custom and takings.' },
      { name: 'Camera & Game Flow', desc: 'Built the camera movement for the cafe view and mapped the flow diagrams tying together the main menu, settings, tutorial and the three-part game loop end to end.' },
    ],
    code: {
      caption: 'Simplified from the weather integration — mapping a fetched real-world condition onto in-game customer traffic and mood.',
      snippet: `async Task ApplyWeather(string condition)
{
    WeatherProfile profile = WeatherProfiles.ContainsKey(condition)
        ? WeatherProfiles[condition]
        : WeatherProfiles["Default"];

    customerSpawnRate *= profile.TrafficMultiplier;
    moodModifier = profile.MoodBias;
}`,
    },
    journey: 'This was the first project with a real external client rather than a module brief in isolation — Frontier Developments (Planet Coaster, Jurassic World Evolution) set the brief, and the final presentation went to a former Head of Game Design there. That changes what "finished" means: alongside the actual game, the team had to work through a monetisation model, a production roadmap, and live external data tied clearly into gameplay, on top of building for mobile for the first time.\n\nThe mobile side was the steepest individual learning curve. Every character controller I\'d written before assumed a keyboard or gamepad; touch input meant rethinking movement from scratch — turning a drag on a 2D screen into consistent movement around a 3D cafe, with no existing template to adapt. The weather integration was a similar jump on the systems side: parsing live JSON weather data and mapping it onto customer footfall and mood in a way that actually felt connected to the gameplay loop, rather than bolted on as decoration.\n\nWith five of us on the team, I also ended up owning the process side almost by accident — setting up Trello, Discord and a shared Drive structure early on because nobody else had, which then doubled as the reference for the flow diagrams (menu, settings, tutorial, and the three-part game loop) I drew up alongside the tech evaluation and the legal/ethical/security/professional analysis.',
    github: '#',
    itch: 'https://itsazel.itch.io/catpuccino',
  },
  {
    id: 6,
    name: 'CELLULAR AUTOMATA',
    meta: 'SIMULATION · AI · 2025/26',
    tech: 'UNITY · C#',
    tags: ['SIMULATION', 'AI', 'UNITY', 'C#', '2025/26'],
    video: 'videos/cellular-automata-showcase.mp4',
    thumbnail: 'images/cellular-automata-card.png',
    thumbnailVideo: 'videos/cellular-automata-card-loop.mp4',
    section: 'THE PROJECT',
    description: 'A solo AI in Games project exploring 2D Cellular Automata: how varying the neighbourhood definition — Moore, Plus, Cross, and a directional block — changes emergent behaviour under Conway\'s Game of Life rules, then introducing an original alternative ruleset ("BoB\'s Game of Life") and finally running both systems on the same grid to see which one wins contested cells.',
    role: 'Solo Developer — full grid and simulation architecture, four neighbourhood configurations, an original alternative ruleset, and the conflict-resolution logic for running two competing automata on one shared grid.',
    systems: [
      { name: 'Double-Buffered Grid', desc: 'Two state grids per ruleset (current and next), fully evaluated before swapping, so every cell reads a consistent snapshot of the previous generation instead of an already-updated neighbour mid-pass.' },
      { name: 'Configurable Neighbourhoods', desc: 'Neighbour positions come from swappable offset arrays rather than hard-coded checks, so Moore, Plus, Cross and a directional 2x3 block all run against the same rule-evaluation code, with wrap-around edges to avoid boundary special-casing.' },
      { name: 'BoB\'s Game of Life', desc: 'An original ruleset built by keeping Conway\'s birth/survival structure but rewriting the thresholds per neighbourhood — e.g. Moore birth on 3–6 neighbours, survival on an odd count — scoped back from an earlier lookup-table idea that got complex fast.' },
      { name: 'Cross-Ruleset Conflict Resolution', desc: 'When Conway and BoB both claim the same cell, ownership goes to whichever ruleset has more of its own cells in the local neighbourhood; an exact tie kills the cell, letting two independent systems compete for territory on one grid.' },
    ],
    code: {
      caption: 'Simplified from the conflict-resolution step — deciding which ruleset, if either, owns a cell both are trying to claim.',
      snippet: `if (conwayNext[x, y] && bobNext[x, y])
{
    int conwayInfluence = CountNeighbours(conwayGrid, x, y);
    int bobInfluence = CountNeighbours(bobGrid, x, y);

    if (conwayInfluence > bobInfluence) owner = Owner.Conway;
    else if (bobInfluence > conwayInfluence) owner = Owner.BoB;
    else owner = Owner.None; // exact tie kills the cell
}`,
    },
    journey: 'This one started from a genuine "what if" question: if I changed only the neighbourhood definition and left Conway\'s birth/survival rules untouched, how differently would the same rules behave? That curiosity became the whole project\'s spine — Moore, Plus, Cross and a directional 2x3 block all run against identical B3/S23 logic, isolating neighbourhood shape as the only variable.\n\nOnce that baseline worked, I wanted a genuinely different ruleset to compare against, not just another neighbourhood on Conway\'s rules. My first instinct was a lookup table keyed on the exact positions of alive neighbours, not just their count — more expressive, but it ballooned in complexity almost immediately and would have eaten the rest of the project\'s time. I scoped it back to keeping Conway\'s birth/survival structure but rewriting the thresholds per neighbourhood shape, which is how BoB\'s Game of Life ended up feeling genuinely different — denser, less stable patterns — without becoming unmaintainable.\n\nThe hardest part was getting both rulesets to run on the same grid without corrupting each other\'s state. Grid creation and simulation logic started tightly coupled, which made it nearly impossible for two systems to safely read and write the same data, so I split it into a Grid Manager for creation and rendering, and a separate Cellular Automata script for rule evaluation, with rule selection handled dynamically rather than through separate classes per ruleset.\n\nThe honest limitation, and my marker flagged it directly: the code works and is genuinely readable, but it is a monolithic pair of scripts held together by a lot of conditional branching rather than properly separated classes per ruleset or neighbourhood type. Splitting rule sets and neighbourhood types into their own classes behind a shared interface would be the obvious next pass, and would also help the scalability problem that comes with evaluating both rulesets per cell every generation.',
    github: '#',
    itch: null,
  },
  {
    id: 7,
    name: 'AUDIO-REACTIVE SHADERS',
    meta: 'VFX · 2025/26',
    tech: 'UNREAL · HLSL',
    tags: ['VFX', 'UNREAL', 'HLSL', 'BLUEPRINTS', '2025/26'],
    video: 'videos/audio-reactive-shaders-showcase.mp4',
    thumbnail: 'images/audio-reactive-shaders-card.png',
    thumbnailVideo: 'videos/audio-reactive-shaders-card-loop.mp4',
    section: 'THE PROJECT',
    description: 'A solo real-time audio-reactive visual system in Unreal Engine, built as a seated, planetarium-style experience rather than a conventional game scene. Audio is split into frequency bands, normalised, and mapped onto a library of HLSL shaders — ten adapted from ShaderToy GLSL sources and one written from scratch — driving UV distortion, colour modulation and post-process effects in real time.',
    role: 'Solo Developer — the full audio-to-shader pipeline: Blueprint spectral analysis, parameter normalisation, HLSL porting and authoring, and post-process material work.',
    systems: [
      { name: 'Audio Analysis Pipeline', desc: 'Unreal\'s Submix system extracts frequency data from the track, splitting it into bass/mid/high bands, then normalises the values so shader behaviour stays consistent across tracks with very different loudness and mix profiles.' },
      { name: 'GLSL → HLSL Shader Porting', desc: 'Ten of eleven shaders (Alien Core, Crazy 3D Pipes, Fractal Pyramids, Kaleidoscope, Starry Kaleidoscope, Limestone Cave, Octagrams, Psy Tube, Quanta Half, Rocaille) were adapted from ShaderToy GLSL sources into Unreal\'s HLSL material system, exposing audio-driven parameters the originals didn\'t have; "My First Shader" was authored from scratch.' },
      { name: 'Audio-Driven Material Parameters', desc: 'Custom HLSL nodes take the normalised band values and drive UV distortion amplitude/speed and colour modulation, so bass and mid frequencies visibly change shader behaviour in real time rather than just triggering static presets.' },
      { name: 'Post-Process Layer', desc: 'Screen-space post-process materials (Dreamy, Electric, Unstable) apply audio-driven colour grading and distortion across the whole scene, layered on top of the per-object shaders rather than replacing them.' },
    ],
    code: {
      caption: 'Simplified from the audio-to-parameter mapping — normalising a raw band value before it drives any shader parameter.',
      snippet: `float NormaliseBand(float rawValue, float minClamp, float maxClamp)
{
    float clamped = clamp(rawValue, minClamp, maxClamp);
    return (clamped - minClamp) / (maxClamp - minClamp);
}

// UV distortion amplitude scales directly with the normalised bass band
float distortionAmount = NormaliseBand(bassBand, 0.0, 1.0) * MaxDistortion;`,
    },
    journey: 'This started from a deliberately non-gaming reference point — planetarium-style audio-visual art rather than a game scene, influenced by Jon Weinel and Chris Speed\'s immersive audio-visual work. That framing shaped the whole project: a seated experience where the user plays a track and looks around while the visuals respond, rather than a level to walk through.\n\nThe technical core is the pipeline from sound to shader: Unreal\'s Submix system extracts frequency bands, which get normalised — raw audio can spike or sit far too quiet depending on the track, so clamping and scaling was essential for consistent behaviour across very different music. Those normalised values then drive custom HLSL nodes controlling UV distortion, colour, and animation speed.\n\nMost of the shader library is porting work rather than from-scratch authorship, and I want to be upfront about that rather than let "shader project" oversell it: ten of the eleven shaders started life as ShaderToy GLSL sources, which I converted into Unreal\'s HLSL material system and then wired to the audio pipeline so they respond to sound instead of running as static loops — porting syntax and structure across shader languages while exposing new parameters the originals never had. Only "My First Shader" was written entirely from scratch. My marker\'s presentation feedback specifically praised the porting understanding while flagging that I should have credited the original authors more clearly — a fair note, and one I\'m fixing here rather than repeating.\n\nPerformance became its own lesson: simple shaders held 80–100 FPS, but the raymarched scenes dropped to around 30 FPS, which is exactly why raymarching sees limited use in real-time game contexts despite how striking it looks — a trade-off my marker specifically called out as a good thing to have noticed. There is an honest unresolved bug too: the first-person character falls through the floor in the scene, and despite it working reliably on my own laptop, I never pinned down which project or engine setting made the difference — it is a known gap, not a hidden one.',
    github: '#',
    itch: null,
  },
  {
    id: 8,
    name: 'RELAY',
    meta: 'PUZZLE · CO-OP · GROUP · 2025/26',
    tech: 'UNITY · XR TOOLKIT',
    tags: ['PUZZLE', 'CO-OP', 'VR', 'UNITY', 'C#', '2025/26'],
    video: 'videos/relay-showcase.mp4',
    thumbnail: 'images/relay-card.png',
    thumbnailVideo: 'videos/relay-card-loop.mp4',
    section: 'THE GAME',
    description: 'A two-player co-operative VR escape room for Meta Quest, built by a five-person team on Unity\'s XR Interaction Toolkit and its integrated multiplayer kit. Each player spawns in a separate cage and must solve a chain of deliberately asymmetric puzzles — a solution only the other player can see, a battery only one of them can carry — forcing verbal communication rather than solo problem-solving.',
    role: 'Game Mechanics Programmer, and co-designer alongside the level designer — authored the full interaction layer end-to-end (grabbables, levers, keypads, the battery/generator/teleport loop, the lift, the shooting mechanic, the tile-grid puzzle, the win condition), and helped shape the puzzle flow and overall game design across the build.',
    systems: [
      { name: 'Networked Interaction Layer', desc: 'Every grabbable, lever and keypad had to behave identically for both players over the network — my first bug was a cage door that opened locally for one player but not the other, fixed by routing the open command through a server RPC instead of a local state change.' },
      { name: 'Asymmetric Hex Keypad', desc: 'Each player\'s cage holds a hex-tile combination lock whose solution is only visible from inside the other player\'s cage, forcing them to describe it aloud — built on a small per-tile state machine, a checker polling combined state on rotation, and a network-synced lock to stop it being brute-forced from one side.' },
      { name: 'Battery, Generator & Teleport Loop', desc: 'Refactored a teammate\'s early networking prototype by moving the behavioural logic onto the persistent generator rather than the disposable battery, consolidating two generators into one, and adding a teleport pad that sends the battery to the partner\'s side using the same request-to-server pattern as the lift.' },
      { name: 'Dark Tile Grid & Win Zone', desc: 'One player crosses a mostly-lethal tile floor while the other feeds the battery into a generator that lights a physical, diegetic minimap showing the safe route as it discharges — the clearest expression of the asymmetric design, resolved by a shared win-zone trigger once both players reach the exit.' },
    ],
    code: {
      caption: 'Simplified from the cage-door fix — the first client-server authority lesson: opening the door locally meant only the local player ever saw it change.',
      snippet: `[ServerRpc]
void OpenDoorServerRpc()
{
    // NetworkVariable — writing here syncs the change to both clients,
    // instead of only ever changing state on the machine that pressed it
    isOpen.Value = true;
}`,
    },
    journey: 'The brief asked for real-world and virtual activity integrated through multimodal interaction, and the team\'s answer was a co-operative escape room specifically because it gave every specialism — level design, sound and art, networking, game design, mechanics — real surface area. Two principles ran through every mechanic I built: diegetic interaction (a code on a wall, a socket on a generator, never a floating UI) and deliberate asymmetry, so no single player could ever solve a puzzle alone.\n\nThe team started on the BNG VR Interaction Framework for its rich pre-built interactions, then migrated to Unity\'s XR Interaction Toolkit multiplayer kit once it became clear that bolting networking onto BNG was outside scope — a week lost to the switch, but it avoided a whole category of bugs surfacing late. Working through the battery/generator system alongside our network programmer, who had prototyped the initial RPC scaffolding, was the most valuable exchange of the project: he walked me through why server-authoritative movement needs the client to request a change rather than perform it directly, and I carried that same pattern into the teleport pad myself.\n\nI\'m most satisfied with the hex keypad and the battery/generator refactor — the keypad because it delivers exactly the communication-driven puzzle the brief wanted, tuned across three playtests until the rotation felt right without overshooting; the refactor because re-shaping someone else\'s networking code taught me to read another author\'s intent carefully before changing it. The honest weak point is edge-case robustness: the lift could de-sync if the battery was pulled at the exact moment it reached the top, and the dark tile grid could be skipped by walking the join between two safe tiles at the right angle. Both have documented fixes — a debounce on the lift state, a wider kill-zone collider — that didn\'t make the final build.\n\nWhat the report doesn\'t say plainly enough is how the schedule actually played out: what was meant to be a steady final month collapsed into the last five days after other parts of the team stalled, and the level designer and I — having done our own parts on time — ended up carrying most of the remaining mechanics work and the write-up itself in that window, on very little sleep. I\'d rather that explain the scope of what got built and why the edge-case polish didn\'t land, than turn it into a longer story.',
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
    role: "Solo researcher and developer — designed the experiment, built both artefacts (MR app + physical sensor rig), ran the study, and turned an incomplete dataset into a defensible finding.",
    systems: [
      { name: 'MR Interaction & Grip', desc: "First build on Meta's MR Utility Kit and XR SDK. Wrote a custom grip-snap script so the virtual launcher locks to the hand on pickup — the goal was for it to actually feel held, not just visually attached." },
      { name: 'Physical Sensor Rig', desc: "Seven force-sensitive resistors wired into an Arduino Mega, one per scoring zone, with priority-ordered hit classification and a cooldown window so a single impact couldn't register twice. Designed to survive around twenty back-to-back participants, with damaged sections swappable in under two minutes." },
      { name: 'Experimental & Evaluation Design', desc: "Built the whole study from scratch: pre/post-test protocol, a weighted scoring system shared between the physical and virtual versions, and a written evaluation plan for comparing the two." },
      { name: 'Scope & Problem-Solving Calls', desc: "Dropped full MR Utility Kit room-scan anchoring once it became clear it would eat too much time for too little gain, switching to fixed Unity transforms instead. Also ran several failed rounds of physical grip mock-ups — sponge and other materials — trying to replicate recoil feel before accepting it as an open gap." },
    ],
    code: {
      caption: 'Sensor classification logic on the Arduino: checks zones in priority order (bullseye outward) so overlapping sensor readings from one impact resolve to a single zone, with a cooldown so one hit can\'t register twice.',
      snippet: `// Only register a new hit if not already in cooldown
if (!hit) {
  if (input0 > 100) {
    hit = true; hitTime = millis();
    bullseye++;
  }
  else if (input1 > 100 || input2 > 100) {
    hit = true; hitTime = millis();
    midRing++;
  }
  else if (input3 > 100 || input4 > 100 || input5 > 100 || input6 > 100) {
    hit = true; hitTime = millis();
    outerRing++;
  }
}`,
    },
    journey: "The plan was a clean between-group comparison: train one group in MR for a week, compare against a control on a physical re-test. Sixteen of twenty participants never came back for the physical post-test, which killed that comparison outright. Rather than treat that as a dead end, I rebuilt the analysis around what I did have — in-app training data plus verbal feedback from the three training-group returners — and found something more specific than a pass/fail result: high MR proficiency didn't predict physical improvement at all. The participant who tried to apply a learned virtual aim model directly to the real throw got worse; the one with the highest MR scores, who focused on how the launcher physically felt rather than a virtual model, didn't change at all. That reframing — from \"does XR training work\" to \"under what conditions does it transfer\" — became the actual contribution of the project.",
    github: '#',
    itch: null,
  },
  {
    id: 10,
    name: 'CAPSIZE',
    meta: 'GAME JAM · TABLETOP · GROUP · 2025/26',
    tech: 'TABLETOP · PAPER PROTOTYPE',
    tags: ['GAME JAM', 'TABLETOP', 'GROUP PROJECT', '2025/26'],
    section: 'THE JAM',
    description: "A hex-tile tabletop racing game for up to 4 players, designed and built from scratch in a lecturer-run 2-day game jam on the theme \"Small Boats.\" Players manage a shared chip economy, bet on dice races where boat size trades off against dice count, and explore a hex map that's revealed tile-by-tile as they move — closing with a dual win condition (first to the end, or most gold if several arrive together).",
    role: "Shared design role across a 4-person team, all of us new to tabletop design. My own focus was the chip economy and betting system, and running the structured playtest-and-revise loop between rounds.",
    systems: [
      { name: 'Economy & Betting Design', desc: "Designed the chip economy underpinning every decision — Scout, Upgrade and Downgrade all cost chips, staying in place earns one, and race bets are capped to the lowest coin total at the table so no one can bet an opponent out of the game." },
      { name: 'Playtest-Driven Balancing', desc: "Ran the structured playtesting loop between rounds — recording what broke and pushing rule changes straight back into the next session, paper-prototyping style. Two live catches: softening the Thunderbolt event's restart penalty, and capping Treasure payouts once they started inflating the economy." },
      { name: 'Risk/Reward Core Loop', desc: "Co-designed the central trade-off: downgrading your boat adds dice for racing but costs you on Deep Water tiles, upgrading does the opposite — every action in the game feeds back into that one tension." },
    ],
    journey: "Two days, four of us, and a theme (\"Small Boats\") we didn't pick. We built the whole thing as a paper prototype and tried to break it ourselves between every round — a bad exploit found in playtesting counted as a win, because it was cheap to fix while the game was still made of cardboard. Illness took the team out mid-weekend and cost us real development time, so the balance in the final version is rougher than we wanted; we picked it back up remotely afterwards but didn't fully recover the lost ground. What stuck with me is how much faster a board game exposes a weak mechanic than code does — there's nowhere for a bad rule to hide when you're watching people play it across a table. Enough people enjoyed it during testing that the team's talked about taking Capsize further after university.",
    github: null,
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
