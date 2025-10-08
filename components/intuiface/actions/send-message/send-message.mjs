import app from "../../intuiface.app.mjs";

export default {
  key: "intuiface-send-message",
  name: "Send Message",
  description: "Send messages to any connected Intuiface Player running an experience that embeds the [Web Triggers Interface Asset](https://support.intuiface.com/hc/en-us/articles/360007431151-Web-Triggers-Overview). [See the docs](https://my.intuiface.com/api-doc/#/default/sendMessage).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    message: {
      type: "string",
      label: "Message",
      description: "Value to send to all experiences satisfying any filter(s) specified below. If no filters are applied then all accessible experiences will be targeted.",
    },
    parameter1: {
      type: "string",
      label: "Parameter 1",
      description: "An additional value that can be sent to all selected experiences.",
      optional: true,
    },
    parameter2: {
      type: "string",
      label: "Parameter 2",
      description: "An additional value that can be sent to all selected experiences.",
      optional: true,
    },
    parameter3: {
      type: "string",
      label: "Parameter 3",
      description: "An additional value that can be sent to all selected experiences.",
      optional: true,
    },
    experienceNames: {
      propDefinition: [
        app,
        "experienceNames",
      ],
    },
    experienceIds: {
      propDefinition: [
        app,
        "experienceIDs",
      ],
    },
    playerDeviceNames: {
      propDefinition: [
        app,
        "playerDeviceNames",
      ],
    },
    playerIds: {
      propDefinition: [
        app,
        "playerIds",
      ],
    },
    playerTags: {
      type: "string[]",
      label: "Player Tags",
      description: "Specify player(s) based on their tag(s).",
      optional: true,
    },
  },
  methods: {
    join(arr) {
      if (Array.isArray(arr)) {
        return arr.join(",");
      }
      return undefined;
    },
  },
  async run({ $ }) {
    const {
      message,
      parameter1,
      parameter2,
      parameter3,
      experienceNames,
      experienceIds,
      playerDeviceNames,
      playerIds,
      playerTags,
    } = this;
    const result = await this.app.sendMessage({
      $,
      params: {
        message,
        parameter1,
        parameter2,
        parameter3,
        experienceNames: this.join(experienceNames),
        experienceIDs: this.join(experienceIds),
        playerDeviceNames: this.join(playerDeviceNames),
        playerIDs: this.join(playerIds),
        playerTags: this.join(playerTags),
      },
    });
    $.export("$summary", `Successfully sent message to ${result.experienceCount} experiences`);
    return result;
  },
};
