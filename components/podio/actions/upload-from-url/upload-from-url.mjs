import app from "../../podio.app.mjs";

export default {
  key: "podio-upload-from-url",
  name: "Upload From URL",
  description: "Uploads a file from a URL to Podio. [See the documentation](https://github.com/podio/podio-rb/blob/6c77c92792c3ae79d487a997909122e90e544bf1/lib/podio/models/file_attachment.rb#L62)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to upload",
    },
  },
  methods: {
    uploadFile(args = {}) {
      return this.app._makeRequest({
        path: "/file/from_url/",
        method: "POST",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.uploadFile({
      $,
      data: {
        url: this.fileUrl,
      },
    });

    if (response?.file_id) {
      $.export("$summary", `Successfully uploaded file with ID ${response.file_id}.`);
    }

    return response;
  },
};
