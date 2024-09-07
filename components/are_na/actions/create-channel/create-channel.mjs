import app from "../../are_na.app.mjs";

export default {
  key: "are_na-create-channel",
  name: "Create Channel",
  description: "Create a new channel in Are.na. [See the documentation](https://dev.are.na/documentation/channels#Block45041)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    channelTitle: {
      propDefinition: [
        app,
        "channelTitle",
      ],
    },
    channelStatus: {
      propDefinition: [
        app,
        "channelStatus",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createChannel({
      $,
      params: {
        title: this.channelTitle,
        status: this.channelStatus,
      },
    });
    $.export("$summary", `Successfully created channel '${this.channelTitle}' with slug '${response.slug}'`);
    return response;
  },
};
