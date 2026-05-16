const axios = require("axios");
const ROASTS = [
  "তোর চেহারা দেখে আয়না নিজেই ভাঙে! 😂",
  "তুই এত বোকা যে WiFi password ভুলে যাস! 🤣",
  "তোর IQ আর তোর shoe size একই! 😂",
  "তোর জন্য বলছি, পরের বার জন্মাস না! 💀",
  "তুই এত slow যে turtle-ও তোরে হাসে! 🐢",
  "তোর logic শুনলে Einstein কাঁদত! 😂",
  "তুই কি বোকা নাকি বোকার অভিনয় করছিস? 🤔",
  "তোর মাথায় যদি GPS থাকত, সিগন্যাল পেত না! 📡",
  "তোর কথা শুনে brain cells আত্মহত্যা করে! 💀",
  "তুই এতটাই average যে কেউ care করে না! 😂",
  "তোর face একটা natural mosquito repellent! 😂",
  "তুই যদি অক্সিজেন হতিস, তুই rare element হতিস কারণ তুই useless! 💀",
  "তোর ভবিষ্যৎ এত dark যে sunglasses দরকার! 😎",
  "তুই এত কম important যে তোর shadow-ও থাকতে চায় না! 😂",
  "তোর presence একটা warning sign! ⚠️",
];
const GIFS = [
  "https://media.tenor.com/XjMPL3X2YNIAAAAC/anime-bot.gif",
  "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif",
];
module.exports = {
  config: {
    name: "roast2",
    aliases: ["savage2", "burn2", "roasthard"],
    version: "2.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Savage roast v2 — mention someone 🔥",
    category: "fun", guide: { en: "{pn} @mention" }
  },
  onStart: async function ({ message, event, usersData }) {
    const uid2 = Object.keys(event.mentions||{})[0]||event.messageReply?.senderID;
    if (!uid2) return message.reply("🔥 কাকে roast করব? Mention দাও!");
    const n1 = (await usersData.get(event.senderID))?.name||"Chef";
    const n2 = (await usersData.get(uid2))?.name||"Target";
    const roast = ROASTS[Math.floor(Math.random()*ROASTS.length)];
    const body = `🔥 ${n1} ROASTED ${n2}:\n\n${roast}\n\n🔥 ════ Roast2 ════ 🔥\n  By Rakib Islam | Ghost Net 👻`;
    const gif = GIFS[Math.floor(Math.random()*GIFS.length)];
    try {
      const res = await axios.get(gif, { responseType:"arraybuffer", timeout:8000 });
      const {PassThrough}=require("stream"); const st=new PassThrough(); st.end(Buffer.from(res.data));
      return message.reply({ body, attachment: st });
    } catch { return message.reply(body); }
  }
};
