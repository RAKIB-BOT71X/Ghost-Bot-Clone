const axios = require("axios");
module.exports = {
  config: {
    name: "bonk2",
    aliases: ["headbonk", "bonkhard"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Bonk2 — Heavy bonk! 🔨",
    category: "fun", guide: { en: "{pn} @mention" }
  },
  onStart: async function ({ message, event, usersData }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions||{})[0] || event.messageReply?.senderID;
    if (!uid2) return message.reply("🔨 Kake bonk korbe? Mention dao!");
    const n1 = (await usersData.get(uid1))?.name||"You";
    const n2 = (await usersData.get(uid2))?.name||"Them";
    const msgs = [
      `🔨 BONK! ${n1} slammed ${n2} super hard! OUCH! 😂`,
      `💥 ${n2} got MEGA BONKED by ${n1}! Stars everywhere! ⭐`,
      `🔨 HARD BONK! ${n1} → ${n2} | HP: -9999 😂`,
    ];
    const body = msgs[Math.floor(Math.random()*msgs.length)]+"\n\n🔨 By Rakib Islam | Ghost Net 👻";
    const gif = "https://media.tenor.com/XjMPL3X2YNIAAAAC/anime-bot.gif";
    try {
      const res = await axios.get(gif, { responseType:"arraybuffer", timeout:8000 });
      const {PassThrough}=require("stream"); const st=new PassThrough(); st.end(Buffer.from(res.data));
      return message.reply({ body, attachment: st });
    } catch { return message.reply(body); }
  }
};
