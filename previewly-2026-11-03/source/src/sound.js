/* sound and haptics: a soft tooth tick (WebAudio, no files) and a 4 ms vibration every 3 teeth */
import { $ } from './util.js';

var soundOn = false, actx = null, noise = null, lastTick = 0, toothCount = 0;   // off until the visitor turns it on
var soundBtn = $('#sound');
soundBtn.addEventListener('click', function () { soundOn = !soundOn; soundBtn.setAttribute('aria-pressed', String(soundOn)); soundBtn.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off'); ensureAudio(); });
export function ensureAudio() {
  if (!soundOn) return;
  if (!actx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; actx = new AC(); noise = actx.createBuffer(1, Math.floor(actx.sampleRate * 0.03), actx.sampleRate); var ch = noise.getChannelData(0); for (var i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 3); }
  if (actx.state === 'suspended') actx.resume();
}
export function tick(intensity) {
  var now = performance.now();
  if (soundOn && actx && actx.state === 'running' && now - lastTick > 14) {
    lastTick = now; var t = actx.currentTime, src = actx.createBufferSource(), bp = actx.createBiquadFilter(), g = actx.createGain();
    src.buffer = noise; bp.type = 'bandpass'; bp.frequency.value = 2800 + Math.random() * 1400; bp.Q.value = 5;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05 + 0.12 * intensity, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    src.connect(bp); bp.connect(g); g.connect(actx.destination); src.start(t); src.stop(t + 0.035);
  }
  // Chrome blocks (and logs an error for) vibrate until the first tap, so skip it until then
  var activated = !navigator.userActivation || navigator.userActivation.hasBeenActive;
  toothCount++; if (navigator.vibrate && activated && toothCount % 3 === 0) { try { navigator.vibrate(4); } catch (e) {} }
}
document.addEventListener('pointerdown', ensureAudio, { once: true });
