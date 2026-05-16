const axios = require("axios");
const GHOST = require("fs-extra").readJsonSync(require("path").join(__dirname, "../../ghostConfig.json"));
module.exports = {
  config: {
    name: "spy2",
    aliases: ["deepspy2", "snoop2", "stalk2"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Spy v2 — profile deep dive 🕵️",
    category: "utility", guide: { en: "{pn} @mention" }
  },
  onStart: async function ({ api, event, message, usersData }) {
    await message.reaction("⏳", event.messageID);
    const mentionIDs = Object.keys(event.mentions||{});
    let targetID = mentionIDs[0] || (event.type==="message_reply"?event.messageReply.senderID:event.senderID);
    let name="Unknown", gender="Unknown";
    try {
      const info = await new Promise((res,rej)=>api.getUserInfo(targetID,(e,r)=>e?rej(e):res(r)));
      name = info[targetID]?.name||"Unknown";
      gender = info[targetID]?.gender===2?"Male":info[targetID]?.gender===1?"Female":"Unknown";
    } catch {}
    const userRecord = await usersData.get(targetID).catch(()=>({}));
    const exp = userRecord?.exp||0, money = userRecord?.money||0;
    const icons = ["🕵️","👁️","🔭","🌐","🔍"];
    const ico = icons[2%icons.length];
    const body =
      ico+" ════════════════════ "+ico+"\n"+
      "   𝗦𝗣𝗬 𝗥𝗘𝗣𝗢𝗥𝗧 v2\n"+
      ico+" ════════════════════ "+ico+"\n\n"+
      "👤 Name   : "+name+"\n"+
      "🔑 UID    : "+targetID+"\n"+
      "⚧  Gender : "+gender+"\n"+
      "⭐ EXP    : "+exp+"\n"+
      "💰 Money  : "+money+"\n"+
      "🔗 FB     : fb.com/"+targetID+"\n\n"+
      "📊 Activity Level : "+["🔥 Very Active","✅ Active","😴 Inactive"][2%3]+"\n\n"+
      ico+" ════════════════════ "+ico+"\n"+
      "  👻 "+GHOST.botName+" | Spy v2";
    const gif = "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif";
    try {
      const res = await axios.get(gif, { responseType:"arraybuffer", timeout:8000 });
      const {PassThrough}=require("stream"); const st=new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
