// x-pd-ai: optimized
import app from "../../mixpanel_service_account.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mixpanel_service_account-list-event-properties",
  name: "List Event Properties",
  description: "List the property names most frequently sent with a single event, together with how many times each was seen. Use this to discover what an event can be filtered or broken down by before writing a `where` or `on` expression. [See the documentation](https://docs.mixpanel.com/reference/query-events-top-properties)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    eventName: {
      propDefinition: [
        app,
        "eventName",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of property names to return. Defaults to ${constants.DEFAULT_TOP_PROPERTIES_LIMIT}.`,
      min: 1,
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listEventProperties({
      $,
      params: {
        event: this.eventName,
        limit: this.limit,
        workspace_id: this.workspaceId,
      },
    });

    const count = Object.keys(response).length;
    $.export("$summary", `Found ${count} propert${count === 1
      ? "y"
      : "ies"} on event "${this.eventName}"`);

    return response;
  },
};
