// Owner Command — Neon PFP Canvas GIF — Rakib Islam / Ghost Net Edition

const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const OWNER_UID = "61575436812912";
const BIO = {
  name: "Rakib Islam",
  location: "Saidpur, Nilphamari",
  status: "Single 💔",
  religion: "Islam ☪️",
  class: "Secret 🔒",
  job: "Student 📚",
  hobby: "Gaming & Travelling 🎮",
  prefix: ".",
};

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

async function buildOwnerCard(uid) {
  const W = 820, H = 400;
  const cacheDir = path.join(__dirname, "cache");
  await fs.ensureDir(cacheDir);
  const outPath = path.join(cacheDir, `owner_neon_${Date.now()}.gif`);

  let avatar = null;
  try {
    const avUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const res = await axios.get(avUrl, { responseType: "arraybuffer", timeout: 12000 });
    avatar = await loadImage(Buffer.from(res.data));
  } catch {}

  const NEON = ["#ff00ff","#00ffff","#ff6600","#00ff88","#ffd700","#ff0055","#aa00ff","#00ccff"];

  const enc = new GIFEncoder(W, H);
  const ws = fs.createWriteStream(outPath);
  enc.createReadStream().pipe(ws);
  enc.start(); enc.setRepeat(0); enc.setDelay(110); enc.setQuality(8);

  for (let f = 0; f < 14; f++) {
    const c1 = NEON[f % NEON.length];
    const c2 = NEON[(f + 3) % NEON.length];
    const c3 = NEON[(f + 5) % NEON.length];

    const cv = createCanvas(W, H);
    const ctx = cv.getContext("2d");

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#030008"); bg.addColorStop(0.5, "#08001a"); bg.addColorStop(1, "#030008");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Particles
    for (let i = 0; i < 55; i++) {
      const a = (Math.sin((f * 0.5 + i) * 0.7) + 1) * 0.12 + 0.04;
      const [r, g, b] = [parseInt(c1.slice(1,3),16), parseInt(c1.slice(3,5),16), parseInt(c1.slice(5,7),16)];
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.beginPath();
      ctx.arc((Math.sin(i * 2.39 + f * 0.1) * 0.5 + 0.5) * W, (Math.cos(i * 3.14 + f * 0.08) * 0.5 + 0.5) * H, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Card
    const pad = 22;
    ctx.fillStyle = "rgba(4,0,18,0.85)";
    roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 24, true, false);

    // Animated outer neon border
    ctx.lineWidth = 3.5; ctx.strokeStyle = c1; ctx.shadowColor = c1; ctx.shadowBlur = 30;
    roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 24, false, true);

    // Inner border
    ctx.lineWidth = 1.5; ctx.strokeStyle = c2; ctx.shadowColor = c2; ctx.shadowBlur = 14;
    roundRect(ctx, pad + 9, pad + 9, W - pad * 2 - 18, H - pad * 2 - 18, 18, false, true);
    ctx.shadowBlur = 0;

    // ── Profile Pic (left) ──
    const PX = 102, PY = H / 2, PR = 92;

    // Glow rings
    for (let ring = 4; ring >= 1; ring--) {
      const rc = ring <= 2 ? c1 : c2;
      ctx.beginPath(); ctx.arc(PX, PY, PR + ring * 7, 0, Math.PI * 2);
      ctx.strokeStyle = rc; ctx.lineWidth = 2.5;
      ctx.shadowColor = rc; ctx.shadowBlur = ring <= 2 ? 22 : 10; ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // PFP clip
    ctx.save();
    ctx.beginPath(); ctx.arc(PX, PY, PR, 0, Math.PI * 2); ctx.clip();
    if (avatar) {
      ctx.drawImage(avatar, PX - PR, PY - PR, PR * 2, PR * 2);
    } else {
      const aFill = ctx.createLinearGradient(PX - PR, PY - PR, PX + PR, PY + PR);
      aFill.addColorStop(0, "#1a003a"); aFill.addColorStop(1, "#003a3a");
      ctx.fillStyle = aFill; ctx.fillRect(PX - PR, PY - PR, PR * 2, PR * 2);
      ctx.font = "bold 70px Arial"; ctx.fillStyle = c1;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("👑", PX, PY);
    }
    ctx.restore();

    // ── Header text ──
    const TX = PX + PR + 35;
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    ctx.font = "bold 13px Arial"; ctx.fillStyle = c3;
    ctx.shadowColor = c3; ctx.shadowBlur = 14;
    ctx.fillText("👻  GHOST NET EDITION", TX, pad + 44);

    ctx.font = "bold 26px Arial"; ctx.fillStyle = "#ffffff";
    ctx.shadowColor = c1; ctx.shadowBlur = 18;
    ctx.fillText("BOT OWNER PROFILE", TX, pad + 74);
    ctx.shadowBlur = 0;

    // Divider line
    const lineGrad = ctx.createLinearGradient(TX, 0, W - pad - 10, 0);
    lineGrad.addColorStop(0, c1); lineGrad.addColorStop(1, "transparent");
    ctx.fillStyle = lineGrad; ctx.fillRect(TX, pad + 82, W - TX - pad - 10, 1.5);

    // ── Info fields ──
    const fields = [
      ["👤 Name",     BIO.name],
      ["📍 Location", BIO.location],
      ["💍 Status",   BIO.status],
      ["🎓 Class",    BIO.class],
      ["💼 Job",      BIO.job],
      ["🎮 Hobby",    BIO.hobby],
      ["🔗 FB",       `fb.com/${uid}`],
    ];

    let fy = pad + 112;
    for (const [label, val] of fields) {
      ctx.font = "10px monospace"; ctx.fillStyle = "rgba(180,180,255,0.55)"; ctx.shadowBlur = 0;
      ctx.fillText(label, TX, fy);
      ctx.font = "bold 14px Arial"; ctx.fillStyle = "#ffffff";
      ctx.shadowColor = c2; ctx.shadowBlur = 5;
      ctx.fillText(String(val).slice(0, 48), TX + 118, fy);
      ctx.shadowBlur = 0;
      fy += 28;
    }

    // ── Footer ──
    ctx.font = "bold 12px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = c3; ctx.shadowColor = c3; ctx.shadowBlur = 12;
    ctx.fillText("◆  EXCLUSIVE BOT OWNER — Ghost Net Royal  ◆", W / 2, H - 32);
    ctx.shadowBlur = 0;

    // Corner accent squares
    [[pad + 2, pad + 2], [W - pad - 14, pad + 2], [pad + 2, H - pad - 14], [W - pad - 14, H - pad - 14]].forEach(([cx, cy]) => {
      ctx.fillStyle = c1; ctx.shadowColor = c1; ctx.shadowBlur = 10;
      ctx.fillRect(cx, cy, 12, 12);
      ctx.shadowBlur = 0;
    });

    enc.addFrame(ctx);
  }

  enc.finish();
  await new Promise(r => ws.on("finish", r));
  return outPath;
}

module.exports = {
  config: {
    name: "owner",
    aliases: ["rakibboss", "abba", "botowner", "malik", "boss"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Owner info — Neon PFP animated card 👑" },
    longDescription: { en: "Animated neon GIF card with profile picture & owner info." },
    category: "info",
    guide: { en: "{p}owner" }
  },

  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);

    const infoText =
      `╔══════════════════════════╗\n` +
      `║  👑  BOT OWNER INFO  👑   ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  👤 Name     : ${BIO.name}\n` +
      `  📍 Location : ${BIO.location}\n` +
      `  💍 Status   : ${BIO.status}\n` +
      `  ☪️  Religion : ${BIO.religion}\n` +
      `  🎓 Class    : ${BIO.class}\n` +
      `  💼 Job      : ${BIO.job}\n` +
      `  🎮 Hobby    : ${BIO.hobby}\n` +
      `  🔑 Prefix   : ${BIO.prefix}\n` +
      `  🔗 FB       : fb.com/${OWNER_UID}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  💀 Powered by Ghost Net Edition`;

    try {
      const gifPath = await buildOwnerCard(OWNER_UID);
      await message.reaction("✅", event.messageID);
      await message.reply({ body: infoText, attachment: fs.createReadStream(gifPath) });
      setTimeout(() => { try { fs.unlinkSync(gifPath); } catch {} }, 18000);
    } catch {
      await message.reaction("✅", event.messageID);
      await message.reply(infoText);
    }
  }
};
