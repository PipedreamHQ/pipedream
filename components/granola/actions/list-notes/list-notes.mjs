import granola from "../../granola.app.mjs";

export default {
  key: "granola-list-notes",
  name: "List Notes",
  description: "List accessible meeting notes. [See the documentation](https://docs.granola.ai/api-reference/list-notes)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    granola,
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Return notes created after this date (e.g. `2026-01-27` or an ISO 8601 date-time)",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Return notes created before this date (e.g. `2026-01-27` or an ISO 8601 date-time)",
      optional: true,
    },
    updatedAfter: {
      type: "string",
      label: "Updated After",
      description: "Return notes updated after this date (e.g. `2026-01-27` or an ISO 8601 date-time)",
      optional: true,
    },
    folderId: {
      propDefinition: [
        granola,
        "folderId",
      ],
    },
    maxResults: {
      propDefinition: [
        granola,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      granola,
      createdAfter,
      createdBefore,
      updatedAfter,
      folderId,
      maxResults,
    } = this;

    const notes = [];
    const results = granola.paginate({
      $,
      fn: granola.listNotes,
      params: {
        created_after: createdAfter,
        created_before: createdBefore,
        updated_after: updatedAfter,
        folder_id: folderId,
      },
      resourceKey: "notes",
      max: maxResults,
    });

    for await (const note of results) {
      notes.push(note);
    }

    $.export("$summary", `Successfully retrieved ${notes.length} note(s)`);
    return notes;
  },
};
