// Tarih Reels ortak render: node shared/render.js <bölüm-klasörü> [çıktı.mp4] [fps] [--taslak] [--mb N]
// Kareleri headless Chromium'da çizer, ffmpeg'e akıtır, audio/final.wav'ı ekler (önce: python3 shared/make_audio.py <bölüm>).
//   varsayılan (yayın): kayıpsız PNG kare → x264 CRF 16, bt709 matris ve etiketleri (koyu sepya tonlarda bantlaşma olmaz)
//   --taslak          : JPEG kare, CRF 23 (hızlı önizleme)
//   --mb N            : hızlı anlarda (geçişler + EP.blur aralıkları) N alt kare hareket bulanıklığı (ör. 6); süreyi o anlarda N kat uzatır
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs');
(async () => {
  const argv = process.argv.slice(2), flag = n => argv.includes(n), opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const pos = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1] === '--mb'));
  const ep = path.resolve(pos[0]), out = path.resolve(pos[1] || path.join(ep, path.basename(ep) + '.mp4')), fps = +pos[2] || 30;
  const draft = flag('--taslak'), mb = +opt('--mb', 0);
  const audio = path.join(ep, 'audio', 'final.wav');
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('sayfa hatası:', e.message));
  await page.goto('file://' + path.join(ep, 'index.html') + '?capture');
  await page.waitForFunction(() => window.READY, null, { timeout: 20000 });
  const frames = Math.round(await page.evaluate(() => DUR) * fps);
  const args = ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', draft ? 'mjpeg' : 'png', '-framerate', String(fps), '-i', '-'];
  if (fs.existsSync(audio)) args.push('-i', audio, '-c:a', 'aac', '-b:a', '256k', '-shortest');
  args.push('-c:v', 'libx264', '-preset', draft ? 'veryfast' : 'slow', '-crf', draft ? '23' : '16', '-maxrate', '20M', '-bufsize', '40M',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-movflags', '+faststart', out);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const mime = draft ? 'image/jpeg' : 'image/png';
  const fail = e => { console.error(`\nRENDER DURDU (${e.message.split('\n')[0]})\nYarım dosya silindi. Önce: node shared/tools/kontrol.js <bölüm> --tara`); ff.kill('SIGKILL'); try { fs.unlinkSync(out); } catch (_) {} browser.close().finally(() => process.exit(1)); };
  for (let i = 0; i < frames; i++) {
    const b64 = await page.evaluate(([t, mime, mb, dt]) => {
      if (mb > 1 && window.blurAt(t)) window.renderBlurred(t, mb, dt); else renderAt(t);
      return document.getElementById('c').toDataURL(mime, .92).split(',')[1];
    }, [i / fps, mime, mb, .5 / fps]).catch(e => { fail(e); return new Promise(() => {}); });
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`kare ${i}/${frames}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();
  console.log('hazır:', out);
})();
