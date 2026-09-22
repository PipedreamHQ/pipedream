import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-note",
  name: "Get Note",
  description: "Get a note by UUID. [See the documentation](https://developer.servicem8.com/reference/getnotes)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      label: "Note",
      description: "Select the note to retrieve (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "note",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "note",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Note ${this.uuid}`);
    return response;
  },
};
