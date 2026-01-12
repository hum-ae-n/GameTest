# PRD: D&D Monster Battle Simulator V3 - 3D Edition

## Vision
Create a visually stunning, AAA-quality 3D monster battle arena that rivals professional game demos. Inspired by Ethan Mollick's high-polish AI-generated experiences - this should make people say "wait, AI made this?!"

## Target Experience
- **First Impression**: "Wow, this looks like a real game"
- **Gameplay Feel**: Epic, dramatic, cinematic battles
- **Polish Level**: Smooth animations, particle effects, dramatic lighting

---

## Core Features

### 1. 3D Battle Arena
- **Environment**: Ancient stone colosseum with dramatic lighting
- **Atmosphere**: Volumetric fog, floating particles, torch flames
- **Skybox**: Dark stormy sky with lightning flashes
- **Floor**: Cracked stone with glowing runes
- **Boundaries**: Magical barrier walls with shimmer effect

### 2. 3D Monster Representation
- **Style**: Stylized geometric/low-poly creatures (no external models needed)
- **Each monster type gets unique 3D form**:
  - Dragons: Winged serpentine with glowing eyes
  - Undead: Skeletal/spectral with particle trails
  - Fiends: Demonic with fire/smoke effects
  - Aberrations: Tentacled, floating, otherworldly
  - Giants: Massive humanoid forms
  - Beasts: Animal silhouettes
- **Idle Animations**: Breathing, hovering, subtle movement
- **Attack Animations**: Lunge, cast, breath weapon cone

### 3. Visual Effects (Critical for "Wow Factor")
- **Spell Effects**:
  - Fireball: Orange particle explosion with shockwave
  - Lightning: Branching electric arcs
  - Necrotic: Purple/green swirling darkness
  - Acid: Green dripping splash
  - Cold: Ice crystals and frost spread
- **Hit Effects**: Impact flash, damage numbers floating up
- **Death Effects**: Dramatic disintegration/collapse
- **Breath Weapons**: Cone of particles matching element

### 4. Camera System
- **Cinematic Mode**: Auto-orbiting dramatic angles
- **Action Cuts**: Quick zoom on attacks
- **Death Cam**: Slow-mo on killing blow
- **User Control**: Click-drag to orbit, scroll to zoom

### 5. UI Overlay (HUD)
- **Floating Health Bars**: Above each monster in 3D space
- **Combat Log**: Semi-transparent overlay, bottom-left
- **Turn Indicator**: Current monster highlighted + name display
- **Round Counter**: Top center, medieval style

### 6. Audio (Web Audio API)
- **Background**: Epic orchestral loop (generated tones)
- **Impacts**: Procedural hit sounds
- **Spells**: Whoosh, crackle, boom
- **Ambient**: Crowd cheering, thunder rumbles

### 7. Monster Selection (Pre-Battle)
- **3D Preview**: Selected monster rotates on pedestal
- **Stats Panel**: Classic D&D stat block overlay
- **Dramatic Reveal**: Monster materializes with particle effect when selected

---

## Technical Architecture

### Stack
- **Three.js**: 3D rendering engine
- **GSAP**: Smooth animations and tweens
- **Web Audio API**: Sound generation
- **Single HTML File**: Self-contained, no build step

### File Structure
```
index-v3-3d.html    # Main file (HTML + CSS + JS)
```

### Performance Targets
- 60 FPS on modern browsers
- Mobile-responsive (reduced effects)
- < 500KB total size (no external assets)

---

## Implementation Phases

### Phase 1: 3D Foundation
- [ ] Three.js scene setup
- [ ] Arena environment (floor, walls, lighting)
- [ ] Skybox and atmosphere
- [ ] Camera controls

### Phase 2: Monster System
- [ ] Procedural 3D monster generator
- [ ] Monster type visual styles
- [ ] Idle animations
- [ ] Position management (red side vs blue side)

### Phase 3: Combat Visuals
- [ ] Attack animations
- [ ] Particle effect system
- [ ] Spell visualizations (fire, ice, lightning, etc.)
- [ ] Hit reactions and death animations

### Phase 4: UI Layer
- [ ] 3D floating health bars
- [ ] 2D HUD overlay
- [ ] Monster selection screen with 3D preview
- [ ] Combat log integration

### Phase 5: Polish
- [ ] Camera cinematics
- [ ] Sound system
- [ ] Screen shake
- [ ] Post-processing (bloom, vignette)

### Phase 6: Game Modes
- [ ] Integrate V2 combat engine
- [ ] 1v1, Team, Tournament modes
- [ ] Victory sequences

---

## Success Criteria
1. **Visual Impact**: Screenshots look like a real indie game
2. **Smooth Performance**: No jank, 60fps
3. **Self-Contained**: Single HTML file, works offline
4. **"Wow Factor"**: First reaction should be amazement

---

## Reference Style
- Ethan Mollick's AI demos: Polished, impressive, shareable
- Hades (game): Dramatic lighting, stylized characters
- Darkest Dungeon: Medieval dark fantasy atmosphere
- Slay the Spire: Clean UI over atmospheric background

---

## Constraints
- No external 3D model files (procedural geometry only)
- No external images (CSS/canvas generated)
- No build tools required
- Must work in modern browsers without plugins
