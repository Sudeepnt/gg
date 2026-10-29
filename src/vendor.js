// Lenis must be on window before app.js runs; app.js falls back to native scroll without it.
import Lenis from 'lenis';
window.Lenis = Lenis;
