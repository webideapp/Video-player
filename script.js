/**
 * NEXUS Cinematic Experience
 * Main Entry Point
 */
import { BackgroundManager } from './js/BackgroundManager.js';
import { MainPlayer } from './js/MainPlayer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Background Video Manager
    window.bgManager = new BackgroundManager();
    
    // Initialize Main Video Player
    window.mainPlayer = new MainPlayer('#main-video');
});