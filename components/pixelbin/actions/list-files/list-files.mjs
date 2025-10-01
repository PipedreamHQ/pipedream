import app from "../../pixelbin.app.mjs";

export default {
  key: "pixelbin-list-files",
  name: "List Files",
  description: "List all files. [See the documentation](https://www.pixelbin.io/docs/api-docs/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    name: {
      description: "Find items with matching name.",
      propDefinition: [
        app,
        "name",
      ],
    },
    path: {
      description: "Find items with matching path.",
      propDefinition: [
        app,
        "path",
      ],
    },
    format: {
      type: "string",
      label: "Format",
      description: "Find items with matching format.",
      optional: true,
    },
    tags: {
      description: "Find items containing these tags",
      propDefinition: [
        app,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      path,
      format,
      tags,
    } = this;

    const result = await app.paginate({
      resourcesFn: app.listFiles,
      resourcesFnArgs: {
        $,
        params: {
          name,
          path,
          format,
          tags,
          onlyFiles: true,
        },
      },
      resourceName: "items",
    });
    $.export("$summary", `Successfully listed \`${result.length}\` file(s).`);
    return result;
  },
};
