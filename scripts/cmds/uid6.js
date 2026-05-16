const axios = require("axios");
const GHOST = require("fs-extra").readJsonSync(require("path").join(__dirname, "../../ghostConfig.json"));
const GIFS = [
  "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif",
  "https://media.tenor.com/svLMd5r2KRYAAAAC/neon-light.gif",
  "https://media.tenor.com/QWCII8p7iqQAAAAC/galaxy-space.gif",
];
module.exports = {
  config: {
    name: "uid6",
    aliases: ["getuid6", "fbid6", "userid6"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Facebook UID finder v6 — style 6 🔍",
    category: "utility", guide: { en: "{pn} @mention | reply | link" }
  },
  onStart: async function ({ message, event, api, usersData, args }) {
    await message.reaction("⏳", event.messageID);
    let targetID = event.senderID;
    const mentionIDs = Object.keys(event.mentions||{});
    if (mentionIDs.length) targetID = mentionIDs[0];
    else if (event.type==="message_reply") targetID = event.messageReply.senderID;
    else if (args[0]) {
      const numeric = /^\d+$/.test(args[0]) ? args[0] : null;
      const linkMatch = args[0].match(/profile\.php\?id=(\d+)/);
      if (numeric) targetID = numeric;
      else if (linkMatch) targetID = linkMatch[1];
    }
    let name = "Unknown";
    try {
      const info = await new Promise((res,rej)=>api.getUserInfo(targetID,(e,r)=>e?rej(e):res(r)));
      name = info[targetID]?.name || "Unknown";
    } catch {}
    const frames = ["🔍","🕵️","👁️","🌐","🔐"];
    const ico = frames[6%frames.length];
    const body =
      ico+" ════════════════════ "+ico+"\n"+
      "   𝗙𝗕 𝗨𝗜𝗗 𝗙𝗶𝗻𝗱𝗲𝗿 𝘃6\n"+
      ico+" ════════════════════ "+ico+"\n\n"+
      "👤 Name    : "+name+"\n"+
      "🔑 UID     : "+targetID+"\n"+
      "🔗 Profile : fb.com/"+targetID+"\n"+
      "📸 Avatar  : graph.facebook.com/"+targetID+"/picture\n\n"+
      ico+" ════════════════════ "+ico+"\n"+
      "  👻 "+GHOST.botName+" | "+GHOST.ownerName;
    const gif = GIFS[6%GIFS.length];
    try {
      const res = await axios.get(gif, { responseType:"arraybuffer", timeout:8000 });
      const {PassThrough}=require("stream"); const st=new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
