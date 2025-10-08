import app from "../../vybit.app.mjs";

export default {
  key: "vybit-send-vybit",
  name: "Send Vybit",
  description: "Triggers a vybit, with optional customizations available. [See the documentation](https://www.vybit.net/#trigger)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    vybitId: {
      propDefinition: [
        app,
        "vybitId",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "Content that will override the default Vybit message and appear in the Vybit log.",
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "An image to attach to the notification (will override the default setting)",
      optional: true,
    },
    linkUrl: {
      type: "string",
      label: "Link URL",
      description: "A redirect URL when the notification is tapped (will override the default setting)",
      optional: true,
    },
    log: {
      type: "string",
      label: "Log",
      description: "Content to append to the Vybit log (supports hyperlinks, such as `<a href='https://example.com'>Example</a>`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, vybitId, ...data
    } = this;
    const response = await app.sendVybit({
      $,
      vybitId,
      data,
    });

    const summary = response.result
      ? `Successfully sent Vybit (event ID ${response.plk})`
      : "Vybit could not be sent";
    $.export("$summary", summary);
    return response;
  },
};
