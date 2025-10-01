import attio from "../../attio.app.mjs";

export default {
  key: "attio-create-note",
  name: "Create Note",
  description: "Creates a new note for a given record. The note will be linked to the specified record. [See the documentation](https://developers.attio.com/reference/post_v2-notes)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    attio,
    parentObject: {
      propDefinition: [
        attio,
        "objectId",
        () => ({
          mapper: ({
            api_slug: value,
            singular_noun: label,
          }) => ({
            value,
            label,
          }),
        }),
      ],
      label: "Parent Object",
      description: "The parent object the note belongs to",
    },
    parentRecordId: {
      propDefinition: [
        attio,
        "recordId",
        ({ parentObject }) => ({
          targetObject: parentObject,
        }),
      ],
      label: "Parent Record ID",
      description: "The ID of the parent record the note belongs to",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The note title",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the note",
    },
  },
  methods: {
    createNote(args = {}) {
      return this.attio.post({
        path: "/notes",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.createNote({
      $,
      data: {
        data: {
          parent_object: this.parentObject,
          parent_record_id: this.parentRecordId,
          title: this.title,
          format: "plaintext",
          content: this.content,
        },
      },
    });
    $.export("$summary", `Successfully created note with ID \`${response.data.id.note_id}\`.`);
    return response;
  },
};
