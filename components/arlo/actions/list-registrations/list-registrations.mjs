// x-pd-ai: optimized
import arlo from "../../arlo.app.mjs";
import {
  DEFAULT_LIMIT,
  REGISTRATION_STATUSES,
} from "../../common/constants.mjs";

export default {
  key: "arlo-list-registrations",
  name: "List Registrations",
  description: "List Arlo registration records with embedded attendee/contact detail, optionally filtered by event. Run **List Events** first to obtain an `eventId`. Results are paged (see `limit`/`skip`); if the page comes back full, call again with a higher `skip` for more. Use `fields` to shrink the response — registration lists can be very large (thousands of records) and each record is verbose. Example: call with `eventId: \"4\"`, `limit: 50` to get up to 50 registrations for event 4 with `RegistrationID`, `Status`, `Contact`. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/registrations#collection-httpget).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    arlo,
    eventId: {
      propDefinition: [
        arlo,
        "eventId",
      ],
      description: "Optional. The integer ID of an event to list registrations for. Run **List Events** to find the event ID.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Optional. Filter registrations by status.",
      optional: true,
      options: REGISTRATION_STATUSES,
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
      description: "Optional. Return only these top-level fields per registration (e.g. `[\"RegistrationID\", \"Status\", \"Contact\"]`) instead of the full record. Strongly recommended for large registration lists.",
      optional: true,
    },
  },
  async run({ $ }) {
    const filterParts = [];
    if (this.eventId) {
      filterParts.push(`Event/EventID eq ${this.eventId}`);
    }
    if (this.status) {
      filterParts.push(`Status eq '${this.status}'`);
    }

    const params = {
      top: this.limit ?? DEFAULT_LIMIT,
      skip: this.skip ?? 0,
      expand: "Registration,Registration/Contact",
    };
    if (filterParts.length) {
      params["filter"] = filterParts.join(" and ");
    }

    const response = await this.arlo.listRegistrations({
      $,
      params,
    });

    const registrations = this.arlo._shapeItems(
      this.arlo._extractCollection(response, "Registrations", "Registration"),
      this.fields,
    );
    $.export("$summary", `Retrieved ${registrations.length} registration${registrations.length === 1
      ? ""
      : "s"}${registrations.length === (this.limit ?? DEFAULT_LIMIT)
      ? " (page may be full — more may exist)"
      : ""}`);
    return registrations;
  },
};
