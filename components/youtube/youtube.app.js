module.exports = {
	type: "app",
	app: "youtube_data_api",
	methods: {
		async getVideos(pageToken = null) {
			return await axios.get(
				"https://www.googleapis.com/youtube/v3/search",
				{
					headers: {
						Authorization: `Bearer ${this.$auth.oauth_access_token}`,
					},
					params: {
						part: "snippet",
						type: "video",
						forMine: true,
						pageToken,
					},
				}
			);
		},
	},
};
