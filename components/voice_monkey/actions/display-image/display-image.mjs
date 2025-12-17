import voiceMonkey from "../../voice_monkey.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "voice_monkey-display-image",
  name: "Display Image",
  description: "This action will display an image on your device with a screen e.g. Echo Show. [See docs here](https://voicemonkey.io/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    imageUrl: {
      propDefinition: [
        voiceMonkey,
        "imageUrl",
      ],
      optional: false,
    },
  },
  methods: {
    getParams() {
      return {
        monkey: this.monkey,
        image: this.imageUrl,
      };
    },
  },
};
