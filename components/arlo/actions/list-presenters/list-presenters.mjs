import arlo from "../../arlo.app.mjs";
import {
  CONTACT_STATUSES,
  DEFAULT_LIMIT,
} from "../../common/constants.mjs";

export default {
  key: "arlo-list-presenters",
  name: "List Presenters",
  description: "List Arlo contact records that serve as presenters. NOTE: the Arlo Contacts collection has no dedicated 'is presenter' filter, so this returns contact records and callers should filter by tag/code externally. Results are paged (see `limit`/`skip`); if the page comes back full, call again with a higher `skip` for more. Use `fields` to shrink the response for large contact lists. Example: call with `status: \"Active\"`, `limit: 50` to get up to 50 active contacts with `ContactID`, `FirstName`, `LastName`, `Email`. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/contacts#collection-httpget).",
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
      description: "Optional. Filter contacts by status.",
      optional: true,
      options: CONTACT_STATUSES,
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
      description: "Optional. Return only these top-level fields per contact (e.g. `[\"ContactID\", \"FirstName\", \"LastName\", \"Email\"]`) instead of the full record, to reduce response size for large contact lists.",
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
      expand: "Contact",
    };
    if (filterParts.length) {
      params["filter"] = filterParts.join(" and ");
    }

    const response = await this.arlo.listContacts({
      $,
      params,
    });

    const contacts = this.arlo._shapeItems(
      this.arlo._extractCollection(response, "Contacts", "Contact"),
      this.fields,
    );
    $.export("$summary", `Retrieved ${contacts.length} contact${contacts.length === 1
      ? ""
      : "s"}${contacts.length === (this.limit ?? DEFAULT_LIMIT)
      ? " (page may be full — more may exist)"
      : ""}`);
    return contacts;
  },
};
