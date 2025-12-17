import freshchat from "../../freshchat.app.mjs";

export default {
  key: "freshchat-list-channels",
  name: "List Channels",
  description: "Lists all channels in Freshchat. [See the documentation](https://developers.freshchat.com/api/#channels-(topics))",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshchat,
    locale: {
      type: "string",
      label: "Locale",
      description: "Limits the response to topics whose locale value matches the parameter value. Must be specified in the ISO-639 format. E.g. `en`",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        freshchat,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const channels = await this.freshchat.getPaginatedResults({
      fn: this.freshchat.listChannels,
      resourceKey: "channels",
      args: {
        $,
        params: {
          locale: this.locale,
        },
      },
      max: this.maxResults,
    });
    $.export("$summary", `Listed ${channels.length} channel${channels.length === 1
      ? ""
      : "s"}`);
    return channels;
  },
};
