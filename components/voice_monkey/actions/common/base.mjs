import voiceMonkey from "../../voice_monkey.app.mjs";

export default {
  voiceMonkey,
  type: "action",
  props: {
    voiceMonkey,
    monkey: {
      propDefinition: [
        voiceMonkey,
        "monkey",
      ],
    },
  },
  async run({ $ }) {
    const params = this.getParams();
    const response = await this.voiceMonkey.sendTrigger({
      $,
      params,
    });
    $.export(
      "$summary",
      "Request queued successfully",
    );
    return response;
  },
};
