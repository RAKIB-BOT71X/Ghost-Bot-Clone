const axios = require("axios");
module.exports = {
  config: {
    name: "funimage4",
    aliases: ["neko2", "hentainope", "animeart"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Random anime art image 🎨",
    category: "fun", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const tags = ["anime", "art", "kawaii", "manga", "chibi", "sakura", "otaku"];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    try {
      const resp = await axios.get(`https://api.waifu.im/search?included_tags=${tag}&is_nsfw=false`, { timeout: 10000 });
      const imgUrl = resp.data.images?.[0]?.url;
      if (!imgUrl) throw new Error("No image");
      const img = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 10000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(img.data));
      await message.reaction("✅", event.messageID);
      return message.reply({ body: `🎨 Anime Art: ${tag}\n\nBy Rakib Islam | Ghost Net 👻`, attachment: st });
    } catch {
      await message.reaction("❌", event.messageID);
      return message.reply("❌ Anime art failed! Try again!");
    }
  }
};
