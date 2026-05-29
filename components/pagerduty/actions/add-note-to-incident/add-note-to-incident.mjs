import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-add-note-to-incident",
  name: "Add Note to Incident",
  description:
    "Add a text note to an incident. Notes are visible in the incident timeline and useful for documenting investigation steps, resolution details, or handoff notes."
    + " Use **List Incidents** or **Get Incident** to find the incident ID."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/9529ec706026d-create-a-note-on-an-incident)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    incidentId: {
      type: "string",
      label: "Incident ID",
      description: "The ID of the incident to annotate. Use **List Incidents** or **Get Incident** to find IDs.",
    },
    content: {
      type: "string",
      label: "Note Content",
      description: "The text content of the note to add.",
    },
  },
  async run({ $ }) {
    const response = await this.app.addNoteToIncident({
      $,
      incidentId: this.incidentId,
      data: {
        note: {
          content: this.content,
        },
      },
    });

    $.export("$summary", `Added note to incident ${this.incidentId}`);
    return response;
  },
};
