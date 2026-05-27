// Advanced Group Leave Command for GoatBot
// Author: Rakib Islam (ACS RAKIB)
// Permitted: ONLY Bot Main Owner & Bot Admins (Strictly No Group Admins / No Users)

module.exports = {
	config: {
		name: "allleft",
		aliases: ["leavegc", "outgc"],
		version: "1.7.5",
		author: "Rakib Islam",
		countDown: 5,
		role: 0, // কোড লেভেলে ০ রাখা হলো যেন গ্রুপের এডমিনরা ডিফল্ট পারমিশন না পায়
		shortDescription: "List all groups and leave any group via reply",
		longDescription: "View list of all groups bot is currently in and leave a specific group with a beautiful goodbye message.",
		category: "admin",
		guide: {
			en: "{p}{n}",
		},
	},

	onStart: async function ({ api, event, message }) {
		const { adminBot } = global.config;
		const { senderID, threadID } = event;

		// 🔒 কঠোর নিরাপত্তা চেক: যে কমান্ড দিচ্ছে সে বট এডমিন বা ওনার কি না
		// (GoatBot-এর config.json এর adminBot লিস্টের সাথে চেক করা হচ্ছে)
		if (!adminBot.includes(senderID)) {
			return api.sendMessage("❌ এই কমান্ডটি শুধুমাত্র বটের নিজস্ব এডমিন বা ওনারদের জন্য সংরক্ষিত!", threadID, event.messageID);
		}

		try {
			// ইনবক্স থেকে বটের সর্বোচ্চ ২৫টি মেসেজ থ্রেড বা চ্যাট লিস্ট আনা হচ্ছে
			const groupList = await api.getThreadList(25, null, ['INBOX']);
			
			// শুধুমাত্র গ্রুপ চ্যাটগুলোকে ফিল্টার করা হচ্ছে
			const filteredList = groupList.filter(group => group.isGroup === true || group.isSubscribed === true);

			if (filteredList.length === 0) {
				return api.sendMessage('❌ বটের ইনবক্সে কোনো সক্রিয় গ্রুপ চ্যাট পাওয়া যায়নি।', threadID);
			}

			// লোডিং অ্যালার্ট
			await api.sendMessage('⏳ সক্রিয় গ্রুপ চ্যাটগুলোর লিস্ট লোড হচ্ছে, দয়া করে একটু অপেক্ষা করুন...', threadID);

			const formattedList = [];
			let index = 1;

			// প্রতিটি গ্রুপের রিয়েল নাম ও ডিটেইলস প্রসেস করা হচ্ছে
			for (const group of filteredList) {
				let gName = group.threadName;
				
				// যদি নাম null বা undefined আসে, তবে সার্ভার থেকে রিয়েল নাম আনা হবে
				if (!gName || gName === "null" || gName === "undefined" || gName.trim() === "") {
					try {
						const tInfo = await api.getThreadInfo(group.threadID);
						gName = tInfo.threadName || `Unnamed Group Chat (${group.threadID})`;
					} catch(e) {
						gName = `Group Chat (${group.threadID})`;
					}
				}
				
				formattedList.push(`│${index}. 👥 ${gName}\n│𝐓𝐈𝐃: ${group.threadID}\n│𝐓𝐨𝐭𝐚𝐥 𝐦𝐞𝐦𝐛𝐞𝐫𝐬: ${group.participantIDs ? group.participantIDs.length : 'Unknown'}\n│`);
				index++;
			}

			const messageContent = `╭───⚙️ 𝐁𝐎𝐓 𝐆𝐂 𝐋𝐈𝐒𝐓 ⚙️───╮\n│\n${formattedList.join("\n")}\n╰──────────────────────ꔪ\n\n👉 এই মেসেজটিতে ঐ গ্রুপের সিরিয়াল নাম্বার (Example: 1) দিয়ে রিপ্লাই দিন, বট অটোমেটিক ওই জিসি থেকে লিভ নেবে!`;

			const sentMessage = await api.sendMessage(messageContent, threadID);
			
			// রিপ্লাই হ্যান্ডেল করার জন্য মেমোরিতে ডাটা সেভ এবং কে কমান্ড দিয়েছে তার ID ট্র্যাকিং
			global.GoatBot.onReply.set(sentMessage.messageID, {
				commandName: 'allleft',
				messageID: sentMessage.messageID,
				author: senderID, // যে বট এডমিন কমান্ড স্টার্ট করেছে তার আইডি
				groupsData: filteredList
			});
			
		} catch (error) {
			console.error("Error on allleft command:", error);
			api.sendMessage('❌ গ্রুপ লিস্ট লোড করার সময় একটি ইন্টারনাল এরর হয়েছে।', threadID);
		}
	},

	onReply: async function ({ api, event, Reply, args }) {
		const { author, groupsData } = Reply;

		// সিকিউরিটি চেক: যে নির্দিষ্ট বট এডমিন প্যানেলটি এনেছে, সে ছাড়া আর কেউ রিপ্লাই দিলে কাজ করবে না
		if (event.senderID !== author) return;

		const groupIndex = parseInt(args[0], 10);

		// ইনপুট ভ্যালিডেশন চেক
		if (isNaN(groupIndex) || groupIndex <= 0 || groupIndex > groupsData.length) {
			return api.sendMessage('❌ ভুল নাম্বার! দয়া করে লিস্টে থাকা সঠিক সিরিয়াল নাম্বার দিয়ে রিপ্লাই দিন।', event.threadID, event.messageID);
		}

		try {
			const selectedGroup = groupsData[groupIndex - 1];
			const groupID = selectedGroup.threadID;

			// গ্রুপের নাম কনফার্ম করা
			let finalName = selectedGroup.threadName;
			try {
				const tInfo = await api.getThreadInfo(groupID);
				finalName = tInfo.threadName || `Group (${groupID})`;
			} catch(e) {
				finalName = finalName || `Group (${groupID})`;
			}

			// 🎀 সুন্দর গুডবাই মেসেজ লেআউট
			const goodbyeMsg = `==⚠️ 𝐁𝐎𝐓 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 ⚠️==\n───────────────────\n👋 প্রিয় মেম্বারস, বটের প্রধান এডমিনের নির্দেশ অনুযায়ী এই গ্রুপ চ্যাট থেকে বটটিকে সরিয়ে নেওয়া হচ্ছে।\n\nএতদিন সাথে থাকার জন্য সবাইকে অনেক ধন্যবাদ! ভালো থাকবেন সবাই। গুডবাই! ✨❤️\n───────────────────\n🤖 [Author: ACS RAKIB]`;

			// প্রথমে ওই নির্দিষ্ট গ্রুপে গুডবাই মেসেজ পাঠানো হবে
			await api.sendMessage(goodbyeMsg, groupID);

			// মেসেজ পাঠানোর পর ১.৫ সেকেন্ডের একটা ডিলে (Delay)
			await new Promise(resolve => setTimeout(resolve, 1500));

			// গ্রুপ থেকে লিভ নেওয়ার অফিশিয়াল মেথড
			await api.removeUserFromGroup(api.getCurrentUserID(), groupID);

			// আপনার মেইন চ্যাটে কনফার্মেশন মেসেজ দেবে
			api.sendMessage(`✅ সফলভাবে গ্রুপ থেকে লিভ নেওয়া হয়েছে!\n\n👥 গ্রুপের নাম: ${finalName}\n🆔 থ্রেড আইডি (TID): ${groupID}`, event.threadID, event.messageID);
			
		} catch (error) {
			console.error("Error leaving group chat:", error);
			api.sendMessage('❌ গ্রুপ থেকে লিভ নিতে সমস্যা হয়েছে। হয়তো বটটি অলরেডি ওই গ্রুপে নেই অথবা লিভ নেওয়ার পারমিশন লক করা।', event.threadID, event.messageID);
		} finally {
			// কাজ শেষ হওয়ার পর রিপ্লাই ট্র্যাকিং মেমোরি ফ্লাশ করা
			global.GoatBot.onReply.delete(event.messageID);
		}
	},
};
