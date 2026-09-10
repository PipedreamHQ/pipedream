import arlo from "../../arlo.app.mjs";
import {
  DEFAULT_LIMIT,
  VENUE_STATUSES,
} from "../../common/constants.mjs";

export default {
  key: "arlo-list-venues",
  name: "List Venues",
  description: "List Arlo venue records. Use the returned `VenueID` values when specifying `VenueDetails` in **Create Event** sessions. Optionally filter by status. Results are paged (see `limit`/`skip`); if the page comes back full, call again with a higher `skip` for more. Use `fields` to shrink the response for large venue lists. Example: call with `status: \"Active\"` to get up to 100 active venues with `VenueID`, `Name`, `Status`. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/venues#collection-httpget).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
      description: "Optional. Filter venues by status.",
      optional: true,
      options: VENUE_STATUSES,
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
      description: "Optional. Return only these top-level fields per venue (e.g. `[\"VenueID\", \"Name\", \"Status\"]`) instead of the full record, to reduce response size for large venue lists.",
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
      expand: "Venue",
    };
    if (filterParts.length) {
      params["filter"] = filterParts.join(" and ");
    }

    const response = await this.arlo.listVenues({
      $,
      params,
    });

    const venues = this.arlo._shapeItems(
      this.arlo._extractCollection(response, "Venues", "Venue"),
      this.fields,
    );
    $.export("$summary", `Retrieved ${venues.length} venue${venues.length === 1
      ? ""
      : "s"}${venues.length === (this.limit ?? DEFAULT_LIMIT)
      ? " (page may be full — more may exist)"
      : ""}`);
    return venues;
  },
};
