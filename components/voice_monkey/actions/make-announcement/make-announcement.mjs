import voiceMonkey from "../../voice_monkey.app.mjs";

export default {
  voiceMonkey,
  key: "voice_monkey-make-annoucement",
  name: "Make Announcement",
  description: "This action will make an annoucement on your device using the text you supply. [See docs here](https://voicemonkey.io/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    voiceMonkey,
    monkey: {
      propDefinition: [
        voiceMonkey,
        "monkey",
      ],
    },
    announcement: {
      propDefinition: [
        voiceMonkey,
        "announcement",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.voiceMonkey.sendTrigger({
      $,
      params: {
        monkey: this.monkey,
        announcement: this.announcement,
      },
    });
    $.export(
      "$summary",
      "Request queued successfully",
    );
    return response;
  },
};
