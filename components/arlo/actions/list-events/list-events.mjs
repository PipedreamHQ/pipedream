// x-pd-ai: optimized
import arlo from "../../arlo.app.mjs";
import {
  DEFAULT_LIMIT,
  EVENT_STATUSES,
} from "../../common/constants.mjs";

export default {
  key: "arlo-list-events",
  name: "List Events",
  description: "List Arlo Event (scheduled session) records, optionally filtered by status (the Arlo API does not support filtering this collection by parent event template). Results are paged (see `limit`/`skip`); if the page comes back full, call again with a higher `skip` for more. Use `fields` to shrink the response for large event lists. Example: call with `status: \"Active\"`, `limit: 50` to get up to 50 active events with `EventID`, `Name`, `Code`, `StartDateTime`. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/events#instance-httpget).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    arlo,
    status: {
      type: "string",
      label: "Status",
      description: "Optional. Filter events by status.",
      optional: true,
      options: EVENT_STATUSES,
    },
    limit: {
      propDefinition: [
        arlo,
        "limit",
      ],
    },
    skip: {
      propDefinition: [
        arlo,
        "skip",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional. Return only these top-level fields per event (e.g. `[\"EventID\", \"Name\", \"Code\", \"StartDateTime\"]`) instead of the full record, to reduce response size for large event lists.",
      optional: true,
    },
  },
  async run({ $ }) {
    const filterParts = [];
    if (this.status) {
      filterParts.push(`Status eq '${this.status}'`);
    }

    const params = {
      top: this.limit ?? DEFAULT_LIMIT,
      skip: this.skip ?? 0,
      expand: "Event",
    };
    if (filterParts.length) {
      params["filter"] = filterParts.join(" and ");
    }

    const response = await this.arlo.listEvents({
      $,
      params,
    });

    const events = this.arlo._shapeItems(
      this.arlo._extractCollection(response, "Events", "Event"),
      this.fields,
    );
    $.export("$summary", `Retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}${events.length === (this.limit ?? DEFAULT_LIMIT)
      ? " (page may be full — more may exist)"
      : ""}`);
    return events;
  },
};
