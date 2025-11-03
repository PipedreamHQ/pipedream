import belco from "../../belco.app.mjs";

export default {
  key: "belco-list-all-conversations",
  name: "List All Conversations",
  description: "Get a list of conversations from Belco. [See the documentation](https://developers.belco.io/reference/get_conversations)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    belco,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of conversations to retrieve",
      default: 50,
      min: 1,
      max: 100,
    },
    skip: {
      type: "integer",
      label: "Skip",
      description: "Number of conversations to skip",
      default: 0,
      min: 0,
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.limit,
      skip: this.skip,
    };

    const response = await this.belco.listConversations({
      $,
      params,
    });

    $.export("$summary", `Retrieved ${response.conversations.length} conversations`);

    return response;
  },
};
