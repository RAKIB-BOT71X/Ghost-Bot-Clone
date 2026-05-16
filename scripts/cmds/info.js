const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

const GIFS = [
  "https://media.tenor.com/N3BJfA-C1oQAAAAC/anime-girl.gif",
  "https://media.tenor.com/XjMPL3X2YNIAAAAC/anime-bot.gif",
  "https://media.tenor.com/FBi2gu-MQUYAAAAC/aesthetic-anime.gif",
  "https://media.tenor.com/7h5XK2ZBMHQAAAAC/anime-cute.gif",
  "https://media.tenor.com/3PY3nJNhBJsAAAAC/hinata-shy.gif",
];

module.exports = {
  config: {
    name: "info",
    aliases: ["botinfo", "aboutbot", "myinfo", "ghostdetails"],
    version: "5.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Owner & Bot info with GIF animation 🌸",
    longDescription: "Shows complete info about the bot owner Rakib Islam and bot details with animated GIF.",
    category: "owner",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600), m = Math.floor((uptime % 3600) / 60), s = Math.floor(uptime % 60);
    const totalCmds = fs.readdirSync(path.join(__dirname)).filter(f => f.endsWith(".js")).length;

    const body =
      `🌸 ━━━━━━━━━━━━━━━━━━━━━━ 🌸\n` +
      `     𝗘𝘄𝗿 𝗛𝗶𝗻𝗮𝘁𝗮 — Owner Info ✨\n` +
      `🌸 ━━━━━━━━━━━━━━━━━━━━━━ 🌸\n\n` +
      `👤 Name      : ${GHOST.ownerName}\n` +
      `📍 Location  : ${GHOST.location}\n` +
      `💼 Job       : ${GHOST.job}\n` +
      `🎓 Class     : ${GHOST.class}\n` +
      `🎂 Age       : ${GHOST.age}\n` +
      `🎮 Hobby     : ${GHOST.hobby}\n` +
      `💍 Status    : ${GHOST.status}\n` +
      `☪️  Religion  : ${GHOST.religion}\n` +
      `🔗 Contact   : ${GHOST.contact}\n\n` +
      `🤖 ─── Bot Details ───\n` +
      `🌸 Bot Name  : ${GHOST.botName}\n` +
      `🔑 Prefix    : ${GHOST.prefix}\n` +
      `⏱️  Uptime    : ${h}h ${m}m ${s}s\n` +
      `💻 Commands  : ${totalCmds}+\n` +
      `🌐 Edition   : ${GHOST.botEdition}\n\n` +
      `🌸 ━━━━━━━━━━━━━━━━━━━━━━ 🌸\n` +
      `      Made with ❤️ by Rakib Islam`;

    const gif = GIFS[Math.floor(Math.random() * GIFS.length)];
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 10000 });
      const { PassThrough } = require("stream");
      const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID);
      return message.reply({ body, attachment: st });
    } catch {
      await message.reaction("✅", event.messageID);
      return message.reply(body);
    }
  }
};
