import sunshineConversations from "../../sunshine_conversations.app.mjs";

export default {
  key: "sunshine_conversations-list-integrations",
  name: "List Integrations",
  description: "List integrations for the authenticated user. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Integrations/operation/ListIntegrations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sunshineConversations,
    types: {
      type: "string",
      label: "Types",
      description: "Comma-separated list of types to return. If omitted, all types are returned. Example: `custom,messenger,whatsapp`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.sunshineConversations.paginate({
      fn: this.sunshineConversations.listIntegrations,
      $,
      params: {
        filter: {
          types: this.types,
        },
      },
      resourceKey: "integrations",
    });

    const integrations = [];
    for await (const integration of response) {
      integrations.push(integration);
    }

    $.export("$summary", `Successfully listed ${integrations.length} integration(s).`);
    return integrations;
  },
};
