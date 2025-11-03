import app from "../../pixelbin.app.mjs";

export default {
  key: "pixelbin-create-folder",
  name: "Create Folder",
  description: "Creates a new folder in Pixelbin. [See the documentation](https://www.pixelbin.io/docs/api-docs/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      optional: false,
      description: "Name of the folder.",
      propDefinition: [
        app,
        "name",
      ],
    },
    path: {
      description: "Path of the containing folder. Eg. `folder1/folder2`.",
      propDefinition: [
        app,
        "path",
      ],
    },
  },
  methods: {
    createFolder(args = {}) {
      return this.app.post({
        path: "/folders",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createFolder,
      name,
      path,
    } = this;

    const response = await createFolder({
      $,
      data: {
        name,
        path,
      },
    });
    $.export("$summary", `Successfully created folder with ID \`${response._id}\`.`);
    return response;
  },
};
