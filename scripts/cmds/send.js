// Advanced Media Forwarder & Broadcast Command for GoatBot
// Author: Rakib Islam (ACS RAKIB)
// Features: Forward Audio/Video via Reply to specific GC or All GCs (.send / .send all)

const { getStreamsFromAttachment } = global.utils;
const allowedMedia = ["photo", "png", "animated_image", "video", "audio"];

module.exports = {
	config: {
		name: "send",
		aliases: ["forward", "fwd", "share"],
		version: "2.0.0",
		author: "Rakib Islam",
		countDown: 5,
		role: 0, // কোড লেভেলে ০ রাখা হয়েছে কাস্টম সিকিউরিটি ফিল্টারের জন্য
		shortDescription: "Forward audio/video to specific or all groups via reply",
		longDescription: "Reply to any video, audio, or image with '.send' to choose a specific group or '.send all' to broadcast to all groups.",
		category: "admin",
		guide: {
			en: "Reply to media with: {p}{n} OR {p}{n} all",
		},
	},

	onStart: async function ({ api, event, args, message }) {
		const { adminBot } = global.config;
		const { senderID, threadID, messageReply } = event;

		// 🔒 কঠোর নিরাপত্তা চেক: শুধুমাত্র বট এডমিন বা ওনাররা এটি ব্যবহার করতে পারবে
		if (!adminBot.includes(senderID)) {
			return message.reply("❌ এই কমান্ডটি শুধুমাত্র বটের নিজস্ব এডমিন বা ওনারদের জন্য সংরক্ষিত!");
		}

		// 📎 মিডিয়া ফাইল চেক করা হচ্ছে (ছবি, ভিডিও, অডিও বা ভয়েস)
		if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
			return message.reply("❌ দয়া করে কোনো ভিডিও, অডিও, ভয়েস নোট বা ছবির ওপর রিপ্লাই দিয়ে এই কমান্ডটি ব্যবহার করুন!");
		}

		// ফিল্টার করে সঠিক মিডিয়া ফাইল আলাদা করা হচ্ছে
		const validAttachments = messageReply.attachments.filter(item => allowedMedia.includes(item.type));
		if (validAttachments.length === 0) {
			return message.reply("❌ দুঃখিত! এই ফাইল ফরম্যাটটি সাপোর্ট করে না। শুধুমাত্র ভিডিও, অডিও বা পিকচারে রিপ্লাই দিন।");
		}

		try {
			// ইনবক্স থেকে বটের সর্বোচ্চ ৩০টি মেসেজ থ্রেড বা জিসি লিস্ট আনা হচ্ছে
			const groupList = await api.getThreadList(30, null, ['INBOX']);
			const filteredList = groupList.filter(group => group.isGroup === true || group.isSubscribed === true);

			if (filteredList.length === 0) {
				return message.reply("❌ বটের ইনবক্সে কোনো সক্রিয় গ্রুপ চ্যাট পাওয়া যায়নি।");
			}

			// 🚀 কন্ডিশন ১: যদি ইউজার `.send all` লেখে (সব গ্রুপে একসাথে পাঠানো)
			if (args[0] && args[0].toLowerCase() === "all") {
				await message.reply(`📢 বটের সব গ্রুপে (${filteredList.length} টি) মিডিয়া ফাইলটি পাঠানো শুরু হচ্ছে...`);
				
				const attachmentsStream = await getStreamsFromAttachment(validAttachments);
				let successCount = 0;

				for (const group of filteredList) {
					try {
						await api.sendMessage({
							body: `==📢 𝐀𝐃𝐌𝐈𝐍 𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓 📢==\n───────────────────\n👉 বটের প্রধান এডমিন কর্তৃক এই মিডিয়া ফাইলটি পাঠানো হয়েছে।`,
							attachment: attachmentsStream
						}, group.threadID);
						successCount++;
					} catch (err) {
						console.error(`Failed to send broadcast to TID: ${group.threadID}`, err);
					}
				}
				return message.reply(`✅ ব্রডকাস্ট সম্পন্ন হয়েছে!\n\n📊 সফলভাবে ${successCount} টি গ্রুপে ফাইলটি পাঠানো হয়েছে।`);
			}

			// 🚀 কন্ডিশন ২: শুধু `.send` লিখলে (গ্রুপের লিস্ট দেখাবে)
			await message.reply('⏳ সক্রিয় গ্রুপ চ্যাটগুলোর লিস্ট তৈরি হচ্ছে, দয়া করে একটু অপেক্ষা করুন...');

			const formattedList = [];
			let index = 1;

			for (const group of filteredList) {
				let gName = group.threadName;
				if (!gName || gName === "null" || gName === "undefined" || gName.trim() === "") {
					try {
						const tInfo = await api.getThreadInfo(group.threadID);
						gName = tInfo.threadName || `Unnamed Group Chat (${group.threadID})`;
					} catch(e) {
						gName = `Group Chat (${group.threadID})`;
					}
				}
				formattedList.push(`│${index}. 👥 ${gName}\n│𝐓𝐈𝐃: ${group.threadID}\n│`);
				index++;
			}

			const messageContent = `╭───⚙️ 𝐒𝐄𝐍𝐃 𝐌𝐄𝐃𝐈𝐀 𝐓𝐀𝐑𝐆𝐄𝐓 ⚙️───╮\n│\n${formattedList.join("\n")}\n╰──────────────────────ꔪ\n\n👉 এই লিস্টের মেসেজটিতে ঐ গ্রুপের সিরিয়াল নাম্বার (Example: 1) দিয়ে রিপ্লাই দিন, বট সরাসরি ওই জিসিতে ফাইলটি ফরওয়ার্ড করে দেবে!`;

			const sentMessage = await api.sendMessage(messageContent, threadID);
			
			// রিপ্লাই হ্যান্ডেল করার জন্য ডাটা মেমোরিতে সেভ
			global.GoatBot.onReply.set(sentMessage.messageID, {
				commandName: 'send',
				messageID: sentMessage.messageID,
				author: senderID,
				validAttachments: validAttachments,
				groupsData: filteredList
			});

		} catch (error) {
			console.error("Error on send media command:", error);
			message.reply("❌ কমান্ডটি রান করার সময় একটি ইন্টারনাল এরর হয়েছে।");
		}
	},

	onReply: async function ({ api, event, Reply, args, message }) {
		const { author, groupsData, validAttachments } = Reply;

		// সিকিউরিটি চেক: যে এডমিন কমান্ড দিয়েছে সে ছাড়া অন্য কেউ রিপ্লাই দিলে কাজ করবে না
		if (event.senderID !== author) return;

		const groupIndex = parseInt(args[0], 10);

		// ইনপুট বা নাম্বার ভ্যালিডেশন চেক
		if (isNaN(groupIndex) || groupIndex <= 0 || groupIndex > groupsData.length) {
			return message.reply('❌ ভুল নাম্বার! দয়া করে লিস্টে থাকা সঠিক সিরিয়াল নাম্বার দিয়ে রিপ্লাই দিন।');
		}

		try {
			const selectedGroup = groupsData[groupIndex - 1];
			const groupID = selectedGroup.threadID;

			let finalName = selectedGroup.threadName;
			try {
				const tInfo = await api.getThreadInfo(groupID);
				finalName = tInfo.threadName || `Group (${groupID})`;
			} catch(e) {
				finalName = finalName || `Group (${groupID})`;
			}

			await message.reply(`⏳ "${finalName}" গ্রুপে মিডিয়া ফাইলটি পাঠানো হচ্ছে...`);

			// অ্যাটাচমেন্টের স্ট্রিম তৈরি করে পাঠানো হচ্ছে
			const attachmentsStream = await getStreamsFromAttachment(validAttachments);
			
			await api.sendMessage({
				body: `==📨 𝐅𝐎𝐑𝐖𝐀𝐑𝐃𝐄𝐃 𝐌𝐄𝐃𝐈𝐀 📨==\n───────────────────\n👉 বটের প্রধান এডমিন আপনার গ্রুপের জন্য এই ফাইলটি ফরওয়ার্ড করেছেন।`,
				attachment: attachmentsStream
			}, groupID);

			// আপনার নিজের চ্যাটে সাকসেস মেসেজ দেবে
			message.reply(`✅ সফলভাবে মিডিয়া ফাইলটি পাঠানো হয়েছে!\n\n👥 গ্রুপের নাম: ${finalName}\n🆔 থ্রেড আইডি (TID): ${groupID}`);

		} catch (error) {
			console.error("Error forwarding media via reply:", error);
			message.reply("❌ দুঃখিত, ফাইলটি ওই গ্রুপে পাঠানো সম্ভব হয়নি। হয়তো বটের পারমিশন নেই।");
		} finally {
			// মেমোরি ক্লিয়ার করা
			global.GoatBot.onReply.delete(event.messageID);
		}
	}
};
