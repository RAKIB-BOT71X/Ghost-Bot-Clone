const axios = require("axios");
module.exports = {
  config: {
    name: "poke2",
    aliases: ["nudge", "jab"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Poke2 — double poke with GIF 👆",
    category: "fun", guide: { en: "{pn} @mention" }
  },
  onStart: async function ({ message, event, usersData }) {
    const uid2 = Object.keys(event.mentions||{})[0]||event.messageReply?.senderID;
    if (!uid2) return message.reply("👆 Kake poke korbe?");
    const n1 = (await usersData.get(event.senderID))?.name||"You";
    const n2 = (await usersData.get(uid2))?.name||"Them";
    const body = `👆👆 ${n1} DOUBLE POKED ${n2}!\n😤 Respond koro! Ignore korbe na!\n\n👆 By Rakib Islam | Ghost Net 👻`;
    const gif = "https://media.tenor.com/7h5XK2ZBMHQAAAAC/anime-cute.gif";
    try {
      const res = await axios.get(gif, { responseType:"arraybuffer", timeout:8000 });
      const {PassThrough}=require("stream"); const st=new PassThrough(); st.end(Buffer.from(res.data));
      return message.reply({ body, attachment: st });
    } catch { return message.reply(body); }
  }
};
