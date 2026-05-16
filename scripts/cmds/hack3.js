const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "hack3",
    aliases: ["matrixhack"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Matrix rain hacking prank with target's avatar",
    category: "prank",
    guide: { en: "{p}hack3 @mention | reply | <uid>" }
  },

  onStart: async function ({ event, message, args, api, usersData }) {
    let uid = event.senderID;
    if (event.type === "message_reply") uid = event.messageReply.senderID;
    else if (Object.keys(event.mentions || {}).length) uid = Object.keys(event.mentions)[0];
    else if (args[0] && /^\d+$/.test(args[0])) uid = args[0];

    await message.reaction("⏳", event.messageID);
    let name = "Target";
    try { name = (await api.getUserInfo(uid))[uid].name; } catch {}

    const W = 900, H = 600;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    // Matrix rain
    ctx.font = "16px monospace";
    const cols = Math.floor(W / 14);
    for (let c = 0; c < cols; c++) {
      const x = c * 14;
      const len = 5 + Math.floor(Math.random() * 30);
      for (let i = 0; i < len; i++) {
        const ch = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
        const a = 1 - i / len;
        ctx.fillStyle = `rgba(0,255,70,${a * 0.9})`;
        if (i === 0) { ctx.shadowColor = "#0f0"; ctx.shadowBlur = 10; }
        ctx.fillText(ch, x, 20 + i * 18);
        ctx.shadowBlur = 0;
      }
    }

    // Avatar circle
    try {
      const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
      const av = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
      const cx = W / 2, cy = H / 2 - 30, r = 90;
      ctx.save();
      for (let i = 3; i > 0; i--) {
        ctx.beginPath();
        ctx.arc(cx, cy, r + i * 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,255,70,${0.3 / i})`;
        ctx.lineWidth = 4;
        ctx.shadowColor = "#0f0"; ctx.shadowBlur = 30;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(av, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
    } catch {}

    // HUD text
    ctx.fillStyle = "#0f0";
    ctx.shadowColor = "#0f0"; ctx.shadowBlur = 15;
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText("⚠ ACCESS GRANTED ⚠", W / 2, H - 130);
    ctx.font = "16px monospace";
    ctx.fillText(`TARGET: ${name.toUpperCase()}`, W / 2, H - 100);
    ctx.fillText(`UID: ${uid}`, W / 2, H - 80);
    ctx.fillText(`STATUS: COMPROMISED`, W / 2, H - 60);
    ctx.fillText(`>>> GHOST NET EDITION <<<`, W / 2, H - 30);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const out = path.join(cacheDir, `hack3_${uid}.png`);
    fs.writeFileSync(out, canvas.toBuffer("image/png"));

    await message.reaction("✅", event.messageID);
    await message.reply({
      body: `👻 ${name} এর Facebook account hack করা হয়েছে!\n💀 All data leaked to Ghost Net servers.\n\n(Just a prank 😆)`,
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.unlinkSync(out), 5000);
    // Animated GIF after hack image
    try {
      const gifRes = await axios.get("https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif", { responseType: "arraybuffer", timeout: 10000 });
      const { PassThrough } = require("stream");
      const gifSt = new PassThrough(); gifSt.end(Buffer.from(gifRes.data));
      await message.reply({ body: "💀 Ghost Net Hack Complete! — Rakib Islam", attachment: gifSt });
    } catch {}
  }
};
