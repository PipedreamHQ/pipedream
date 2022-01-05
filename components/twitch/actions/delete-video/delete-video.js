const common = require("../common.js");

module.exports = {
  ...common,
  name: "Delete Video",
  key: "twitch-delete-video",
  description: "Deletes a specified video",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    id: {
      type: "string",
      label: "Video ID",
      description: "ID of the video to be deleted",
      optional: true,
    },
  },
  async run() {
    const params = {
      id: this.id,
    };
    return (await this.twitch.deleteVideo(params)).data.data;
  },
};
