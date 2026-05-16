const axios = require("axios");
module.exports = {
  config: {
    name: "pat2",
    aliases: ["headpat2", "goodgirl", "goodboy"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Head pat2 — extra fluffy 🐾",
    category: "fun", guide: { en: "{pn} @mention" }
  },
  onStart: async function ({ message, event, usersData }) {
    const uid2 = Object.keys(event.mentions||{})[0] || event.messageReply?.senderID;
    if (!uid2) return message.reply("🐾 Kake pat korbe? Mention dao!");
    const n1 = (await usersData.get(event.senderID))?.name||"You";
    const n2 = (await usersData.get(uid2))?.name||"Them";
    const msgs = [`🌸 ${n1} gently pats ${n2}! Good human! 🐾`,`💆 ${n2} feels so fluffy after ${n1}'s pat! ☁️`,`🌟 ${n1} → ${n2}: *pat pat pat* Tumi onek valo! 😊`];
    const body = msgs[Math.floor(Math.random()*msgs.length)]+"\n\n🐾 By Rakib Islam | Ghost Net 👻";
    const gif = "https://media.tenor.com/N3BJfA-C1oQAAAAC/anime-girl.gif";
    try {
      const res = await axios.get(gif, { responseType:"arraybuffer", timeout:8000 });
      const {PassThrough}=require("stream"); const st=new PassThrough(); st.end(Buffer.from(res.data));
      return message.reply({ body, attachment: st });
    } catch { return message.reply(body); }
  }
};
