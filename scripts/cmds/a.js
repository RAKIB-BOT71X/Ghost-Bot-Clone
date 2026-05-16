module.exports = {
  config: {
    name: "a",
    version: "1.0",
    author: "Rakib Islam",
    countDown: 0,
    role: 0,
    description: {
      en: "Reply to someone's message — bot replies to that message mentioning them"
    },
    category: "chat",
    guide: {
      en: [
        "Reply to someone's message with:",
        "{pn} [your text]",
        "",
        "Example: Reply to Ali's message → .a hello bby",
        "Bot will reply to Ali's message with 'hello bby'",
        "Clicking on bot reply takes you to Ali's profile"
      ].join("\n")
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { messageReply, senderID, threadID, messageID } = event;

    if (!messageReply) {
      return message.reply(
        "❌ কারো message এ reply দিয়ে লিখুন:\n.a [text]\n\nExample: কারো message এ reply দিন → .a hello bby"
      );
    }

    const text = args.join(" ").trim();
    if (!text) {
      return message.reply("❌ কিছু লিখুন!\nExample: .a hello bby");
    }

    const targetID = messageReply.senderID;
    if (!targetID) return message.reply("❌ Target user খুঁজে পাওয়া যায়নি।");

    let targetName = "User";
    try {
      const info = await api.getUserInfo(targetID);
      targetName = info[targetID]?.name || "User";
    } catch {}

    await api.sendMessage(
      {
        body: text,
        mentions: [{ tag: `@${targetName}`, id: targetID }]
      },
      threadID,
      undefined,
      messageReply.messageID
    );
  }
};
