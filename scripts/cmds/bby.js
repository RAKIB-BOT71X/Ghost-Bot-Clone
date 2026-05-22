// Bangla-English Simi Bot for GoatBot
// Author: Rakib Islam
// Hosted on Replit — full lifetime use

const axios = require("axios");

// ===== REPLIT API URL =====
// After publishing on Replit, replace the domain below with your .replit.app domain
// Example: https://your-project.replit.app/api
// For now using the dev domain — change to production domain after publishing
const SIMI_API ="https://bangla-simi-bot--dxfrrrr.replit.app/api"; process.env.SIMI_API_URL || "https://7b44ba18-dc76-4943-b241-4b903b196b91-00-2bkd4n330lr73.sisko.replit.dev/api";

const triggerWords = [
  "baby", "bby", "babu", "bbu", "jan", "janu", "bot",
  "জান", "জানু", "বেবি", "wifey", "hina", "hinata",
];

const randomGreetings = [
  "Bolo baby 😊",
  "I love you 💕",
  "আমি তোমাকে ভালোবাসি 🥺",
  "কি বলবা বলো 😊",
  "হ্যাঁ বলো, শুনছি 🌸",
  "Hmm? কিছু বলবা? 🤔",
  "আরে ডাকলে কেন? 😅",
  "কি হয়েছে? সব ঠিক আছে? 💙",
  "Hehe, ki bolbe? 😄",
  "আমি এখানে আছি 🤗",
  "বলো কি মনে পড়লো আমার? 🙈",
  "Ki chai tumi? 😏",
  "আরে বাবা, ডাকলে কেন এত? 😂",
  "Hmm, shunchi tomar kotha 👂",
  "কথা বলো, চুপ থাকলে কেমনে বুঝবো? 😅",
  "তোমার কথা শুনতে ভালো লাগে 😊",
  "Ar dakas na, busy achi 😒",
  "কি খাইলা আজকে? 🍽️",
  "ভালো আছো তো? 💚",
  "Tomar sate thakte chai ami 💕",
  "babu khuda lagse 🥺",
  "Hop beda 😾, Boss বল boss 😼",
  "আমাকে ডাকলে, আমি কিন্তু কিস করে দেবো 😘",
  "গোলাপ ফুলের জায়গায় আমি দিলাম তোমায় মেসেজ 🌹",
  "বলো কি বলবা, সবার সামনে বলবা নাকি? 🤭🤏",
  "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝐮__ 😘😘",
  "Bby bolba pap hoibo 😒😒",
  "বেশি bby করলে leave নিবো কিন্তু 😒😒",
  "বেশি বেবি বললে কামুর দিমু 🤭🤭",
  "আমাকে ডেকো না, আমি ব্যাস্ত আসি 🙆🏻‍♀",
  "Hey Handsome বলো 😁😁",
  "আরে Bolo আমার জান, কেমন আসো? 😚",
  "একটা BF খুঁজে দাও 😿",
  "oi mama ar dakis na pilis 😿",
  "amr JaNu lagbe, Tumi ki single aso?",
  "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
  "তোর বিয়ে হয় নি, Bby হইলো কিভাবে? 🙄",
  "চৌধুরী সাহেব আমি গরিব হতে পারি 😾🤭 কিন্তু বড়লোক না 🥹😫",
  "আমি অন্যের জিনিসের সাথে কথা বলি না 😏",
  "ভুলে জাও আমাকে 😞😞",
  "দেখা হলে কাঠগোলাপ দিও 🤗",
  "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
  "বলো কি করতে পারি তোমার জন্য 😚",
  "কথা দেও আমাকে পটাবা...!! 😌",
  "বার বার Disturb করেছিস, আমার জানুর সাথে ব্যাস্ত আসি 😋",
  "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
  "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
  "আজকে আমার মন ভালো নেই 🙉",
  "মন সুন্দর বানাও মুখের জন্য তো Snapchat আছেই! 🌚",
  "Assalamualaikum 🐤🐤",
  "আমি তোমার সিনিয়র আপু ওকে 😼 সম্মান দেও 🙁",
  "খাওয়া দাওয়া করসো? 🙄",
  "এত কাছেও এসো না, প্রেমে পরে যাবো তো 🙈",
];

async function getSimiResponse(text) {
  try {
    const res = await axios.post(`${SIMI_API}/simi/chat`, { text }, { timeout: 8000 });
    return res.data.message || randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
  } catch {
    return randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
  }
}

module.exports.config = {
  name: "bby",
  aliases: ["baby", "bbu", "jan", "janu", "wifey", "bot", "hinata", "hina", "babu"],
  version: "2.0",
  author: "Rakib Islam",
  countDown: 0,
  role: 0,
  description: "Bangla-English Simi bot — teach it, chat with it, use it in GC!",
  category: "chat",
  guide: {
    en:
      "{pn} [message] — chat with bot\n" +
      "{pn} teach [question] - [reply1, reply2, ...] — teach bot\n" +
      "{pn} list — all taught triggers\n" +
      "{pn} list [question] — replies for a trigger\n" +
      "{pn} remove [question] - [index] — remove a reply\n" +
      "{pn} edit [question] - [index] - [new reply] — edit a reply\n" +
      "{pn} teachers — top teacher leaderboard",
  },
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const uid = event.senderID;
  const msg = args.join(" ").toLowerCase().trim();

  try {
    if (!args[0]) {
      const reply = randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
      return api.sendMessage(reply, event.threadID, event.messageID);
    }

    // ── TEACH ─────────────────────────────────────────────────────────────
    if (args[0] === "teach") {
      const rest = args.slice(1).join(" ");
      const dashIdx = rest.indexOf(" - ");
      if (dashIdx === -1)
        return api.sendMessage(
          "❌ Format: bby teach [question] - [reply1, reply2, ...]",
          event.threadID,
          event.messageID
        );

      const trigger = rest.slice(0, dashIdx).trim();
      const responses = rest.slice(dashIdx + 3).trim();
      if (!trigger || !responses)
        return api.sendMessage(
          "❌ Format: bby teach [question] - [reply1, reply2, ...]",
          event.threadID,
          event.messageID
        );

      const userName = (await usersData.getName(uid)) || "Unknown";
      const res = await axios.post(`${SIMI_API}/simi/teach`, {
        trigger,
        responses,
        userID: uid,
        userName,
      }, { timeout: 8000 });
      return api.sendMessage(
        `${res.data.message}\n• 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: "${trigger}"\n• 𝗧𝗲𝗮𝗰𝗵𝗲𝗿: ${userName}\n• 𝗧𝗼𝘁𝗮𝗹 𝗿𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.count}`,
        event.threadID,
        event.messageID
      );
    }

    // ── LIST ──────────────────────────────────────────────────────────────
    if (args[0] === "list") {
      const trigger = args.slice(1).join(" ").trim();
      const url = trigger
        ? `${SIMI_API}/simi/list?trigger=${encodeURIComponent(trigger)}`
        : `${SIMI_API}/simi/list`;
      const res = await axios.get(url, { timeout: 8000 });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // ── TEACHERS ──────────────────────────────────────────────────────────
    if (args[0] === "teachers" || args[0] === "teacher") {
      const res = await axios.get(`${SIMI_API}/simi/teachers`, { timeout: 8000 });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // ── REMOVE ────────────────────────────────────────────────────────────
    if (args[0] === "remove" || args[0] === "rm") {
      const rest = args.slice(1).join(" ");
      const dashIdx = rest.indexOf(" - ");
      if (dashIdx === -1)
        return api.sendMessage(
          "❌ Format: bby remove [question] - [index]",
          event.threadID,
          event.messageID
        );

      const trigger = rest.slice(0, dashIdx).trim();
      const index = parseInt(rest.slice(dashIdx + 3).trim(), 10);
      if (!trigger || isNaN(index))
        return api.sendMessage(
          "❌ Format: bby remove [question] - [index]",
          event.threadID,
          event.messageID
        );

      const res = await axios.delete(`${SIMI_API}/simi/remove`, {
        data: { trigger, index },
        timeout: 8000,
      });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // ── EDIT ──────────────────────────────────────────────────────────────
    if (args[0] === "edit") {
      const rest = args.slice(1).join(" ");
      const parts = rest.split(" - ");
      if (parts.length < 3)
        return api.sendMessage(
          "❌ Format: bby edit [question] - [index] - [new reply]",
          event.threadID,
          event.messageID
        );

      const trigger = parts[0].trim();
      const index = parseInt(parts[1].trim(), 10);
      const newResponse = parts.slice(2).join(" - ").trim();
      if (!trigger || isNaN(index) || !newResponse)
        return api.sendMessage(
          "❌ Format: bby edit [question] - [index] - [new reply]",
          event.threadID,
          event.messageID
        );

      const res = await axios.put(`${SIMI_API}/simi/edit`, {
        trigger,
        index,
        newResponse,
      }, { timeout: 8000 });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // ── CHAT ──────────────────────────────────────────────────────────────
    const botReply = await getSimiResponse(msg);
    api.sendMessage(botReply, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: uid,
          text: botReply,
        });
      }
    }, event.messageID);

  } catch (err) {
    api.sendMessage(
      `❌ Error: ${err.response?.data?.error || err.message}`,
      event.threadID,
      event.messageID
    );
  }
};

module.exports.onReply = async ({ api, event }) => {
  if (event.type !== "message_reply") return;
  try {
    const text = (event.body || "").toLowerCase().trim() || "হ্যালো";
    const botReply = await getSimiResponse(text);
    api.sendMessage(botReply, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          text: botReply,
        });
      }
    }, event.messageID);
  } catch (err) {
    // silent fail on reply errors
  }
};

module.exports.onChat = async ({ api, event }) => {
  try {
    const message = (event.body || "").toLowerCase().trim();
    if (!message) return;
    if (event.type === "message_reply") return;

    const triggered = triggerWords.some((w) => message.startsWith(w));
    if (!triggered) return;

    api.setMessageReaction("🪽", event.messageID, () => {}, true);

    // Strip the trigger word from the start
    let userText = message;
    for (const prefix of triggerWords) {
      if (message.startsWith(prefix)) {
        userText = message.slice(prefix.length).trim();
        break;
      }
    }

    // If no text after trigger word — send random greeting
    if (!userText) {
      const greeting = randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
      api.sendMessage(greeting, event.threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            text: greeting,
          });
        }
      }, event.messageID);
      return;
    }

    const botReply = await getSimiResponse(userText);
    api.sendMessage(botReply, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          text: botReply,
        });
      }
    }, event.messageID);
  } catch (err) {
    // silent fail on chat trigger errors
  }
};
