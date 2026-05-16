const axios = require("axios");
module.exports = {
  config: {
    name: "funimage3",
    aliases: ["waifu", "animegirl", "animeimg"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Waifu/anime girl image 🌸",
    category: "fun", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const categories = ["waifu", "neko", "shinobu", "megumin", "awoo", "nia"];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    try {
      const resp = await axios.get(`https://api.waifu.pics/sfw/${cat}`, { timeout: 10000 });
      const imgUrl = resp.data.url;
      const img = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 10000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(img.data));
      await message.reaction("✅", event.messageID);
      return message.reply({ body: `🌸 Anime: ${cat}\n\nBy Rakib Islam | Ghost Net 👻`, attachment: st });
    } catch {
      await message.reaction("❌", event.messageID);
      return message.reply("❌ Anime image failed! Try again!");
    }
  }
};
