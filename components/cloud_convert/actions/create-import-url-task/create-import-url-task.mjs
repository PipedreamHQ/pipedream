import app from "../../cloud_convert.app.mjs";

export default {
  key: "cloud_convert-create-import-url-task",
  name: "Create Import URL Task",
  description: "Creates a task to import a file from a URL. [See the documentation](https://cloudconvert.com/api/v2/import#import-url-tasks)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the file to import",
    },
    filename: {
      propDefinition: [
        app,
        "filename",
      ],
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Object of additional headers to send with the download request. Can be used to access URLs that require authorization.",
      optional: true,
    },
  },
  methods: {
    createImportUrlTask(args = {}) {
      return this.app.post({
        path: "/import/url",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createImportUrlTask,
      url,
      filename,
      headers,
    } = this;

    const response = await createImportUrlTask({
      $,
      data: {
        url,
        filename,
        headers,
      },
    });

    $.export("$summary", `Successfully created import URL task with ID \`${response.data.id}\``);
    return response;
  },
};
