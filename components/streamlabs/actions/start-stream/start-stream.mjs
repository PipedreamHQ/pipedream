import streamlabs from "../../streamlabs.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "streamlabs-start-stream",
  name: "Start Live Stream",
  description: "Starts a live stream. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    streamlabs,
    streamTitle: {
      propDefinition: [
        streamlabs,
        "streamTitle",
      ],
    },
    gameCategory: {
      propDefinition: [
        streamlabs,
        "gameCategory",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.streamlabs.startLiveStream({
      streamTitle: this.streamTitle,
      gameCategory: this.gameCategory,
    });
    $.export("$summary", `Started live stream with title "${this.streamTitle}"`);
    return response;
  },
};
