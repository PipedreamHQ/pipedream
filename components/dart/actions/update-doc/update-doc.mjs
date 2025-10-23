import dart from "../../dart.app.mjs";

export default {
  key: "dart-update-doc",
  name: "Update Doc",
  description: "Update certain properties of an existing doc. This will save the doc in Dart for later access, search, etc. Any properties that are not specified will not be changed. [See the documentation](https://app.dartai.com/api/v0/public/docs/#/Doc/updateDoc)",
  version: "0.0.1",
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
    title: {
      propDefinition: [
        dart,
        "title",
      ],
      optional: true,
    },
    folder: {
      propDefinition: [
        dart,
        "folder",
      ],
    },
    text: {
      propDefinition: [
        dart,
        "text",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dart.updateDoc({
      $,
      data: {
        item: {
          id: this.docId,
          title: this.title,
          folder: this.folder,
          text: this.text,
        },
      },
    });

    $.export("$summary", `Successfully updated doc with ID: ${this.docId}`);
    return response;
  },
};
