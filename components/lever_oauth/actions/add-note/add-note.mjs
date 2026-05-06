import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-add-note",
  name: "Add Note",
  description:
    "Adds a note to an opportunity."
    + " Use this to record recruiter observations, interview impressions, or follow-up reminders on a candidate."
    + " Use **List Notes** first to check existing notes and avoid duplicates."
    + " Set Secret to true to make the note visible only to admins and super admins."
    + " [See the documentation](https://hire.lever.co/developer/documentation#create-a-note)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity to add the note to. Use **Search Opportunities** to find opportunity IDs.",
    },
    note: {
      type: "string",
      label: "Note",
      description: "The text content of the note.",
    },
    secret: {
      type: "boolean",
      label: "Secret",
      description: "If true, the note is only visible to admins and super admins. Defaults to false.",
      optional: true,
      default: false,
    },
    performAs: {
      type: "string",
      label: "Perform As (User ID)",
      description: "User ID of the person authoring the note. Use **List Users** to find user IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.performAs) params.perform_as = this.performAs;

    const response = await this.app.addNote(this.opportunityId, {
      $,
      params,
      data: {
        value: this.note,
        secret: this.secret ?? false,
      },
    });
    const result = response.data ?? response;
    $.export("$summary", `Added note to opportunity ${this.opportunityId}`);
    return result;
  },
};
