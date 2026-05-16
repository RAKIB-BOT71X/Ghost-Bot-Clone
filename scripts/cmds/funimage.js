const axios = require("axios");
const APIS = [
  { name: "Dog", url: "https://dog.ceo/api/breeds/image/random", extract: d => d.message },
  { name: "Cat", url: "https://api.thecatapi.com/v1/images/search", extract: d => d[0]?.url },
  { name: "Fox", url: "https://randomfox.ca/floof/", extract: d => d.image },
  { name: "Panda", url: "https://some-random-api.ml/animal/panda", extract: d => d.image },
  { name: "Koala", url: "https://some-random-api.ml/animal/koala", extract: d => d.image },
  { name: "Red Panda", url: "https://some-random-api.ml/animal/red_panda", extract: d => d.image },
  { name: "Kangaroo", url: "https://some-random-api.ml/animal/kangaroo", extract: d => d.image },
  { name: "Raccoon", url: "https://some-random-api.ml/animal/raccoon", extract: d => d.image },
];

module.exports = {
  config: {
    name: "funimage",
    aliases: ["funimg", "cuteimg", "animal", "animalpic"],
    version: "2.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Random cute/funny animal images 🐾",
    longDescription: "Shows random cute animal pics — dog, cat, fox, panda, etc.",
    category: "fun", guide: { en: "{pn} [dog|cat|fox|panda|koala|raccoon]" }
  },
  onStart: async function ({ message, event, args }) {
    await message.reaction("⏳", event.messageID);
    let api = args[0] ? APIS.find(a => a.name.toLowerCase() === args[0].toLowerCase()) : null;
    if (!api) api = APIS[Math.floor(Math.random() * APIS.length)];
    try {
      const resp = await axios.get(api.url, { timeout: 10000 });
      const imgUrl = api.extract(resp.data);
      if (!imgUrl) throw new Error("No image");
      const img = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 10000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(img.data));
      await message.reaction("✅", event.messageID);
      return message.reply({
        body: `🐾 ${api.name} Photo!\n\nBy Rakib Islam | Ghost Net 👻`,
        attachment: st
      });
    } catch {
      await message.reaction("❌", event.messageID);
      return message.reply(`❌ ${api.name} image load failed! Try again!`);
    }
  }
};
