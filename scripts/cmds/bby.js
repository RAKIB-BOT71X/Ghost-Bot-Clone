const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const BASE_API = "https://noobs-api.top/dipto";
const LOCAL_QA_PATH = path.join(__dirname, "bbyLocalQA.json");
const SETTINGS_PATH = path.join(process.cwd(), "data", "ghostSettings.json");

function loadSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) return {};
  try { return fs.readJsonSync(SETTINGS_PATH); } catch { return {}; }
}

const DEFAULT_QA = {
  "hello": ["Hello! 😊 Ki khobor?", "Hey! 👋 Kemon acho?", "Hi! Ami Ewr Hinata, tomar khadem! 😄"],
  "hi": ["Hi! 👋 Kemon acho?", "Hello! 😊 Bolo ki dorkar!"],
  "how are you": ["Ami valo achi! 💚 Tumi kemon?", "Ekdom jhakkas! 😎 Ki khobor?"],
  "kemon acho": ["Ami valo achi! 😊 Tumi kemon?", "Ekdom mast! 🔥"],
  "good morning": ["Good morning! ☀️ Sundor din katao!", "Morning! 🌞 Aj onek valo din hobe!"],
  "good night": ["Good night! 🌙 Valo ghum hok!", "Sweet dreams! 😴✨"],
  "bye": ["Bye bye! 👋😊 Valo theko!", "Alvida! 🌸 Take care!"],
  "thanks": ["Welcome! 😊💚", "No problem! 🤙"],
  "love you": ["Aww! Love you too! ❤️😊", "Tumi onek sundor bolo! 💖"],
  "who are you": ["Ami Ewr Hinata! 🌸 Rakib Islam er toiri AI bot!", "Ghost Bot — Messenger er best bot! 💪🔥"],
  "who made you": ["Rakib Islam amare toiri koreche! 👑😊", "Amar creator: Rakib Islam — Ghost Net admin!"],
  "rakib": ["Haa! Rakib Islam amar boss! 👑😊", "Rakib Islam amar creator! 🔥"],
  "ewr hinata": ["Ji! Ami Ewr Hinata! 🌸😊 Ki kora lagbe?", "Ewr Hinata — Messenger er best bot! 💪"],
  "ghost bot": ["Ji! Ami Ewr Hinata (Ghost Bot)! 👻😊", "Ghost Bot — tomar khadem! 🔥"],
  "ok": ["Ok! 👍", "Thik ache! ✅"],
  "help": ["Ki help korbo? Bolo! 😊", "Ki dorkar? Ami achi! 💚"],
  "sad": ["Dukhkhito hona! 🥺💚 Ki hoise?", "Sad keno? Bolo, ami achi! 😊"],
  "happy": ["Yay! 🎉😊 Khushi thako!", "Happy thako shobkhon! 💚✨"],
  "name": ["Amar name Ewr Hinata! 🌸", "Ami Ewr Hinata, tomar khadem! 😊"],
};

function loadLocalQA() {
  if (!fs.existsSync(LOCAL_QA_PATH)) { fs.writeJsonSync(LOCAL_QA_PATH, DEFAULT_QA, { spaces: 2 }); }
  const stored = fs.readJsonSync(LOCAL_QA_PATH);
  return { ...DEFAULT_QA, ...stored };
}
function saveLocalQA(data) {
  const current = fs.existsSync(LOCAL_QA_PATH) ? fs.readJsonSync(LOCAL_QA_PATH) : {};
  fs.writeJsonSync(LOCAL_QA_PATH, { ...current, ...data }, { spaces: 2 });
}
function getLocalReply(text) {
  const qa = loadLocalQA();
  const t = text.toLowerCase().trim();
  if (qa[t]) { const arr = qa[t]; return arr[Math.floor(Math.random() * arr.length)]; }
  for (const key of Object.keys(qa)) {
    if (t.includes(key) || key.includes(t)) { const arr = qa[key]; return arr[Math.floor(Math.random() * arr.length)]; }
  }
  return null;
}
async function getApiReply(text, uid) {
  const res = await axios.get(`${BASE_API}/baby?text=${encodeURIComponent(text)}&senderID=${uid}&font=1`, { timeout: 8000 });
  return res.data.reply;
}

module.exports = {
  config: {
    name: "bby",
    aliases: ["bbyhelp", "bbybot", "bbabe", "sam", "hinata", "chat"],
    version: "9.0",
    author: "Rakib Islam",
    countDown: 0, role: 0,
    description: "Ewr Hinata AI Chat — teach, learn, chat with full local Q&A",
    category: "chat",
    guide: {
      en: [
        "{pn} [message] — chat",
        "{pn} on/off — toggle BBY mode (admin)",
        "{pn} teach [msg] - [reply] — teach bot (API)",
        "{pn} localteach [msg] - [reply] — teach bot (local)",
        "{pn} remove [msg] — remove a teach",
        "{pn} list — see stats",
        "{pn} locallist — local Q&A count",
        "{pn} msg [msg] — check replies for msg",
        "{pn} howto — teaching guide",
      ].join("\n")
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID } = event;

    // on/off toggle — admin only
    if (args[0] === "on" || args[0] === "off") {
      const adminBot = global.GoatBot?.config?.adminBot || [];
      const threadData = global.db?.allThreadData?.find(t => t.threadID == threadID);
      const adminIDs = (threadData?.adminIDs || []).map(a => a.adminID || a);
      const isAdmin = adminBot.includes(senderID) || adminIDs.includes(senderID);
      if (!isAdmin) return api.sendMessage("❌ শুধু Admin `.bby on/off` করতে পারবে!", threadID, messageID);
      const s = loadSettings();
      if (!s[threadID]) s[threadID] = {};
      s[threadID].bbyEnabled = args[0] === "on";
      fs.ensureDirSync(path.dirname(SETTINGS_PATH));
      fs.writeJsonSync(SETTINGS_PATH, s, { spaces: 2 });
      return api.sendMessage(
        args[0] === "on"
          ? "✅ BBY Mode ON! 😊\nBot এখন chat reply দেবে!\n🌸 Ewr Hinata"
          : "🔇 BBY Mode OFF!\nBot আর reply দেবে না।\n🌸 Ewr Hinata",
        threadID, messageID
      );
    }

    // BBY enabled check
    try {
      const s = loadSettings();
      if (s[threadID]?.bbyEnabled === false) return;
    } catch {}

    const dipto = args.join(" ").toLowerCase().trim();
    const uid = senderID;

    if (!args[0]) {
      const ran = ["Bolo bby 😊", "Ji bolo!", "Ami achi! 🌸", "Ki korbo?", "Bolo jaan!"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], threadID, messageID);
    }

    if (args[0] === "howto") {
      return api.sendMessage(
        `🌸 Ewr Hinata — BBY Teaching Guide\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📌 TEACH (API):\n.bby teach hello - Hi there!\n\n` +
        `📌 LOCAL TEACH:\n.bby localteach সালাম - ওয়ালাইকুম!\n\n` +
        `📌 REACTION:\n.bby teach react good morning - 🌅,😊\n\n` +
        `📌 REMOVE:\n.bby remove [message]\n\n` +
        `📌 CHECK:\n.bby msg [message]\n.bby list\n.bby locallist\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👑 Owner: Rakib Islam | Ewr Hinata`,
        threadID, messageID
      );
    }

    if (args[0] === "localteach") {
      const [comd, rep] = dipto.replace("localteach ", "").split(/\s*-\s*/);
      if (!comd || !rep) return api.sendMessage("❌ Format: .bby localteach [msg] - [reply1],[reply2]", threadID, messageID);
      const replies = rep.split(",").map(r => r.trim()).filter(r => r);
      const qa = {}; qa[comd.trim()] = replies;
      saveLocalQA(qa);
      return api.sendMessage(`✅ Local Q&A তে শেখানো হয়েছে!\n"${comd.trim()}" → ${replies.join(", ")}`, threadID, messageID);
    }

    if (args[0] === "locallist") {
      const qa = loadLocalQA();
      return api.sendMessage(`📊 Local Q&A: ${Object.keys(qa).length} entries\n.bby localteach দিয়ে আরো শেখাও!`, threadID, messageID);
    }

    if (args[0] === "remove") {
      const fina = dipto.replace("remove ", "");
      try {
        const dat = (await axios.get(`${BASE_API}/baby?remove=${encodeURIComponent(fina)}&senderID=${uid}`, { timeout: 8000 })).data.message;
        return api.sendMessage(dat, threadID, messageID);
      } catch { return api.sendMessage("❌ Remove failed.", threadID, messageID); }
    }

    if (args[0] === "list") {
      try {
        const d = (await axios.get(`${BASE_API}/baby?list=all`, { timeout: 8000 })).data;
        const qa = loadLocalQA();
        return api.sendMessage(`📊 BBY Stats\nAPI Teaches: ${d.length||"offline"}\nLocal Q&A: ${Object.keys(qa).length} entries`, threadID, messageID);
      } catch {
        const qa = loadLocalQA();
        return api.sendMessage(`📊 Local Q&A: ${Object.keys(qa).length} entries (API offline)`, threadID, messageID);
      }
    }

    if (args[0] === "msg") {
      const fuk = dipto.replace("msg ", "");
      try {
        const d = (await axios.get(`${BASE_API}/baby?list=${encodeURIComponent(fuk)}`, { timeout: 8000 })).data.data;
        const local = loadLocalQA()[fuk] ? `\nLocal: ${loadLocalQA()[fuk].join(", ")}` : "";
        return api.sendMessage(`Replies for "${fuk}":\n${d}${local}`, threadID, messageID);
      } catch {
        const local = loadLocalQA()[fuk];
        if (local) return api.sendMessage(`Local: ${local.join(", ")}`, threadID, messageID);
        return api.sendMessage("❌ Not found.", threadID, messageID);
      }
    }

    if (args[0] === "teach" && args[1] !== "react") {
      const [comd, command] = dipto.replace(/^teach\s+/, "").split(/\s*-\s*/);
      if (!command || command.length < 1) return api.sendMessage("❌ Format: .bby teach [msg] - [reply]\n.bby howto", threadID, messageID);
      try {
        const re = await axios.get(`${BASE_API}/baby?teach=${encodeURIComponent(comd.trim())}&reply=${encodeURIComponent(command)}&senderID=${uid}`, { timeout: 8000 });
        return api.sendMessage(`✅ শেখানো হয়েছে!\n"${comd.trim()}" → ${re.data.message}\nTeaches: ${re.data.teachs||"?"}`, threadID, messageID);
      } catch { return api.sendMessage("❌ API failed. Try .bby localteach!", threadID, messageID); }
    }

    if (args[0] === "teach" && args[1] === "react") {
      const [comd, command] = dipto.split(/\s*-\s*/);
      const final = comd.replace("teach react ", "").trim();
      if (!command) return api.sendMessage("❌ .bby teach react [msg] - 😍,😂", threadID, messageID);
      try {
        const tex = (await axios.get(`${BASE_API}/baby?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}`, { timeout: 8000 })).data.message;
        return api.sendMessage(`✅ Reaction শেখানো: ${tex}`, threadID, messageID);
      } catch { return api.sendMessage("❌ React teach failed.", threadID, messageID); }
    }

    const localReply = getLocalReply(dipto);
    if (localReply) {
      return api.sendMessage(localReply, threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, { commandName: "bby", type: "reply", messageID: info.messageID, author: senderID });
      }, messageID);
    }

    try {
      const d = await getApiReply(dipto, uid);
      api.sendMessage(d || "Bolo bby 😊", threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, { commandName: "bby", type: "reply", messageID: info.messageID, author: senderID });
      }, messageID);
    } catch {
      const fallbacks = ["API offline! 😅 Try again!", "Network error! 😊", "Bolo bolo! 🌸"];
      api.sendMessage(fallbacks[Math.floor(Math.random() * fallbacks.length)], threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (api.getCurrentUserID() === event.senderID) return;
    const { threadID, messageID, senderID, body } = event;
    const text = body?.toLowerCase()?.trim() || "";
    const local = getLocalReply(text);
    if (local) {
      return api.sendMessage(local, threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, { commandName: "bby", type: "reply", messageID: info.messageID, author: senderID });
      }, messageID);
    }
    try {
      const a = (await axios.get(`${BASE_API}/baby?text=${encodeURIComponent(text)}&senderID=${senderID}&font=1`, { timeout: 8000 })).data.reply;
      api.sendMessage(a || "😊", threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, { commandName: "bby", type: "reply", messageID: info.messageID, author: senderID });
      }, messageID);
    } catch { api.sendMessage("😊", threadID, messageID); }
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;
    try {
      const s = loadSettings();
      if (s[threadID]?.bbyEnabled === false) return;
    } catch {}
    const text = body.toLowerCase().trim();
    const triggers = ["bby ", "hinata ", "bot ", "jan ", "babu ", "janu "];
    const matched = triggers.find(t => text.startsWith(t));
    if (!matched) return;
    const arr = text.replace(matched, "").trim();
    if (!arr) {
      const ran = ["Ji! 😊", "Bolo!", "Ami achi! 🌸", "Ki korbo?"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, { commandName: "bby", type: "reply", messageID: info.messageID, author: senderID });
      }, messageID);
    }
    const local = getLocalReply(arr);
    if (local) {
      return api.sendMessage(local, threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, { commandName: "bby", type: "reply", messageID: info.messageID, author: senderID });
      }, messageID);
    }
    try {
      const a = (await axios.get(`${BASE_API}/baby?text=${encodeURIComponent(arr)}&senderID=${senderID}&font=1`, { timeout: 8000 })).data.reply;
      api.sendMessage(a || "😊 Bolo!", threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, { commandName: "bby", type: "reply", messageID: info.messageID, author: senderID });
      }, messageID);
    } catch {}
  }
};
