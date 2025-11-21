import gorgiasOAuth from "../../gorgias_oauth.app.mjs";

export default {
  name: "List Messages",
  description: "List all messages. [See the documentation](https://developers.gorgias.com/reference/list-messages)",
  key: "gorgias_oauth-list-messages",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gorgiasOAuth,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to return (1-100)",
      min: 1,
      max: 100,
      default: 50,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Cursor for pagination (get from the meta.next_cursor of the previous response)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.limit,
    };

    if (this.cursor) {
      params.cursor = this.cursor;
    }

    const response = await this.gorgiasOAuth.listMessages({
      $,
      params,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} message${response.data.length === 1
      ? ""
      : "s"}`);

    // Return the data and pagination info
    return {
      data: response.data,
      meta: response.meta,
    };
  },
};
