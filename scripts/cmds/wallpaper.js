const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const UNSPLASH_ACCESS_KEY = "client_id=bEbQZRVPBCpzXD4oCa7U2XEkR6JW1ZjlkRH9FKjE8fI";

const CATEGORIES = [
  "nature", "anime", "city", "abstract", "space", "mountain",
  "ocean", "forest", "sunset", "dark", "aesthetic", "gaming",
  "car", "flower", "rain", "night", "galaxy", "fire", "winter", "beach"
];

async function getUnsplashImage(query) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&${UNSPLASH_ACCESS_KEY}`;
  const res = await axios.get(url, { timeout: 10000 });
  return {
    url: res.data.urls.full,
    description: res.data.description || res.data.alt_description || query,
    author: res.data.user?.name || "Unknown",
    link: res.data.links?.html || ""
  };
}

async function getLoremPicsumImage(width = 1920, height = 1080) {
  return {
    url: `https://picsum.photos/${width}/${height}?random=${Date.now()}`,
    description: "Random beautiful wallpaper",
    author: "Rakib Islam",
    link: "https://picsum.photos"
  };
}

async function downloadImage(url, outPath) {
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 20000 });
  fs.writeFileSync(outPath, Buffer.from(res.data));
}

module.exports = {
  config: {
    name: "wallpaper",
    aliases: ["wp", "wall", "bg", "background"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "🖼️ HD wallpaper download",
    longDescription: "Download beautiful HD wallpapers from Unsplash and other sources.",
    category: "utility",
    guide: {
      en: [
        "{pn} [category] — Download random wallpaper",
        "{pn} anime — Anime wallpaper",
        "{pn} nature — Nature wallpaper",
        "{pn} space — Space wallpaper",
        "{pn} list — All categories",
        "",
        "Categories: " + CATEGORIES.join(", ")
      ].join("\n")
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    if (args[0]?.toLowerCase() === "list") {
      return message.reply(
        `🖼️ 𝗪𝗔𝗟𝗟𝗣𝗔𝗣𝗘𝗥 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗘𝗦\n━━━━━━━━━━━━━━━━\n` +
        CATEGORIES.map((c, i) => `${String(i + 1).padStart(2, "0")}▸ .wp ${c}`).join("\n") +
        `\n━━━━━━━━━━━━━━━━\n📌 .wp [category] or .wp (random)`
      );
    }

    const query = args.join(" ").trim() || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const outPath = path.join(cacheDir, `wp_${Date.now()}.jpg`);
    let imgData;

    try {
      imgData = await getUnsplashImage(query);
    } catch {
      try {
        imgData = await getLoremPicsumImage();
        imgData.description = query + " wallpaper";
      } catch {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply("❌ Wallpaper service unavailable। আবার try করুন।");
      }
    }

    try {
      await downloadImage(imgData.url, outPath);
    } catch {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ Image download করতে সমস্যা হয়েছে।");
    }

    await api.sendMessage(
      {
        body:
          `🖼️ 𝗪𝗔𝗟𝗟𝗣𝗔𝗣𝗘𝗥\n` +
          `━━━━━━━━━━━━━━━━\n` +
          `🔍 Category: ${query}\n` +
          `📸 Photo by: ${imgData.author}\n` +
          `━━━━━━━━━━━━━━━━\n` +
          `💡 .wallpaper list — সব category দেখুন`,
        attachment: fs.createReadStream(outPath)
      },
      event.threadID,
      () => { try { fs.unlinkSync(outPath); } catch {} },
      event.messageID
    );
    api.setMessageReaction("✅", event.messageID, () => {}, true);
  }
};
