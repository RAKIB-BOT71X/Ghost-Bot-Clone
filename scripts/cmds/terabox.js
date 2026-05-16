const axios = require("axios");

module.exports = {
	config: {
		name: "terabox",
		version: "1.3",
		author: "Rakib Islam",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Tải video từ terabox",
			en: "Download video from terabox"
		},
		longDescription: {
			vi: "Tải video terabox từ terabox (công khai)",
			en: "Download video terabox from terabox (public)"
		},
		category: "media",
		guide: {
			vi: "   {pn} <url video terabox>: tải video từ terabox",
			en: "   {pn} <url video terabox>: download video from terabox"
		}
	},

	langs: {
		vi: {
			missingUrl: "Vui lòng nhập url video terabox (công khai) bạn muốn tải về",
			error: "Đã xảy ra lỗi khi tải video",
			downloading: "Đang tiến hành tải video cho bạn",
			tooLarge: "Rất tiếc không thể tải video cho bạn vì dung lượng lớn hơn 83MB"
		},
		en: {
			missingUrl: "Please enter the terabox video (public) url you want to download",
			error: "An error occurred while downloading the video",
			downloading: "Downloading video for you",
			tooLarge: "Sorry, we can't download the video for you because the size is larger than 83MB"
		}
	},

	onStart: async function ({ args, event, message, getLang }) {
		if (!args[0]) {
			return message.reply(getLang("missingUrl"));
		}

		let msgSend = null;
		try {
			const response = await axios.get(`https://anbusec.xyz/api/downloader/terabox?apikey=jmBOjQSgq5mK8GScw9AB&url=${args[0]}`);

			if (response.data.success === false) {
				return message.reply(getLang("error"));
			}

			msgSend = message.reply(getLang("downloading"));

			const stream = await global.utils.getStreamFromURL(response.data.url);
      const name = response.data.name
      const creator = response.data.creator
      const create_time = response.data.create_time
      const size = response.data.size
      
			await message.reply({ body: `♪♪ 𝐀𝐒𝐈𝐅 𝐱𝟔𝟗 ♪♪\n\nName: ${name}\nCreator: ${creator}\nCreate_Time: ${create_time}\nSize: ${size}`,
        attachment: stream });

			message.unsend((await msgSend),event.messageID);
		}
		catch (e) {
			message.unsend((await msgSend),event.messageID);
			return message.reply(getLang("tooLarge"));
		}
	}
};
