import common from "../common.mjs";

export default {
  ...common,
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
