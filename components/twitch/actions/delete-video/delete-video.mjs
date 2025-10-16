import common from "../common.mjs";

export default {
  ...common,
  name: "Delete Video",
  key: "twitch-delete-video",
  description: "Deletes a specified video",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
