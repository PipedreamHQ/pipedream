import app from "../../appsflyer.app.mjs";

export default {
  key: "appsflyer-get-event-types",
  name: "Get Event Types",
  description: "Returns a list of the available event types for the specified endpoint type. [See the documentation](https://dev.appsflyer.com/hc/reference/get_event-types-attributing-entity)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    attributingEntity: {
      type: "string",
      label: "Attributing Entity",
      description: "The endpoint type.",
      options: [
        "appsflyer",
        "skadnetwork",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      attributingEntity,
    } = this;

    const response = await app.getEventTypes({
      $,
      attributingEntity,
    });

    $.export("$summary", `Successfully retrieved event types with request ID \`${response.request_id}\`.`);
    return response;
  },
};
