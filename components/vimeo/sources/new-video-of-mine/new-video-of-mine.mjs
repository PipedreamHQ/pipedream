import vimeo from "../../vimeo.app.mjs";

export default {
  key: "vimeo-new-video-of-mine",
  name: "New Video of Mine",
  description: "Emits a new event when the user adds a new video. [See the Vimeo documentation](https://developer.vimeo.com/api/guide/videos)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    vimeo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    videoName: {
      propDefinition: [
        vimeo,
        "videoName",
      ],
    },
    category: {
      propDefinition: [
        vimeo,
        "category",
      ],
    },
    description: {
      propDefinition: [
        vimeo,
        "description",
      ],
    },
    videoFile: {
      propDefinition: [
        vimeo,
        "videoFile",
      ],
    },
    videoId: {
      propDefinition: [
        vimeo,
        "videoId",
      ],
    },
    albumId: {
      propDefinition: [
        vimeo,
        "albumId",
      ],
    },
  },
  methods: {
    generateMeta(video) {
      return {
        id: video.uri,
        summary: video.name,
        ts: Date.parse(video.created_time),
      };
    },
  },
  async run() {
    const videoDetails = {
      name: this.videoName,
      description: this.description,
      category: this.category,
    };
    const videoFile = this.videoFile;
    const videoId = this.videoId;
    const albumId = this.albumId;

    // Upload the video
    const uploadResult = await this.vimeo.uploadVideo(videoFile);
    if (uploadResult.status !== "complete") {
      console.log("Video upload failed");
      return;
    }

    // Add video details
    const addVideoResult = await this.vimeo.addVideo(videoDetails);
    if (!addVideoResult) {
      console.log("Failed to add video details");
      return;
    }

    // Add the video to the album
    const addToAlbumResult = await this.vimeo.addVideoToAlbum(videoId, albumId);
    if (!addToAlbumResult) {
      console.log("Failed to add video to album");
      return;
    }

    // Emit the event
    const video = await this.vimeo._makeRequest({
      path: `/videos/${videoId}`,
    });
    const meta = this.generateMeta(video);
    this.$emit(video, meta);
  },
};
