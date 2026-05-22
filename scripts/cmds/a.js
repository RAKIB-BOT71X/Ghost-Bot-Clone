module.exports = {
  config: {
    name: "a",
    version: "2.5",
    author: "Rakib Islam",
    countDown: 0,
    role: 0,
    shortDescription: "Reply to a message with .text to tag someone",
    category: "fun",
    guide: "{pn} reply to someone with .text"
  },

  // বটের মেইন লোড রিকোয়ারমেন্ট - অনস্টার্ট ফাংশন
  onStart: async function ({ api, event, args, message }) {
    return message.reply("💡 এই কমান্ডটির নাম টাইপ করতে হবে না। যেকোনো গ্রুপ চ্যাটে কারো মেসেজে Reply দিয়ে শুধু ডট (.) এবং আপনার টেক্সটটি লিখুন (যেমন: .hamker mc)!");
  }
};

// বটের গ্লোবাল মেসেজ লিসেনার যা আপনার বটের কোর ইঞ্জিন সরাসরি হ্যান্ডেল করবে
module.exports.onChat = async function ({ api, event, message }) {
  const { type, messageReply, body, threadID, messageID } = event;

  // ১. চেক: মেসেজটি অবশ্যই কোনো মেসেজের 'Reply' হতে হবে এবং বডিতে টেক্সট থাকতে হবে
  if (type !== "message_reply" || !body) return;

  const input = body.trim();

  // ২. চেক: মেসেজটি ডট (.) দিয়ে শুরু হয়েছে কিনা
  if (input.startsWith(".")) {
    
    // ডট (.) বাদে পুরো টেক্সটটিকে আলাদা করা (যেমন: ".hamker mc" হয়ে যাবে "hamker mc")
    const textToSend = input.substring(1).trim();

    // যদি ইউজার শুধু একটা ডট (.) দিয়ে রিপ্লাই দেয়, তবে অ্যাকশন হবে না
    if (!textToSend) return;

    const targetID = messageReply.senderID; // যার মেসেজে রিপ্লাই দেওয়া হয়েছে (ভিকটিমের আইডি)

    try {
      // ৩. চ্যাট স্ক্রিন ফ্রেশ রাখার জন্য আপনার পাঠানো ডট ওয়ালা মেসেজটি সাথে সাথে ডিলিট করা
      try {
        await api.unsendMessage(messageID);
      } catch (e) {
        // বটের গ্রুপে মেসেজ ডিলিট করার পারমিশন না থাকলে এরর স্কিপ করবে
      }

      // ৪. কাস্টম মাস্কিং মেসেজ সরাসরি ফেসবুক সার্ভারে পুশ করা
      return api.sendMessage({
        body: textToSend,
        mentions: [{
          tag: textToSend, // স্ক্রিনে এই লেখাটাই ব্লু কালার ট্যাগ হয়ে দেখাবে
          id: targetID     // ব্যাকগ্রাউন্ডে ভিকটিমের আইডিতে নোটিফিকেশন যাবে
        }]
      }, threadID);

    } catch (err) {
      console.error("Universal Masking Error:", err);
    }
  }
};
