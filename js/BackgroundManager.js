/**
 * Background Video Manager
 * Handles the cinematic background loop, attribute enforcement, and playback fallbacks.
 */
export class BackgroundManager {
    constructor() {
        this.video = document.getElementById('background-video');
        if (this.video) {
            this.init();
        } else {
            console.error("Nexus Error: Background video element (#background-video) not found.");
        }
    }

    async init() {
        // 1. Programmatically enforce specific autoplay policies
        // This ensures the browser doesn't block it due to unmuted audio tracks
        this.video.muted = true;
        this.video.playsInline = true;

        // Error Logging
        this.video.addEventListener('error', (e) => this.handleError(e));

        // Fade-in effect on successful play
        this.video.addEventListener('playing', () => {
            console.log("Nexus Info: Background video started playing.");
            this.video.classList.add('is-loaded');
        });

        // 2. Attempt Autoplay with Promise handling
        try {
            await this.video.play();
        } catch (error) {
            console.warn("Background Autoplay prevented by browser policy:", error);
            this.handleAutoplayFailure();
        }
    }

    /**
     * Creates and injects a premium fallback button if autoplay is blocked.
     * This ensures the user can still experience the content.
     */
    handleAutoplayFailure() {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'fallback-overlay';

        // Create Tribute Button
        const button = document.createElement('button');
        button.className = 'tribute-btn fade-in-up';
        button.innerHTML = '<i class="fas fa-play"></i> <span>Play Tribute</span>';
        
        // Interaction
        button.onclick = () => {
            this.video.play().then(() => {
                // On success, fade out the overlay and remove it
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            }).catch(e => console.error("Manual play failed:", e));
        };

        overlay.appendChild(button);
        document.body.appendChild(overlay);
    }

    handleError(e) {
        console.error("Background Video Error Event:", e);
        if (this.video.error) {
            console.error(`Nexus Error Details - Code: ${this.video.error.code}, Message: ${this.video.error.message}`);
        }
    }
}