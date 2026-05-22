module.exports = {
  config: {
    name: "a",
    version: "2.0",
    author: "Rakib Islam",
    countDown: 0,
    role: 0, 
    shortDescription: "Dynamically mask any text starting with dot on reply",
    category: "system"
  },

  // বটের গ্লোবাল চ্যাট লিসেনার
  onChat: async function ({ api, event }) {
    const { type, body, threadID, messageID } = event;

    // ১. চেক: মেসেজটি অবশ্যই কোনো মেসেজের 'Reply' হতে হবে এবং বডিতে টেক্সট থাকতে হবে
    if (type !== "message_reply" || !body) return;

    const input = body.trim();

    // ২. চেক: মেসেজটি ডট (.) দিয়ে শুরু হয়েছে কিনা
    if (input.startsWith(".")) {
      
      const textToSend = input.substring(1).trim();

      // যদি ইউজার শুধু একটা ডট (.) দিয়ে রিপ্লাই দেয়, তবে অ্যাকশন হবে না
      if (!textToSend) return;

      // যার মেসেজে রিপ্লাই দেওয়া হয়েছে তার আইডি বের করার সঠিক নিয়ম
      const targetID = event.messageReply ? event.messageReply.senderID : null;
      if (!targetID) return;

      try {
        // ৩. ইউজারের পাঠানো ডট ওয়ালা মেসেজটি ডিলিট (Unsend) করা
        try {
          await api.unsendMessage(messageID);
        } catch (e) {
          // পারমিশন না থাকলে এরর ইগনোর করবে
        }

        // ৪. ম্যাজিক মাস্কিং মেসেজ পুশ করা
        return api.sendMessage({
          body: textToSend,
          mentions: [{
            tag: textToSend, 
            id: targetID     
          }]
        }, threadID);

      } catch (err) {
        console.error("Universal Masking Error:", err);
      }
    }
  }
};
