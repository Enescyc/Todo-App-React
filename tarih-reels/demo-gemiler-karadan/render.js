// Kareleri headless Chromium'da çizip ffmpeg'e akıtır, sesi ekler.
// Kullanım: node render.js [çıktı.mp4] [fps]
// Gerekli: playwright (npm i -g playwright veya NODE_PATH), ffmpeg, önce `python3 make_audio.py`
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs');

(async () => {
  const out = process.argv[2] || 'gemiler-karadan.mp4', fps = +process.argv[3] || 30;
  const audio = path.join(__dirname, 'audio', 'final.wav');
  const browser = await chromium.launch(fs.existsSync('/opt/pw-browsers/chromium') ? {} : {});
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('sayfa hatası:', e.message));
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?capture');
  await page.waitForFunction(() => window.READY);
  const dur = await page.evaluate(() => DUR), frames = Math.round(dur * fps);

  const args = ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-'];
  if (fs.existsSync(audio)) args.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', out);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let i = 0; i < frames; i++) {
    const b64 = await page.evaluate(t => { renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', .94).split(',')[1]; }, i / fps);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) process.stdout.write(`kare ${i}/${frames}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('hazır:', out);
})();
