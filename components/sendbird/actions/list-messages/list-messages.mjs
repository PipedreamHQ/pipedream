import app from "../../sendbird.app.mjs";

export default {
  key: "sendbird-list-messages",
  name: "List messages",
  description: "Retrieves a list of past messages of a specific channel.",
  version: "0.0.7",
  type: "action",
  props: {
    app,
    channelType: {
      propDefinition: [
        app,
        "channelType",
      ],
    },
  },
  async run({ $ }) {
    try {
      const channels = await this.app.listChannels();
      console.log(channels);
      const messages = await this.app.listMessages(this.channelType);
      $.export("$summary", `Successfully fetched messages ${messages}`);
      return messages;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
