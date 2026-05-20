import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-list-notes",
  name: "List Notes",
  description:
    "Returns all notes on an opportunity."
    + " Use this before adding a note with **Add Note** to check what has already been recorded, or when asked to summarize recruiter activity on a candidate."
    + " Returns each note's text, author, creation timestamp, and whether it is secret (admin-only)."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-notes)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
      description: "The ID of the opportunity whose notes to retrieve. Use **Search Opportunities** to find opportunity IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.app.listNotes(this.opportunityId, {
      $,
    });
    const notes = response.data ?? response;
    $.export("$summary", `Retrieved ${notes.length} note${notes.length === 1
      ? ""
      : "s"}`);
    return notes;
  },
};
