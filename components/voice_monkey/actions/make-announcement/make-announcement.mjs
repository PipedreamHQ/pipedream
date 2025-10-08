import voiceMonkey from "../../voice_monkey.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "voice_monkey-make-annoucement",
  name: "Make Announcement",
  description: "This action will make an annoucement on your device using the text you supply. [See docs here](https://voicemonkey.io/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    announcement: {
      propDefinition: [
        voiceMonkey,
        "announcement",
      ],
    },
  },
  methods: {
    getParams() {
      return {
        monkey: this.monkey,
        announcement: this.announcement,
      };
    },
  },
};
