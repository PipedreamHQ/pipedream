import app from "../../zamzar.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zamzar-create-content-file",
  name: "Create Content File",
  description: "Creates a file from the provided content. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "File Name",
      description: "The desired name for the file",
    },
    content: {
      propDefinition: [
        app,
        "sourceFile",
      ],
    },
  },
  methods: {
    createContentFile(args = {}) {
      return this.app.post({
        path: "/files",
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createContentFile,
      name,
      content,
    } = this;

    const response = await createContentFile({
      $,
      data: {
        name,
        content,
      },
    });

    $.export("$summary", `Successfully created file with ID \`${response.id}\``);
    return response;
  },
};
