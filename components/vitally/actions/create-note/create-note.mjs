import vitally from "../../vitally.app.mjs";

export default {
  key: "vitally-create-note",
  name: "Create Note",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new note. [See the documentation](https://docs.vitally.io/pushing-data-to-vitally/rest-api/notes#create-a-note-post)",
  type: "action",
  props: {
    vitally,
    accountId: {
      propDefinition: [
        vitally,
        "accountId",
      ],
      description: "The ID of the Vitally Account to associate the Note with. Not to be confused with an External ID, this is the Vitally Account ID.",
    },
    organizationId: {
      propDefinition: [
        vitally,
        "organizationId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "The body of the note, may include HTML.",
    },
    noteDate: {
      type: "string",
      label: "Note Date",
      description: "The timestamp of when the Note was created. `Format: YYYY-MM-DDTHH:MM:mm:ss.SSSZ`.",
    },
    externalId: {
      propDefinition: [
        vitally,
        "externalId",
      ],
      description: "The unique ID of the Note in your system.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject or title of the Note.",
      optional: true,
    },
    authorId: {
      propDefinition: [
        vitally,
        "assignedToId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
      description: "The ID of the Vitally User who created the Note.",
      optional: true,
    },
    categoryId: {
      propDefinition: [
        vitally,
        "noteCategoryId",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of string tags to associate to the note.",
      optional: true,
    },
    traits: {
      type: "object",
      label: "Traits",
      description: "A key-value JSON object of custom note traits.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      vitally,
      ...data
    } = this;

    const response = await vitally.createNote({
      $,
      data,
    });

    $.export("$summary", `A new note with Id: ${response.id} was successfully created!`);
    return response;
  },
};
