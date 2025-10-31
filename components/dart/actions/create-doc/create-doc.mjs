import dart from "../../dart.app.mjs";

export default {
  key: "dart-create-doc",
  name: "Create Doc",
  description: "Record a new doc that the user intends to write down. This will save the doc in Dart for later access, search, etc. By default the created doc will be in the Docs folder. More information can be included in the text. [See the documentation](https://app.dartai.com/api/v0/public/docs/#/Doc/createDoc)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dart,
    title: {
      propDefinition: [
        dart,
        "title",
      ],
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
    const response = await this.dart.createDoc({
      $,
      data: {
        item: {
          title: this.title,
          folder: this.folder,
          text: this.text,
        },
      },
    });

    $.export("$summary", `New doc successfully created with ID: ${response.item.id}`);
    return response;
  },
};
