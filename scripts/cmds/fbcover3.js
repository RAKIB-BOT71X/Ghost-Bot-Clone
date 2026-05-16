const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

const TEMPLATES = [
  {
    name: "🌸 Cherry Blossom",
    gradient: ["#ff9a9e", "#fecfef", "#feada6"],
    accent: "#c0392b",
    textColor: "#ffffff",
    pattern: "flowers"
  },
  {
    name: "🌌 Galaxy Dark",
    gradient: ["#0f0c29", "#302b63", "#24243e"],
    accent: "#9b59b6",
    textColor: "#e0d4ff",
    pattern: "stars"
  },
  {
    name: "🔥 Fire & Gold",
    gradient: ["#f12711", "#f5af19", "#fc4a1a"],
    accent: "#ffd700",
    textColor: "#ffffff",
    pattern: "flames"
  },
  {
    name: "🌊 Ocean Depth",
    gradient: ["#0575e6", "#021b79", "#00c3ff"],
    accent: "#00e5ff",
    textColor: "#ffffff",
    pattern: "waves"
  },
  {
    name: "💎 Diamond Elite",
    gradient: ["#232526", "#414345", "#c0392b"],
    accent: "#00d2ff",
    textColor: "#ffffff",
    pattern: "diamond"
  },
  {
    name: "🌿 Nature Calm",
    gradient: ["#134e5e", "#71b280", "#11998e"],
    accent: "#a8e6cf",
    textColor: "#ffffff",
    pattern: "leaves"
  },
  {
    name: "🎭 Neon Cyber",
    gradient: ["#0a0a0a", "#1a1a2e", "#16213e"],
    accent: "#00ff88",
    textColor: "#00ff88",
    pattern: "grid"
  },
  {
    name: "🏆 Royal Gold",
    gradient: ["#1a0533", "#4a0080", "#b8860b"],
    accent: "#ffd700",
    textColor: "#ffd700",
    pattern: "crown"
  }
];

function drawTemplate(ctx, w, h, template, name, uid) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  template.gradient.forEach((c, i) => g.addColorStop(i / (template.gradient.length - 1), c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * w,
      Math.random() * h,
      50 + Math.random() * 150,
      0, Math.PI * 2
    );
    ctx.fill();
  }

  ctx.strokeStyle = template.accent + "55";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  ctx.strokeStyle = template.accent;
  ctx.lineWidth = 4;
  const m = 20;
  ctx.strokeRect(m, m, w - 2 * m, h - 2 * m);

  ctx.strokeStyle = template.accent + "aa";
  ctx.lineWidth = 1.5;
  const m2 = 26;
  ctx.strokeRect(m2, m2, w - 2 * m2, h - 2 * m2);

  const cs = 30;
  ctx.fillStyle = template.accent;
  [[m, m], [w-m-cs, m], [m, h-m-cs], [w-m-cs, h-m-cs]].forEach(([cx, cy]) => {
    ctx.fillRect(cx, cy, cs, 4);
    ctx.fillRect(cx, cy, 4, cs);
  });

  ctx.fillStyle = template.textColor;
  ctx.font = "bold 52px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 15;
  ctx.fillText(name.toUpperCase(), w / 2, h / 2 - 20);

  ctx.font = "22px Arial";
  ctx.fillStyle = template.accent;
  ctx.fillText(`UID: ${uid}`, w / 2, h / 2 + 30);

  ctx.font = "16px Arial";
  ctx.fillStyle = template.textColor + "bb";
  ctx.fillText("👑 Ghost Net Edition — Ewr Hinata", w / 2, h - m - 35);
  ctx.fillText("Owner: Rakib Islam, Saidpur, Nilphamari", w / 2, h - m - 15);

  ctx.shadowBlur = 0;
}

module.exports = {
  config: {
    name: "fbcover3",
    aliases: ["cover3", "fbcover", "covercard"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: "🖼️ Ultra Design FB Cover",
    longDescription: "Generate a beautiful ultra-designed Facebook cover photo! 8 unique templates.",
    category: "image",
    guide: { en: "{pn} <name> [template 1-8] — Generate cover\nExample: .fbcover3 Rakib Islam 3\nNo template = random" }
  },

  onStart: async function ({ message, event, args }) {
    const { senderID } = event;

    let template = Math.floor(Math.random() * TEMPLATES.length);
    const lastArg = args[args.length - 1];
    if (!isNaN(lastArg) && parseInt(lastArg) >= 1 && parseInt(lastArg) <= TEMPLATES.length) {
      template = parseInt(lastArg) - 1;
      args.pop();
    }

    const name = args.join(" ").trim() || "Ewr Hinata";
    const t = TEMPLATES[template];

    if (!name && args.length === 0) {
      const list = TEMPLATES.map((t, i) => `${i + 1}. ${t.name}`).join("\n");
      return message.reply(
        `🖼️ FB Cover Generator!\n\nTemplates:\n${list}\n\n` +
        `Usage: .fbcover3 <name> [1-8]\nExample: .fbcover3 Rakib Islam 5`
      );
    }

    await message.react("⏳");

    try {
      const W = 820, H = 312;
      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext("2d");

      drawTemplate(ctx, W, H, t, name, senderID);

      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);
      const outPath = path.join(cacheDir, `cover_${senderID}_${Date.now()}.png`);
      fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

      await message.react("✅");
      await message.reply({
        body: `🖼️ FB Cover — ${t.name}\n👤 Name: ${name}\n\n🤖 Ghost Net — Ewr Hinata`,
        attachment: fs.createReadStream(outPath)
      });

      setTimeout(() => { try { fs.unlinkSync(outPath); } catch {} }, 30000);
    } catch (err) {
      await message.react("❌");
      return message.reply(`❌ Cover তৈরি করতে সমস্যা: ${err.message}`);
    }
  }
};
