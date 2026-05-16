const axios = require("axios");
const MEME_APIS = [
  "https://meme-api.com/gimme",
  "https://meme-api.com/gimme/memes",
  "https://meme-api.com/gimme/dankmemes",
  "https://meme-api.com/gimme/programmerhumor",
];
module.exports = {
  config: {
    name: "funimage2",
    aliases: ["meme2", "memepic", "dank", "dankmeme"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Random meme image from Reddit 😂",
    category: "fun", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const api = MEME_APIS[Math.floor(Math.random() * MEME_APIS.length)];
    try {
      const resp = await axios.get(api, { timeout: 10000 });
      const imgUrl = resp.data.url;
      const img = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 10000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(img.data));
      await message.reaction("✅", event.messageID);
      return message.reply({ body: `😂 ${resp.data.title||"Meme!"}\n\nBy Rakib Islam | Ghost Net 👻`, attachment: st });
    } catch {
      await message.reaction("❌", event.messageID);
      return message.reply("❌ Meme load failed! Try again!");
    }
  }
};
