import gorgiasOauth from "../../gorgias_oauth.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gorgias_oauth-list-integrations",
  name: "List Integrations",
  description: "List the integrations (email addresses, chat widgets, Facebook/Instagram pages, WhatsApp numbers, etc.) connected to the account. Use the `id` as the Integration ID in **Create Ticket Message** or **Send Public Reply**. [See the documentation](https://developers.gorgias.com/reference/list-integrations)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gorgiasOauth,
    type: {
      type: "string",
      label: "Type",
      description: "Only return integrations of this type, e.g. `gorgias_chat`. `http` integrations are webhooks, not message channels",
      options: constants.integrationTypes,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of integrations to return (1-100), e.g. `30`",
      min: 1,
      max: constants.INTEGRATIONS_LIMIT_MAX,
      default: 30,
    },
  },
  async run({ $ }) {
    const integrations = [];
    const paginator = this.gorgiasOauth.paginate({
      $,
      fn: this.gorgiasOauth.listIntegrations,
      params: {
        type: this.type,
        limit: this.limit,
      },
    });
    for await (const integration of paginator) {
      integrations.push(integration);
    }

    $.export("$summary", `Returned ${integrations.length} integration${integrations.length === 1
      ? ""
      : "s"}`);
    return integrations;
  },
};
