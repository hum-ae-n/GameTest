// D&D Monster Battle - Audio System
// Epic sounds and music using Web Audio API

const AudioSystem = {
    ctx: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    musicPlaying: false,
    musicNodes: [],

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        // Master gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.7;
        this.masterGain.connect(this.ctx.destination);

        // Music gain
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.3;
        this.musicGain.connect(this.masterGain);

        // SFX gain
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.5;
        this.sfxGain.connect(this.masterGain);
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    // ==================== SOUND EFFECTS ====================

    playHit(type = 'slashing', isCritical = false) {
        this.init();
        const now = this.ctx.currentTime;

        // Create nodes
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        // Different sounds for damage types
        const sounds = {
            slashing: { freq: 800, type: 'sawtooth', decay: 0.1, filterFreq: 2000 },
            piercing: { freq: 1200, type: 'square', decay: 0.08, filterFreq: 3000 },
            bludgeoning: { freq: 150, type: 'triangle', decay: 0.15, filterFreq: 800 },
            fire: { freq: 400, type: 'sawtooth', decay: 0.3, filterFreq: 1500 },
            cold: { freq: 2000, type: 'sine', decay: 0.2, filterFreq: 4000 },
            lightning: { freq: 100, type: 'sawtooth', decay: 0.1, filterFreq: 5000 },
            necrotic: { freq: 200, type: 'square', decay: 0.25, filterFreq: 600 },
            poison: { freq: 300, type: 'triangle', decay: 0.2, filterFreq: 1000 },
            psychic: { freq: 600, type: 'sine', decay: 0.3, filterFreq: 2500 },
            acid: { freq: 500, type: 'sawtooth', decay: 0.2, filterFreq: 1800 },
            force: { freq: 1000, type: 'square', decay: 0.15, filterFreq: 3500 },
            thunder: { freq: 80, type: 'sawtooth', decay: 0.4, filterFreq: 500 }
        };

        const sound = sounds[type] || sounds.slashing;
        const duration = isCritical ? sound.decay * 2 : sound.decay;
        const volume = isCritical ? 0.8 : 0.5;

        osc.type = sound.type;
        osc.frequency.setValueAtTime(sound.freq * (isCritical ? 1.5 : 1), now);
        osc.frequency.exponentialRampToValueAtTime(sound.freq * 0.5, now + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(sound.filterFreq, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + duration);

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);

        // Add noise burst for impact
        this.playNoiseBurst(duration * 0.3, volume * 0.3);

        // Extra effects for critical
        if (isCritical) {
            setTimeout(() => this.playCriticalAccent(), 50);
        }
    },

    playNoiseBurst(duration, volume) {
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        noise.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.start();
    },

    playCriticalAccent() {
        this.init();
        const now = this.ctx.currentTime;

        // Ascending tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    },

    playMiss() {
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    },

    playDeath() {
        this.init();
        const now = this.ctx.currentTime;

        // Deep rumble
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();

        osc1.connect(gain1);
        gain1.connect(this.sfxGain);

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(100, now);
        osc1.frequency.exponentialRampToValueAtTime(30, now + 0.8);

        gain1.gain.setValueAtTime(0.5, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        osc1.start(now);
        osc1.stop(now + 0.8);

        // Descending tone
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();

        osc2.connect(gain2);
        gain2.connect(this.sfxGain);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(400, now);
        osc2.frequency.exponentialRampToValueAtTime(50, now + 0.6);

        gain2.gain.setValueAtTime(0.3, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc2.start(now);
        osc2.stop(now + 0.6);
    },

    playVictory() {
        this.init();
        const now = this.ctx.currentTime;

        // Fanfare - ascending arpeggios
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C major arpeggio

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const startTime = now + i * 0.1;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });

        // Final chord
        const chordNotes = [523.25, 659.25, 783.99]; // C major chord
        chordNotes.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + 0.6;
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1);

            osc.start(startTime);
            osc.stop(startTime + 1);
        });
    },

    playAbility() {
        this.init();
        const now = this.ctx.currentTime;

        // Magical whoosh
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.4);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(3000, now + 0.2);
        filter.Q.value = 2;

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);

        // Sparkle
        this.playSparkle();
    },

    playSparkle() {
        const now = this.ctx.currentTime;
        const sparkleFreqs = [2000, 2500, 3000, 2200, 2800];

        sparkleFreqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + i * 0.03;
            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

            osc.start(startTime);
            osc.stop(startTime + 0.1);
        });
    },

    playBreathWeapon(type) {
        this.init();
        const now = this.ctx.currentTime;

        const colors = {
            fire: { baseFreq: 150, modFreq: 10, duration: 1 },
            cold: { baseFreq: 2000, modFreq: 5, duration: 0.8 },
            lightning: { baseFreq: 100, modFreq: 50, duration: 0.5 },
            poison: { baseFreq: 200, modFreq: 8, duration: 0.7 },
            acid: { baseFreq: 300, modFreq: 15, duration: 0.6 }
        };

        const params = colors[type] || colors.fire;

        // Main breath sound
        const osc = this.ctx.createOscillator();
        const modulator = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        modulator.connect(modGain);
        modGain.connect(osc.frequency);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sawtooth';
        osc.frequency.value = params.baseFreq;

        modulator.type = 'sine';
        modulator.frequency.value = params.modFreq;
        modGain.gain.value = 50;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + params.duration);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
        gain.gain.setValueAtTime(0.5, now + params.duration - 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + params.duration);

        modulator.start(now);
        osc.start(now);
        modulator.stop(now + params.duration);
        osc.stop(now + params.duration);

        // Add noise layer
        this.playNoiseBurst(params.duration, 0.2);
    },

    playRoundStart() {
        this.init();
        const now = this.ctx.currentTime;

        // Bell/gong sound
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        osc1.type = 'sine';
        osc1.frequency.value = 220;
        osc2.type = 'sine';
        osc2.frequency.value = 440;

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.5);
        osc2.stop(now + 1.5);
    },

    playSelect() {
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    },

    // ==================== BACKGROUND MUSIC ====================

    startBattleMusic() {
        this.init();
        if (this.musicPlaying) return;
        this.musicPlaying = true;

        this.playDrumLoop();
        this.playBassLoop();
        this.playMelodyLoop();
    },

    stopMusic() {
        this.musicPlaying = false;
        this.musicNodes.forEach(node => {
            try { node.stop(); } catch(e) {}
        });
        this.musicNodes = [];
    },

    playDrumLoop() {
        if (!this.musicPlaying) return;

        const now = this.ctx.currentTime;
        const beatDuration = 0.5; // 120 BPM
        const patternLength = beatDuration * 8;

        // Kick pattern: 1, 3, 5, 7
        [0, 2, 4, 6].forEach(beat => {
            this.scheduleKick(now + beat * beatDuration);
        });

        // Snare/clap pattern: 2, 4, 6, 8
        [1, 3, 5, 7].forEach(beat => {
            this.scheduleSnare(now + beat * beatDuration);
        });

        // Hi-hat on every beat
        for (let i = 0; i < 8; i++) {
            this.scheduleHiHat(now + i * beatDuration);
        }

        // Loop
        setTimeout(() => this.playDrumLoop(), patternLength * 1000);
    },

    scheduleKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);

        gain.gain.setValueAtTime(0.6, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

        osc.start(time);
        osc.stop(time + 0.15);
        this.musicNodes.push(osc);
    },

    scheduleSnare(time) {
        // Noise burst for snare
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        noise.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.value = 2000;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

        noise.start(time);
        this.musicNodes.push(noise);
    },

    scheduleHiHat(time) {
        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        noise.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.value = 8000;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

        noise.start(time);
        this.musicNodes.push(noise);
    },

    playBassLoop() {
        if (!this.musicPlaying) return;

        const now = this.ctx.currentTime;
        const beatDuration = 0.5;
        const patternLength = beatDuration * 8;

        // D minor bass pattern
        const bassNotes = [73.42, 73.42, 82.41, 82.41, 65.41, 65.41, 73.42, 87.31]; // D, D, E, E, C, C, D, F

        bassNotes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain);

            osc.type = 'sawtooth';
            osc.frequency.value = freq;

            filter.type = 'lowpass';
            filter.frequency.value = 300;

            const startTime = now + i * beatDuration;
            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.setValueAtTime(0.25, startTime + beatDuration * 0.8);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.95);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
            this.musicNodes.push(osc);
        });

        setTimeout(() => this.playBassLoop(), patternLength * 1000);
    },

    playMelodyLoop() {
        if (!this.musicPlaying) return;

        const now = this.ctx.currentTime;
        const beatDuration = 0.5;
        const patternLength = beatDuration * 16; // 2 bars

        // Epic melody fragments (D minor scale)
        const melody = [
            { note: 293.66, time: 0, dur: 1 },      // D
            { note: 349.23, time: 2, dur: 0.5 },    // F
            { note: 329.63, time: 2.5, dur: 0.5 },  // E
            { note: 293.66, time: 3, dur: 1 },      // D
            { note: 261.63, time: 4, dur: 2 },      // C
            { note: 293.66, time: 6, dur: 1 },      // D
            { note: 220.00, time: 7, dur: 1 },      // A
        ];

        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.musicGain);

            osc.type = 'triangle';
            osc.frequency.value = note.note;

            const startTime = now + note.time * beatDuration;
            const duration = note.dur * beatDuration;

            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.setValueAtTime(0.15, startTime + duration * 0.7);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            osc.start(startTime);
            osc.stop(startTime + duration);
            this.musicNodes.push(osc);
        });

        setTimeout(() => this.playMelodyLoop(), patternLength * 1000);
    },

    // ==================== AMBIENT ====================

    startAmbient() {
        this.init();
        this.playAmbientLoop();
    },

    playAmbientLoop() {
        if (!this.musicPlaying) return;

        // Occasional thunder rumbles
        if (Math.random() < 0.3) {
            this.playThunder();
        }

        // Crowd murmur
        if (Math.random() < 0.2) {
            this.playCrowdCheer();
        }

        setTimeout(() => this.playAmbientLoop(), 3000 + Math.random() * 5000);
    },

    playThunder() {
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50 + Math.random() * 30, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 1.5);

        filter.type = 'lowpass';
        filter.frequency.value = 200;

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

        osc.start(now);
        osc.stop(now + 1.5);
    },

    playCrowdCheer() {
        const now = this.ctx.currentTime;

        // White noise filtered to sound like crowd
        const bufferSize = this.ctx.sampleRate * 1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const noise = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        noise.buffer = buffer;
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1);

        noise.start(now);
    },

    // ==================== VOLUME CONTROLS ====================

    setMasterVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = value;
        }
    },

    setMusicVolume(value) {
        if (this.musicGain) {
            this.musicGain.gain.value = value;
        }
    },

    setSFXVolume(value) {
        if (this.sfxGain) {
            this.sfxGain.gain.value = value;
        }
    }
};
