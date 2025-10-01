import app from "../../pixelbin.app.mjs";

export default {
  key: "pixelbin-delete-file",
  name: "Delete File",
  description: "Deletes a file from Pixelbin. [See the documentation](https://www.pixelbin.io/docs/api-docs/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    path: {
      optional: false,
      propDefinition: [
        app,
        "path",
        () => ({
          params: {
            onlyFolders: false,
            onlyFiles: true,
          },
        }),
      ],
    },
  },
  methods: {
    deleteFile({
      path, ...args
    }) {
      return this.app.delete({
        path: `/files/${path}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteFile,
      path,
    } = this;
    const response = await deleteFile({
      $,
      path,
    });
    $.export("$summary", `Successfully deleted file with ID \`${response._id}\`.`);
    return response;
  },
};
