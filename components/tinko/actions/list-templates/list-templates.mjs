import app from "../../tinko.app.mjs";

export default {
  key: "tinko-list-templates",
  name: "List Templates",
  description: "List the WhatsApp message templates of the company with their status, language, category and components."
    + " Templates work only on official WhatsApp channels."
    + " Use the `id` of an approved template with **Send Message**."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/templates/#listar-templates)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
      description: "Return only templates of this channel, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Channels** to find channel IDs (the `id` field).",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Return only templates with this status, e.g. `approved`. Other values are `pending` and `rejected`.",
      optional: true,
    },
    search: {
      type: "string",
      label: "Name Contains",
      description: "Return only templates whose name contains this value, e.g. `order_update`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const templates = await this.app.getPaginatedResults({
      fn: this.app.listTemplates,
      args: {
        $,
        params: {
          channel: this.channelId,
          status: this.status,
          search: this.search,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Found ${templates.length} template${templates.length === 1
      ? ""
      : "s"}`);
    return templates;
  },
};
