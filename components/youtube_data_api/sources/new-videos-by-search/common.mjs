import common from "../common/common.mjs";

export default {
  ...common,
  hooks: {},
  methods: {
    ...common.methods,
    getParams() {
      return {
        q: this.q,
        maxResults: this.maxResults,
        channelId: this.channelId,
        location: this.location,
        locationRadius: this.locationRadius,
        videoDuration: this.videoDuration,
        videoDefinition: this.videoDefinition,
        videoCaption: this.videoCaption,
        videoLicense: this.videoLicense,
        regionCode: this.regionCode,
        videoCategoryId: this.videoCategoryId,
      };
    },
  },
};
