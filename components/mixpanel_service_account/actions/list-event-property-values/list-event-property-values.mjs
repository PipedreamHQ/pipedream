// x-pd-ai: optimized
import app from "../../mixpanel_service_account.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mixpanel_service_account-list-event-property-values",
  name: "List Event Property Values",
  description: "List the most common values a single property takes on a single event. Use this to find the exact literal to compare against in a `where` or `on` expression, rather than guessing at spellings or casing. [See the documentation](https://docs.mixpanel.com/reference/query-events-top-property-values)",
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
    propertyName: {
      type: "string",
      label: "Property Name",
      description: "The name of the property to list values for, exactly as it is tracked (for example, `$browser` or `plan_tier`). Use **List Event Properties** to discover valid names for this event.",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: `The maximum number of values to return. Defaults to ${constants.DEFAULT_TOP_VALUES_LIMIT}.`,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listEventPropertyValues({
      $,
      params: {
        event: this.eventName,
        name: this.propertyName,
        limit: this.limit,
        workspace_id: this.workspaceId,
      },
    });

    $.export("$summary", `Found ${response.length} value${response.length === 1
      ? ""
      : "s"} for property "${this.propertyName}" on event "${this.eventName}"`);

    return response;
  },
};
