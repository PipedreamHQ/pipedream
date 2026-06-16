import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-upload-ticket-attachments",
  name: "Upload Ticket Attachments",
  description:
    "Upload one or more files as ticket attachments via the Zendesk Uploads API. Returns upload tokens that can be used when creating or updating tickets. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/ticket-attachments/#upload-files).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    attachments: {
      propDefinition: [
        app,
        "attachments",
      ],
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    const {
      attachments,
      customSubdomain,
    } = this;

    const tokens = await this.app.uploadFiles({
      attachments,
      customSubdomain,
      step,
    });

    step.export(
      "$summary",
      `Successfully uploaded ${tokens.length} attachment(s).`,
    );

    return {
      tokens,
    };
  },
};
