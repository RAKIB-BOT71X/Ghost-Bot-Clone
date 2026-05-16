const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { PassThrough } = require("stream");

async function fetchPinterest(query, count = 5) {
  const apis = [
    `https://sameer-apis.vercel.app/api/pinterest?search=${encodeURIComponent(query)}&count=${count}`,
    `https://joshweb.click/search/pinterest?q=${encodeURIComponent(query)}&count=${count}`,
    `https://api.zenova.my.id/api/search/pinterest?search=${encodeURIComponent(query)}&count=${count}`,
    `https://pinterest-api-f0c6.onrender.com/search?q=${encodeURIComponent(query)}&count=${count}`,
    `https://api.himmelblau.de/api/pinterest?query=${encodeURIComponent(query)}&count=${count}`,
  ];

  for (const url of apis) {
    try {
      const res = await axios.get(url, { timeout: 8000 });
      const data = res.data;
      let imgs = [];
      if (Array.isArray(data?.result)) imgs = data.result.filter(u => typeof u === "string").slice(0, count);
      else if (Array.isArray(data?.data)) imgs = data.data.filter(u => typeof u === "string").slice(0, count);
      else if (Array.isArray(data?.images)) imgs = data.images.slice(0, count);
      else if (Array.isArray(data)) imgs = data.filter(u => typeof u === "string").slice(0, count);
      if (imgs.length > 0) return imgs;
    } catch {}
  }
  return [];
}

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin", "pint"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "📌 Pinterest Image Search",
    longDescription: "Search Pinterest for images. Uses multiple APIs for maximum reliability.",
    category: "image",
    guide: { en: "{pn} <keyword> [count] — Search Pinterest\nExample: .pin Naruto 5\nMax: 8 images" }
  },

  onStart: async function ({ message, event, args }) {
    if (!args.length) {
      return message.reply(
        "📌 Pinterest Search!\n\nUsage: .pin <keyword> [count]\n" +
        "Example: .pin Naruto 5\n         .pin Aesthetic wallpaper 3\nMax: 8 images"
      );
    }

    let count = 5;
    const lastArg = args[args.length - 1];
    if (!isNaN(lastArg) && parseInt(lastArg) >= 1) {
      count = Math.min(parseInt(lastArg), 8);
      args.pop();
    }

    const query = args.join(" ").trim();
    if (!query) return message.reply("❌ কী খুঁজছেন লিখুন!\nExample: .pin Naruto");

    await message.react("🔍");

    try {
      const imageUrls = await fetchPinterest(query, count);

      if (!imageUrls || imageUrls.length === 0) {
        await message.react("❌");
        return message.reply(`❌ "${query}" এর জন্য Pinterest image পাওয়া যায়নি।\n💡 অন্য keyword দিয়ে চেষ্টা করুন।`);
      }

      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);

      const attachments = [];
      const downloaded = [];

      for (let i = 0; i < imageUrls.length; i++) {
        try {
          const imgRes = await axios.get(imageUrls[i], {
            responseType: "arraybuffer",
            timeout: 12000,
            headers: { "User-Agent": "Mozilla/5.0" }
          });
          const ext = imageUrls[i].toLowerCase().includes(".png") ? "png" : "jpg";
          const imgPath = path.join(cacheDir, `pin_${Date.now()}_${i}.${ext}`);
          fs.writeFileSync(imgPath, Buffer.from(imgRes.data));
          attachments.push(fs.createReadStream(imgPath));
          downloaded.push(imgPath);
        } catch {}
      }

      if (attachments.length === 0) {
        await message.react("❌");
        return message.reply("❌ Image download করতে সমস্যা। আবার try করুন।");
      }

      await message.react("✅");
      message.reply({
        body: `📌 Pinterest: "${query}"\n${attachments.length} টি image পাওয়া গেছে\n\n🤖 Ghost Net — Ewr Hinata`,
        attachment: attachments
      }, () => {
        setTimeout(() => { for (const p of downloaded) { try { fs.unlinkSync(p); } catch {} } }, 15000);
      });
    } catch (err) {
      await message.react("❌");
      return message.reply(`❌ Pinterest search সমস্যা: ${err.message}`);
    }
  }
};
