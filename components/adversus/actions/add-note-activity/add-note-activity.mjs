import adversus from "../../adversus.app.mjs";

export default {
  key: "adversus-add-note-activity",
  name: "Add Note or Activity",
  description: "Add a note or activity to a lead in Adversus. [See the API documentation](https://solutions.adversus.io/api).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    adversus,
    leadId: {
      propDefinition: [
        adversus,
        "leadId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "The note text to add to the lead",
      optional: true,
    },
    activityType: {
      type: "string",
      label: "Activity Type",
      description: "The type of activity (e.g., 'call', 'email', 'meeting')",
      optional: true,
    },
    activityDescription: {
      type: "string",
      label: "Activity Description",
      description: "The description of the activity",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to include in the note or activity",
      optional: true,
    },
  },
  /**
   * Execute the action to add a note or activity to a lead
   * @param {Object} $ - Pipedream context
   * @returns {Promise} The response from adding note/activity
   */
  async run({ $ }) {
    const promises = [];

    if (this.note) {
      promises.push(
        this.adversus.addNoteToLead(this.leadId, {
          data: {
            note: this.note,
            ...(this.additionalFields || {}),
          },
        }),
      );
    }

    if (this.activityType || this.activityDescription) {
      promises.push(
        this.adversus.addActivityToLead(this.leadId, {
          data: {
            ...(this.activityType && {
              type: this.activityType,
            }),
            ...(this.activityDescription && {
              description: this.activityDescription,
            }),
            ...(this.additionalFields || {}),
          },
        }),
      );
    }

    if (promises.length === 0) {
      throw new Error("Either 'Note' or 'Activity Type'/'Activity Description' must be provided");
    }

    const results = await Promise.all(promises);

    $.export("$summary", `Successfully added ${promises.length} item(s) to lead ${this.leadId}`);

    return results.length === 1
      ? results[0]
      : results;
  },
};
