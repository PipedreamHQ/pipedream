const axios = require('axios')
const youtube = {
  type: "app",
  app: "youtube_data_api",
}


module.exports = {
  name: "Youtube - New Videos",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtube,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    async getVideos(pageToken=null) {
      return await axios.get('https://www.googleapis.com/youtube/v3/search', {
        headers: {
          'Authorization' : 'Bearer '+this.youtube.$auth.oauth_access_token
        },
        params: {
          'part' : 'snippet',
          'type' : 'video',
          'forMine' : true,
          'pageToken' : pageToken
        }
      });
    },
  },  

  async run(event) {
  	var videos = [];
    var totalResults = 1;
    var nextPageToken = null;
    var count = 0;
    var results;

    while (count < totalResults) {
      results = await this.getVideos(nextPageToken);
      totalResults = results.data.pageInfo.totalResults;
      nextPageToken = results.data.nextPageToken;
      results.data.items.forEach(function (video) {
        videos.push(video);
        count++;
      });
    }

    let t = this;
    videos.forEach(function (video) {
      t.$emit(video, {
        id: video.id.videoId,
        summary: video.snippet.title,
        ts: Date.now()
      })
    });  
  }  
};

