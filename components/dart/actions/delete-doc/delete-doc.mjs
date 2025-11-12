import dart from "../../dart.app.mjs";

export default {
  key: "dart-delete-doc",
  name: "Delete Doc",
  description: "Move an existing doc to the trash, where it can be recovered if needed. Nothing else about the doc will be changed. [See the documentation](https://app.dartai.com/api/v0/public/docs/#/Doc/deleteDoc)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dart,
    docId: {
      propDefinition: [
        dart,
        "docId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dart.deleteDoc({
      $,
      docId: this.docId,
    });

    $.export("$summary", `Successfully deleted doc with ID: ${this.docId}`);
    return response;
  },
};
