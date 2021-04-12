const common = require("../common.js");

module.exports = {
  ...common,
  key: "youtube-new-videos-in-channel",
  name: "New Videos in Channel",
  description: "Emits an event for each new Youtube video posted to a Channel.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of the channel to search for new videos in.",
    },
  },
  methods: {
    ...common.methods,
    getParams() {
      return {
        channelId: this.channelId,
      };
    },
  },
};