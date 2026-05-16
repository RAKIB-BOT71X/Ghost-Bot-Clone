const axios = require("axios");
module.exports = {
  config: {
    name: "wink2",
    aliases: ["flirtwink", "eyewink"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Wink2 — cheeky anime wink 😉",
    category: "fun", guide: { en: "{pn} @mention" }
  },
  onStart: async function ({ message, event, usersData }) {
    const uid2 = Object.keys(event.mentions||{})[0]||event.messageReply?.senderID;
    const n1 = (await usersData.get(event.senderID))?.name||"You";
    const n2 = uid2 ? (await usersData.get(uid2))?.name||"Partner" : "everyone";
    const body = `😉 ${n1} winked at ${n2}!\n💫 "Tumi catch korecho? 😏"\n\n😉 By Rakib Islam | Ghost Net 👻`;
    const gif = "https://media.tenor.com/FBi2gu-MQUYAAAAC/aesthetic-anime.gif";
    try {
      const res = await axios.get(gif, { responseType:"arraybuffer", timeout:8000 });
      const {PassThrough}=require("stream"); const st=new PassThrough(); st.end(Buffer.from(res.data));
      return message.reply({ body, attachment: st });
    } catch { return message.reply(body); }
  }
};
