const axios = require("axios");
const GIFS = [
  "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif",
  "https://media.tenor.com/svLMd5r2KRYAAAAC/neon-light.gif",
];
module.exports = {
  config: {
    name: "hack4",
    aliases: ["ghosthack4", "cyberhack4"],
    version: "1.0", author: "Rakib Islam",
    countDown: 10, role: 0,
    shortDescription: "Fake hack animation v4 - fun only!",
    category: "fun", guide: { en: "{pn} @mention" }
  },
  onStart: async function ({ api, event, message, usersData }) {
    const { mentions, senderID, messageReply, threadID } = event;
    const targetID = Object.keys(mentions || {})[0] || messageReply?.senderID || senderID;
    let targetName = "Unknown";
    try { targetName = await usersData.getName(targetID) || "Unknown"; } catch {}
    const ip = Array.from({length:4}, () => Math.floor(Math.random() * 255)).join(".");
    const devices = ["Android 14", "iPhone 15 Pro", "Windows 11", "Kali Linux"];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const step1 = "Hack v4: Target: " + targetName + "\nScanning...";
    const step2 = "Hack v4: " + targetName + "\nIP: " + ip + "\nDevice: " + device + "\nBypassing...";
    const step3 = "Hack v4: ACCESS GRANTED!\nTarget: " + targetName + "\nIP: " + ip + "\nDevice: " + device + "\n\nJUST FOR FUN! Ghost Net";
    const sent = await api.sendMessage(step1, threadID);
    await new Promise(r => setTimeout(r, 2000));
    try { await api.editMessage(step2, sent.messageID); } catch {}
    await new Promise(r => setTimeout(r, 2500));
    try { await api.editMessage(step3, sent.messageID); } catch {}
    const gif = GIFS[4 % GIFS.length];
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const st = new PassThrough(); st.end(Buffer.from(res.data));
      await api.sendMessage({ body: "Hack Complete! Ghost Net v4", attachment: st }, threadID);
    } catch {}
  }
};