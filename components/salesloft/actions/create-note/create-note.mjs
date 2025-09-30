import salesloft from "../../salesloft.app.mjs";

export default {
  key: "salesloft-create-note",
  name: "Create Note",
  description: "Creates a new note in Salesloft. [See the documentation](https://developers.salesloft.com/docs/api/notes-create/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesloft,
    content: {
      type: "string",
      label: "Content",
      description: "The content of the note",
    },
    associatedWithType: {
      type: "string",
      label: "Associated Record Type",
      description: "The type of record this note is associated with",
      options: [
        "person",
        "account",
      ],
    },
    associatedWithId: {
      propDefinition: [
        salesloft,
        "recordId",
        ({ associatedWithType }) => ({
          recordType: associatedWithType,
        }),
      ],
    },
    skipActivities: {
      type: "boolean",
      label: "Skip Activities",
      description: "If true, no activities will be created for this note",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.salesloft.createNote({
      $,
      data: {
        content: this.content,
        associated_with_id: this.associatedWithId,
        associated_with_type: this.associatedWithType,
        skip_activities: this.skipActivities,
      },
    });

    $.export("$summary", `Successfully created note for ${this.associatedWithType.toLowerCase()} ${this.associatedWithId}`);

    return response;
  },
};
