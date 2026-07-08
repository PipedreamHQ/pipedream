import superdocu from "../../superdocu.app.mjs";
import {
  CONTACT_STATUS_OPTIONS,
  DEFAULT_PER_PAGE,
} from "../../common/constants.mjs";

export default {
  key: "superdocu-list-contacts",
  name: "List Contacts",
  description: "List contacts in Superdocu. Returns an array of contact objects, each with a numeric `id` (e.g. `\"56031\"`) — this `id` (not the email) is the value to pass as **contactId** to **List Dossiers**, **Create Dossier**, **Get Dossier**, **Delete Dossier**, and **Invite Contact**. The `email` field is for reference/display only; downstream tools do not accept it. Supports filtering by status, free-text query, tag, and assignee. [See the documentation](https://developers.superdocu.com/api/index.html).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    superdocu,
    status: {
      type: "string",
      label: "Status",
      description: "Filter contacts by status. One of: `enabled`, `disabled`, `critical`, `watch`, `invited`.",
      options: CONTACT_STATUS_OPTIONS,
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Free-text search across contact fields (maps to `filter[q]`).",
      optional: true,
    },
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "Filter by tag IDs. Each value is the numeric tag ID as a string (e.g. `\"12\"`). Tag IDs are managed in the Superdocu UI under **Settings → Tags** — this MCP tool set does not expose a list-tags endpoint, so the caller must already know the ID. Multiple values are sent as a CSV via `filter[tag_id]`.",
      optional: true,
    },
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "Filter by the ID of the Superdocu user (team member) the contact is assigned to. The value is the numeric user ID as a string (e.g. `\"42\"`); obtain it from the Superdocu UI under **Settings → Team** — this MCP tool set does not expose a list-users endpoint. Maps to `filter[assigned_to]`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        superdocu,
        "limit",
      ],
      description: "Maximum number of contacts to return per page (min 1, max 100; the Superdocu API rejects values above 100). Defaults to 25.",
    },
    after: {
      propDefinition: [
        superdocu,
        "after",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.superdocu.listContacts({
      $,
      params: {
        "filter[status]": this.status,
        "filter[q]": this.query,
        "filter[tag_id]": this.tagIds?.join(","),
        "filter[assigned_to]": this.assignedTo,
        "per_page": this.limit ?? DEFAULT_PER_PAGE,
        "after": this.after,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} contact(s)`);
    return response;
  },
};
