import humanitix from "../../humanitix.app.mjs";

export default {
  key: "humanitix-get-events",
  name: "Get Events",
  description: "Retrieves a list of events from Humanitix. [See the documentation](https://humanitix.stoplight.io/docs/humanitix-public-api/476881e4b5d55-get-events)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    humanitix,
    overrideLocation: {
      propDefinition: [
        humanitix,
        "overrideLocation",
      ],
    },
    inFutureOnly: {
      type: "boolean",
      label: "In Future Only",
      description: "If true, return only events that have an endDate in the future",
      optional: true,
    },
    since: {
      propDefinition: [
        humanitix,
        "since",
      ],
    },
    maxResults: {
      propDefinition: [
        humanitix,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = this.humanitix.paginate({
      $,
      fn: this.humanitix.getEvents,
      maxResults: this.maxResults,
      dataField: "events",
    });

    const events = [];
    for await (const event of response) {
      events.push(event);
    }

    $.export("$summary", `Successfully retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}`);

    return events;
  },
};
