import attio from "../../attio.app.mjs";

export default {
  key: "attio-create-note",
  name: "Create Note",
  description: "Create a plaintext note attached to a record (person, company, deal, or any object). Use when you want to log context on a record. Set **Parent Object**, **Parent Record ID**, **Title**, and **Content**. Example: Parent Object `people`, Parent Record ID `891dcbfc-9141-415d-9b2a-2238a6cc012d`, Title `Intro call`, Content `Discussed the Q3 rollout timeline`. Returns the created note with its id. [See the documentation](https://developers.attio.com/reference/post_v2-notes)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
      description: "The ID of the parent record the note belongs to. Use the **List Records** action to look up record IDs.",
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
