/**
 * 🔥 owner1.js — Fire/Gold Canvas GIF
 * Style: Gold flame animated aura with owner PFP
 * Owner UID: 61582040799720
 */
"use strict";
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const OWNER_UID = "61582040799720";
const GHOST_CFG = (() => {
  try { return fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json")); } catch { return {}; }
})();

module.exports = {
  config: {
    name: "owner1",
    aliases: ["ownercard1", "bosscard", "boss1"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "𝗢𝘄𝗻𝗲𝗿 𝗖𝗮𝗿𝗱 𝟭 — 𝗙𝗶𝗿𝗲 𝗘𝗱𝗶𝘁𝗶𝗼𝗻 🔥",
    category: "owner",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const ownerName = GHOST_CFG.ownerName || "Rakib Islam";
    const body =
      `🔥 ══════════════════════ 🔥\n` +
      `   𝗢𝗪𝗡𝗘𝗥 𝗖𝗔𝗥𝗗 — 𝗙𝗜𝗥𝗘 𝗘𝗗𝗜𝗧𝗜𝗢𝗡\n` +
      `🔥 ══════════════════════ 🔥\n\n` +
      `👑 𝗡𝗮𝗺𝗲     : ${ownerName}\n` +
      `📍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 : ${GHOST_CFG.location || "Saidpur, Nilphamari"}\n` +
      `💼 𝗝𝗼𝗯      : ${GHOST_CFG.job || "Student 📚"}\n` +
      `🎮 𝗛𝗼𝗯𝗯𝘆   : ${GHOST_CFG.hobby || "Gaming & Travelling"}\n` +
      `💔 𝗦𝘁𝗮𝘁𝘂𝘀  : ${GHOST_CFG.status || "Single 💔"}\n` +
      `☪️  𝗙𝗮𝗶𝘁𝗵   : ${GHOST_CFG.religion || "Islam ☪️"}\n` +
      `🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : fb.com/id=${OWNER_UID}\n\n` +
      `🤖 𝗕𝗼𝘁     : ${GHOST_CFG.botName || "Ghost Bot"}\n` +
      `🌐 𝗘𝗱𝗶𝘁𝗶𝗼𝗻 : ${GHOST_CFG.botEdition || "Ghost Net Edition"}\n\n` +
      `🔥 ══════════════════════ 🔥\n` +
      `   🏆 "𝗕𝗼𝗿𝗻 𝘁𝗼 𝗰𝗿𝗲𝗮𝘁𝗲, 𝗻𝗼𝘁 𝘁𝗼 𝗳𝗼𝗹𝗹𝗼𝘄."`;
    try {
      const gifPath = await buildFireGoldGif(event.threadID);
      await message.reaction("✅", event.messageID);
      await message.reply({ body, attachment: fs.createReadStream(gifPath) });
      setTimeout(() => { try { fs.unlinkSync(gifPath); } catch {} }, 10000);
    } catch {
      await message.reaction("✅", event.messageID);
      await message.reply(body);
    }
  }
};

async function buildFireGoldGif(tid) {
  const W = 820, H = 420;
  const cacheDir = path.join(__dirname, "cache");
  await fs.ensureDir(cacheDir);
  const out = path.join(cacheDir, `owner1_fire_${tid}_${Date.now()}.gif`);

  let avatar = null;
  try {
    const avUrl = `https://graph.facebook.com/${OWNER_UID}/picture?width=400&height=400&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const res = await axios.get(avUrl, { responseType: "arraybuffer", timeout: 10000 });
    avatar = await loadImage(Buffer.from(res.data));
  } catch {}

  const FIRE = ["#ff6600", "#ff8800", "#ffaa00", "#ffd700", "#ff4400", "#ffcc00", "#ff7700", "#ffbb00"];
  const enc = new GIFEncoder(W, H);
  const ws = fs.createWriteStream(out);
  enc.createReadStream().pipe(ws);
  enc.start(); enc.setRepeat(0); enc.setDelay(90); enc.setQuality(10);

  for (let f = 0; f < 16; f++) {
    const cv = createCanvas(W, H);
    const ctx = cv.getContext("2d");
    const c1 = FIRE[f % FIRE.length];
    const c2 = FIRE[(f + 2) % FIRE.length];
    const c3 = FIRE[(f + 4) % FIRE.length];

    // Dark red/black background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0a0000"); bg.addColorStop(0.5, "#180500"); bg.addColorStop(1, "#0a0000");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Fire particle embers
    for (let i = 0; i < 60; i++) {
      const px = (Math.sin(i * 1.8 + f * 0.15) * 0.5 + 0.5) * W;
      const py = ((Math.cos(i * 2.2 + f * 0.1) * 0.5 + 0.5) * 0.8 + 0.1) * H;
      const a = (Math.sin(f * 0.4 + i) + 1) * 0.07 + 0.03;
      const pSize = Math.sin(i + f * 0.3) * 1.5 + 2;
      ctx.fillStyle = `rgba(255,${100 + i % 100},0,${a})`;
      ctx.beginPath(); ctx.arc(px, py, pSize, 0, Math.PI * 2); ctx.fill();
    }

    // Diagonal fire lines
    ctx.strokeStyle = "rgba(255,120,0,0.06)"; ctx.lineWidth = 1;
    for (let i = -H; i < W + H; i += 35) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke();
    }

    // Header gradient bar
    const hg = ctx.createLinearGradient(0, 0, W, 0);
    hg.addColorStop(0, c1); hg.addColorStop(0.5, c2); hg.addColorStop(1, c3);
    ctx.fillStyle = hg; ctx.fillRect(0, 0, W, 5);
    ctx.fillStyle = hg; ctx.fillRect(0, H - 5, W, 5);

    ctx.fillStyle = "rgba(0,0,0,0.82)"; ctx.fillRect(0, 5, W, 55);
    ctx.font = "bold 27px Arial"; ctx.textAlign = "center"; ctx.fillStyle = c2;
    ctx.shadowColor = c2; ctx.shadowBlur = 22;
    ctx.fillText("🔥  GHOST NET — OWNER FIRE CARD  🔥", W / 2, 42);
    ctx.shadowBlur = 0;

    // Left: Avatar with fire ring
    const avX = 185, avY = H / 2 + 10, avR = 108;
    if (avatar) {
      for (let ring = 2; ring >= 0; ring--) {
        const rc = FIRE[(f + ring) % FIRE.length];
        ctx.beginPath(); ctx.arc(avX, avY, avR + ring * 10 + 8, 0, Math.PI * 2);
        ctx.strokeStyle = rc; ctx.lineWidth = 3 - ring * 0.5;
        ctx.shadowColor = rc; ctx.shadowBlur = 18 + ring * 8; ctx.stroke(); ctx.shadowBlur = 0;
      }
      ctx.save(); ctx.beginPath(); ctx.arc(avX, avY, avR, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(avatar, avX - avR, avY - avR, avR * 2, avR * 2); ctx.restore();
    } else {
      ctx.fillStyle = "rgba(255,100,0,0.35)";
      ctx.beginPath(); ctx.arc(avX, avY, avR, 0, Math.PI * 2); ctx.fill();
      ctx.font = "64px Arial"; ctx.textAlign = "center"; ctx.fillStyle = "#ffd700";
      ctx.fillText("👑", avX, avY + 22);
    }

    // Right info card
    const px = 320, py = 68, panW = 470, panH = H - 88;
    ctx.fillStyle = "rgba(10,3,0,0.78)"; ctx.fillRect(px, py, panW, panH);
    ctx.strokeStyle = c1; ctx.lineWidth = 1.5;
    ctx.shadowColor = c1; ctx.shadowBlur = 14; ctx.strokeRect(px, py, panW, panH); ctx.shadowBlur = 0;

    const fields = [
      ["𝗡𝗔𝗠𝗘", GHOST_CFG.ownerName || "Rakib Islam", c1],
      ["𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡", GHOST_CFG.location || "Saidpur, Nilphamari", c2],
      ["𝗝𝗢𝗕", GHOST_CFG.job || "Student 📚", c3],
      ["𝗛𝗢𝗕𝗕𝗬", GHOST_CFG.hobby || "Gaming & Travelling 🎮", c1],
      ["𝗦𝗧𝗔𝗧𝗨𝗦", GHOST_CFG.status || "Single 💔", c2],
      ["𝗙𝗔𝗜𝗧𝗛", GHOST_CFG.religion || "Islam ☪️", c3],
      ["𝗕𝗢𝗧", `${GHOST_CFG.botName || "Ghost Bot"} | ${GHOST_CFG.prefix || "."}prefix`, c1]
    ];
    let fy = py + 18;
    for (const [k, v, cc] of fields) {
      ctx.font = "10px monospace"; ctx.fillStyle = "rgba(255,180,100,0.5)"; ctx.textAlign = "left";
      ctx.fillText(k, px + 15, fy);
      ctx.font = "bold 15px Arial"; ctx.fillStyle = cc;
      ctx.shadowColor = cc; ctx.shadowBlur = 7;
      ctx.fillText(String(v).slice(0, 44), px + 15, fy + 18); ctx.shadowBlur = 0;
      fy += 38;
    }

    // Bottom crown decoration
    ctx.font = "bold 13px monospace"; ctx.fillStyle = c2; ctx.textAlign = "center";
    ctx.shadowColor = c2; ctx.shadowBlur = 10;
    ctx.fillText(`🔥 GHOST UID: ${OWNER_UID} 🔥`, px + panW / 2, H - 14);
    ctx.shadowBlur = 0;

    enc.addFrame(ctx);
  }
  enc.finish();
  await new Promise(r => ws.on("finish", r));
  return out;
}
