/**
 * Nexus Player Class
 * Controls the main interactive video player controls, seeking, and UI state.
 */
export class NexusPlayer {
    constructor() {
        // Core Elements
        this.video = document.getElementById('main-video');
        this.container = document.getElementById('player-shell');
        this.loader = document.getElementById('video-loader');
        
        // Control Elements
        this.playPauseBtn = document.getElementById('play-pause-button');
        this.stopBtn = document.getElementById('stop-button');
        this.backwardBtn = document.getElementById('backward-button');
        this.forwardBtn = document.getElementById('forward-button');
        
        // UI Elements
        this.progressArea = document.querySelector('.progress-area');
        this.progressFilled = document.querySelector('.progress-filled');
        this.currentTimeDisplay = document.getElementById('current-time');
        this.durationDisplay = document.getElementById('duration');
        
        this.init();
    }

    init() {
        if (!this.video) return;
        this.setupEventListeners();
        this.formatTime(0); 
    }

    setupEventListeners() {
        // Toggle Playback
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.video.addEventListener('click', () => this.togglePlay());

        // Stop functionality
        this.stopBtn.addEventListener('click', () => this.stopVideo());

        // Skipping
        this.backwardBtn.addEventListener('click', () => this.skip(-10));
        this.forwardBtn.addEventListener('click', () => this.skip(10));

        // Progress Updates
        this.video.addEventListener('timeupdate', () => this.handleProgress());
        
        // Meta-data loading handling
        this.video.addEventListener('loadedmetadata', () => {
            this.durationDisplay.textContent = this.formatTime(this.video.duration);
            this.loader.style.display = 'none';
        });

        // Handle potential stalling/loading
        this.video.addEventListener('waiting', () => {
            this.loader.style.display = 'flex';
        });

        this.video.addEventListener('playing', () => {
            this.loader.style.display = 'none';
        });

        // Seek functionality
        let mousedown = false;
        this.progressArea.addEventListener('click', (e) => this.scrub(e));
        this.progressArea.addEventListener('mousemove', (e) => mousedown && this.scrub(e));
        this.progressArea.addEventListener('mousedown', () => mousedown = true);
        window.addEventListener('mouseup', () => mousedown = false);

        // UI state changes
        this.video.addEventListener('play', () => this.updatePlayIcon(true));
        this.video.addEventListener('pause', () => this.updatePlayIcon(false));

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => this.handleShortcuts(e));
    }

    togglePlay() {
        if (this.video.paused) {
            const playPromise = this.video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Playback error:", error);
                });
            }
        } else {
            this.video.pause();
        }
    }

    stopVideo() {
        this.video.pause();
        this.video.currentTime = 0;
    }

    skip(seconds) {
        if (this.video.readyState >= 1) {
            this.video.currentTime += seconds;
        }
    }

    handleProgress() {
        if (isNaN(this.video.duration)) return;
        const percent = (this.video.currentTime / this.video.duration) * 100;
        this.progressFilled.style.width = `${percent}%`;
        this.currentTimeDisplay.textContent = this.formatTime(this.video.currentTime);
    }

    scrub(e) {
        if (this.video.duration) {
            const rect = this.progressArea.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.video.currentTime = Math.max(0, Math.min(pos * this.video.duration, this.video.duration));
        }
    }

    updatePlayIcon(isPlaying) {
        const icon = this.playPauseBtn.querySelector('i');
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        
        this.playPauseBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.playPauseBtn.style.transform = '';
        }, 100);
    }

    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "00:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        const parts = [];
        if (h > 0) parts.push(h);
        parts.push(m.toString().padStart(2, '0'));
        parts.push(s.toString().padStart(2, '0'));
        
        return parts.join(':');
    }

    handleShortcuts(e) {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                this.skip(-10);
                break;
            case 'ArrowRight':
                this.skip(10);
                break;
            case 'KeyM':
                this.video.muted = !this.video.muted;
                break;
        }
    }
}