const axios = require("axios");
const GHOST = require("fs-extra").readJsonSync(require("path").join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "fbcover2",
    aliases: ["cover2", "botcover", "ghostcover"],
    version: "2.0", author: "Rakib Islam",
    countDown: 10, role: 0,
    shortDescription: "Ghost Net themed FB cover photo 🖼️",
    category: "utility", guide: { en: "{pn} [text]" }
  },
  onStart: async function ({ message, event, args, usersData }) {
    await message.reaction("⏳", event.messageID);
    const uid = event.senderID;
    const name = args.length > 0 ? args.join(" ") : (await usersData.get(uid))?.name || GHOST.ownerName;
    const coverApis = [
      `https://xsaim8x-xxx-api.onrender.com/api/cover?name=${encodeURIComponent(name)}&uid=${uid}`,
      `https://api.popcat.xyz/imgwrap?img=https%3A%2F%2Fgraph.facebook.com%2F${uid}%2Fpicture%3Fwidth%3D512&text=${encodeURIComponent(name)}`,
    ];
    for (const apiUrl of coverApis) {
      try {
        const res = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 15000 });
        const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
        await message.reaction("✅", event.messageID);
        return message.reply({
          body: `🖼️ Ghost Net FB Cover\n👤 Name: ${name}\n\nBy Rakib Islam | Ghost Net 👻`,
          attachment: st
        });
      } catch {}
    }
    await message.reaction("❌", event.messageID);
    return message.reply(`❌ Cover generation failed! Try again later.\n👻 Ghost Net`);
  }
};
