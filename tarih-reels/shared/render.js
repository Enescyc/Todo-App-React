// Tarih Reels ortak render: node shared/render.js <bölüm-klasörü> [çıktı.mp4] [fps]
// Kareleri headless Chromium'da çizer, ffmpeg'e akıtır, audio/final.wav'ı ekler (önce: python3 shared/make_audio.py <bölüm>).
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs');
(async () => {
  const ep = path.resolve(process.argv[2]), out = path.resolve(process.argv[3] || path.join(ep, path.basename(ep) + '.mp4')), fps = +process.argv[4] || 30;
  const audio = path.join(ep, 'audio', 'final.wav');
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('sayfa hatası:', e.message));
  await page.goto('file://' + path.join(ep, 'index.html') + '?capture');
  await page.waitForFunction(() => window.READY, null, { timeout: 20000 });
  const frames = Math.round(await page.evaluate(() => DUR) * fps);
  const args = ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-'];
  if (fs.existsSync(audio)) args.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  args.push('-c:v', 'libx264', '-preset', 'medium', '-b:v', '8M', '-maxrate', '10M', '-bufsize', '20M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    const b64 = await page.evaluate(t => { renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', .93).split(',')[1]; }, i / fps);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`kare ${i}/${frames}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();
  console.log('hazır:', out);
})();
