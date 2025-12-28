/**
 * NEXUS Main Player Controller
 * Handles the interaction and logic for the featured video player.
 */
export class MainPlayer {
    constructor(selector) {
        this.video = document.querySelector(selector);
        if (!this.video) return;
        
        this.init();
    }

    init() {
        console.log('Nexus Player: Video engine initialized.');

        // Handle Autoplay Reliability
        // Browsers often block autoplay if unmuted. We handle potential failures gracefully.
        const playPromise = this.video.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay started!
                this.video.parentElement.classList.add('is-playing');
            }).catch(error => {
                // Autoplay was prevented.
                console.warn('Nexus Player: Autoplay prevented. User interaction required.');
                this.video.muted = true;
                this.video.play(); // Retry with mute if not already muted
            });
        }

        // Add premium interaction listeners
        this.video.addEventListener('play', () => this.onPlay());
        this.video.addEventListener('pause', () => this.onPause());
    }

    onPlay() {
        const container = this.video.closest('.video-player-container');
        if (container) {
            container.style.boxShadow = '0 60px 120px -20px rgba(0, 255, 255, 0.15)';
            container.style.borderColor = 'rgba(0, 255, 255, 0.3)';
        }
    }

    onPause() {
        const container = this.video.closest('.video-player-container');
        if (container) {
            container.style.boxShadow = '';
            container.style.borderColor = '';
        }
    }
}