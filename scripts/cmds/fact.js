const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

const LOCAL_FACTS = [
  "মানুষের মস্তিষ্ক দিনে প্রায় ৭০,০০০ চিন্তা করে! 🧠",
  "Octopus এর তিনটা হৃদয় আছে! 🐙",
  "মধু হাজার বছর পরেও নষ্ট হয় না! 🍯",
  "Butterfly রঙ দেখে পায়ের মাধ্যমে! 🦋",
  "বাংলাদেশ পৃথিবীর সবচেয়ে বেশি জনঘনত্বের দেশগুলোর একটি। 🇧🇩",
  "Shark এর কঙ্কাল সম্পূর্ণ cartilage দিয়ে তৈরি, হাড় নেই! 🦈",
  "Snail ঘুমায় ৩ বছর পর্যন্ত! 🐌",
  "একটা মুরগী ডিম দিতে ২৪-২৬ ঘণ্টা লাগে! 🐔",
  "বিড়াল ব্লু কালার দেখতে পায় না! 🐱",
  "পৃথিবীতে মানুষের চেয়ে বেশি পিঁপড়া আছে! 🐜",
  "চোখের পাপড়ি গড়ে ১৫০ দিন বাঁচে। 👁️",
  "Amazon rainforest পৃথিবীর ২০% অক্সিজেন তৈরি করে! 🌳",
  "একটা মানুষ সারাজীবনে গড়ে ৩৫ টন খাবার খায়! 🍽️",
  "Wifi এর আবিষ্কার হয়েছিল দুর্ঘটনাক্রমে! 📶",
  "Facebook এর প্রথম নাম ছিল 'The Facebook'। 📘",
  "Google প্রতিদিন ৮.৫ বিলিয়নের বেশি search হয়! 🔍",
  "চাঁদে পানি আছে — NASA এটা নিশ্চিত করেছে! 🌙",
  "একটা হাতি ২০ মাইল দূর থেকে পানির গন্ধ পায়! 🐘",
  "Dolphin ঘুমের সময়ও একটা চোখ খোলা রাখে! 🐬",
  "মানুষের হাতের আঙুলের ছাপ তার জিহ্বার মতোই unique! 👆",
  "একটি শামুক ১ ঘণ্টায় মাত্র ৫০ মিটার যেতে পারে! 🐢",
  "Hummingbird পৃথিবীর একমাত্র পাখি যে পিছনে উড়তে পারে! 🦜",
  "মহাকাশে কান্নার অশ্রু পড়ে না, শূন্যে ভাসতে থাকে! 🚀",
  "বাঘের চামড়ায় ডোরাকাটা দাগ আছে, ভেতরের চামড়াতেও! 🐯",
  "পৃথিবীর সব মানুষ একসাথে দাঁড়ালে মাত্র ৩.৫ বর্গ কিলোমিটার জায়গা লাগবে! 🌍"
];

module.exports = {
  config: {
    name: "fact",
    aliases: ["facts", "funfact", "rf"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Random interesting fact দেখাও",
    longDescription: "প্রতিদিনের জন্য মজার তথ্য — Bangla ও English",
    category: "fun",
    guide: "{pn} [bn | en | science | tech | animal]",
  },

  onStart: async function ({ args, message }) {
    const cat = (args[0] || "").toLowerCase();

    let fact = "";

    try {
      if (!cat || cat === "en") {
        const res = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en", { timeout: 8000 });
        fact = res.data?.text || "";
      } else if (cat === "bn") {
        fact = LOCAL_FACTS[Math.floor(Math.random() * LOCAL_FACTS.length)];
      } else {
        const res = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en", { timeout: 8000 });
        fact = res.data?.text || "";
      }
    } catch {
      fact = LOCAL_FACTS[Math.floor(Math.random() * LOCAL_FACTS.length)];
    }

    if (!fact) fact = LOCAL_FACTS[Math.floor(Math.random() * LOCAL_FACTS.length)];

    return message.reply(
      `💡 𝗥𝗮𝗻𝗱𝗼𝗺 𝗙𝗮𝗰𝘁\n` +
      `━━━━━━━━━━━━━━━━━\n\n` +
      `${fact}\n\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `💬 আরেকটা দেখতে: .fact\n` +
      `🇧🇩 বাংলায়: .fact bn\n\n` +
      `👻 Ghost Bot — ${GHOST.ownerName}`
    );
  }
};
