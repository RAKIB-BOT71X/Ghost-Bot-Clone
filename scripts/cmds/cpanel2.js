const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "cpanel2",
    aliases: ["cp2", "botmanage", "botadmin"],
    version: "1.0", author: "Rakib Islam",
    countDown: 10, role: 2,
    shortDescription: "Admin Panel v2 — Group & User stats 👥",
    category: "admin", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event, usersData, threadsData }) {
    await message.reaction("⏳", event.messageID);
    let users = "?", threads = "?";
    try { users = (await usersData.getAll()).length; } catch {}
    try { threads = (await threadsData.getAll()).length; } catch {}
    const totalCmds = fs.readdirSync(path.join(__dirname)).filter(f=>f.endsWith(".js")).length;
    const upSec = process.uptime();
    const body =
      `👥 ════════════════════════ 👥\n` +
      `   𝗔𝗱𝗺𝗶𝗻 𝗣𝗮𝗻𝗲𝗹 𝘃𝟮 — Stats\n` +
      `👥 ════════════════════════ 👥\n\n` +
      `🤖 Bot Name   : ${GHOST.botName}\n` +
      `👑 Owner      : ${GHOST.ownerName}\n` +
      `🔑 Prefix     : ${GHOST.prefix}\n` +
      `💻 Commands   : ${totalCmds}+\n\n` +
      `📊 User Data:\n` +
      `   👤 Total Users  : ${users}\n` +
      `   💬 Total Groups : ${threads}\n\n` +
      `⏱️  Uptime         : ${Math.floor(upSec/3600)}h ${Math.floor((upSec%3600)/60)}m\n` +
      `💾 RAM             : ${Math.round((os.totalmem()-os.freemem())/1e6)}/${Math.round(os.totalmem()/1e6)}MB\n\n` +
      `👥 ════════════════════════ 👥\n` +
      `  👻 Ghost Net Admin Panel v2`;
    const gif = "https://media.tenor.com/svLMd5r2KRYAAAAC/neon-light.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
