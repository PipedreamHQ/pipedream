import { axios } from "@pipedreamhq/platform";

export default {
  type: "app",
  app: "vimeo",
  propDefinitions: {
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "The term to search for new videos",
      required: true,
    },
    videoName: {
      type: "string",
      label: "Video Name",
      description: "The name of the new video",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "The category of the new video",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the new video",
      optional: true,
    },
    videoFile: {
      type: "string",
      label: "Video File",
      description: "The video file to upload",
      required: true,
    },
    videoId: {
      type: "string",
      label: "Video ID",
      description: "The ID of the video",
      required: true,
    },
    albumId: {
      type: "string",
      label: "Album ID",
      description: "The ID of the album to add the video to",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.vimeo.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async likeVideo(videoId) {
      return this._makeRequest({
        method: "PUT",
        path: `/me/likes/${videoId}`,
      });
    },
    async searchVideos(searchTerm) {
      return this._makeRequest({
        path: "/videos",
        params: {
          query: searchTerm,
        },
      });
    },
    async addVideo(videoDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/me/videos",
        data: videoDetails,
      });
    },
    async uploadVideo(videoFile) {
      return this._makeRequest({
        method: "POST",
        path: "/me/videos",
        data: {
          upload: {
            approach: "post",
            size: videoFile.size,
          },
        },
      });
    },
    async addVideoToAlbum(videoId, albumId) {
      return this._makeRequest({
        method: "PUT",
        path: `/me/albums/${albumId}/videos/${videoId}`,
      });
    },
    async deleteVideo(videoId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/videos/${videoId}`,
      });
    },
  },
};
