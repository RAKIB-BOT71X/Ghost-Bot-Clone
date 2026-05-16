const axios = require("axios");
const os = require("os");

const BOT_GIF = [
  "https://media.tenor.com/5QTkCbxCfvgAAAAC/robot-anime.gif",
  "https://media.tenor.com/XjMPL3X2YNIAAAAC/anime-bot.gif",
  "https://media.tenor.com/7Sv6qCJbqhsAAAAC/ghost-loading.gif",
  "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif",
  "https://media.tenor.com/M4UYdtYjnNsAAAAC/neon-glitch.gif"
];

const botCards = [
  (u) => `🤖 ɢʜᴏꜱᴛ ʙᴏᴛ — ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏ 🤖\n${"═".repeat(28)}\n\n🤖 Name     : Ghost Bot\n🏷️ Version  : Ghost Net Edition\n⚙️ Engine   : GoatBot V2\n📦 Commands : 400+\n🌐 Platform : Facebook Messenger\n🧠 AI       : HuggingFace (21 cmds)\n\n${"═".repeat(28)}\n👻 "Built different, runs different"`,
  (u) => `⚡ ɢʜᴏꜱᴛ ʙᴏᴛ — ᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ ⚡\n${"▬".repeat(28)}\n\n💾 RAM Used : ${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)} MB\n🖥️ Total RAM: ${Math.round(os.totalmem() / 1024 / 1024)} MB\n⏱️ Uptime   : ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m\n🔧 Node.js  : ${process.version}\n🖥️ OS       : ${os.type()} ${os.release()}\n💻 CPU      : ${os.cpus()[0]?.model || "Unknown"}\n\n${"▬".repeat(28)}\n🚀 "Always online, always ready"`,
  (u) => `🌟 ɢʜᴏꜱᴛ ʙᴏᴛ — ꜰᴇᴀᴛᴜʀᴇꜱ 🌟\n${"◆".repeat(28)}\n\n✅ Dual FCA Switch System\n✅ 21 HuggingFace AI Commands\n✅ Anime Girl Voice (TTS)\n✅ Image Manipulation Suite\n✅ Games & Entertainment\n✅ Auto Moderation\n✅ Economy & Bank System\n✅ Multi-Language Support\n\n${"◆".repeat(28)}\n👻 "400+ commands, infinite possibilities"`,
  (u) => `🔥 ɢʜᴏꜱᴛ ʙᴏᴛ — ʜɪꜱᴛᴏʀʏ 🔥\n${"─".repeat(28)}\n\n📖 Based On  : GoatBot V2\n🔀 Merged    : Prime + MAMUN V2\n🎯 Edition   : Ghost Net\n👤 Owner     : Rakib Islam\n🌍 Origin    : Bangladesh 🇧🇩\n📅 Born      : 2024\n🏆 Commands  : 400+ combined\n\n${"─".repeat(28)}\n👻 "Two bots merged into one legend"`,
  (u) => `💫 ɢʜᴏꜱᴛ ʙᴏᴛ — ꜱᴛᴀᴛᴜꜱ 💫\n${"░".repeat(28)}\n\n🟢 Status    : ONLINE\n🔋 Power     : 100%\n🛡️ Security  : Protected\n📡 Signal    : Strong\n🔗 Network   : Connected\n⚡ Speed     : Lightning Fast\n👻 Ghost Mode: ACTIVE\n\n${"░".repeat(28)}\n💌 "Ghost Bot — The Spirit of Automation"`
];

module.exports = {
  config: {
    name: "ghostbotinfo",
    version: "3.0",
    author: "Rakib Islam",
    aliases: ["botinfo", "ghostinfo2", "aboutbot"],
    countDown: 10,
    role: 0,
    shortDescription: "Ghost Bot info cards (5 animated GIF)",
    longDescription: "5 unique animated info cards about Ghost Bot — specs, features, history, status",
    category: "info",
    guide: { en: "{pn} — Shows bot info card\n{pn} 2/3/4/5 — Different styles" }
  },

  onStart: async function ({ message, args }) {
    const idx = Math.min(Math.max((parseInt(args[0]) || 1) - 1, 0), 4);
    const gif = BOT_GIF[idx];
    const body = botCards[idx]() + `\n\n🔢 Card ${idx + 1}/5 | .ghostbotinfo 1-5`;

    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const stream = require("stream");
      const readable = new stream.PassThrough();
      readable.end(Buffer.from(res.data));
      message.reply({ body, attachment: readable });
    } catch {
      message.reply(body);
    }
  }
};
