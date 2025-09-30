import transifex from "../../transifex.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "transifex-upload-file",
  name: "Upload File to Transifex",
  description: "Uploads a given file to the Transifex platform. [See the documentation](https://developers.transifex.com/reference/post_resource-strings-async-uploads)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    transifex,
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "The url that will be called when the processing is completed.",
      optional: true,
    },
    file: {
      propDefinition: [
        transifex,
        "file",
      ],
    },
    keepTranslations: {
      type: "boolean",
      label: "Keep Transalations",
      description: "Option to keep translations if a source string with the same key changes.",
      optional: true,
    },
    replaceEditedStrings: {
      type: "boolean",
      label: "Replace Edited Strings",
      description: "Option to replace edited strings. If true, updated strings modified in the editor will be overwritten.",
      optional: true,
    },
    organizationId: {
      propDefinition: [
        transifex,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        transifex,
        "projectId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    resourceId: {
      propDefinition: [
        transifex,
        "resourceId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    async streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];

        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const stream = await getFileStream(this.file);
    const buffer = await this.streamToBuffer(stream);
    const base64 = buffer.toString("base64");
    const response = await this.transifex.uploadFile({
      $,
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      data: {
        data: {
          attributes: {
            callback_url: this.callbackUrl,
            content: base64,
            content_encoding: "base64",
            keep_translations: this.keepTranslations,
            replace_edited_strings: this.replaceEditedStrings,
          },
          relationships: {
            resource: {
              data: {
                type: "resources",
                id: `${this.resourceId}`,
              },
            },
          },
          type: "resource_strings_async_uploads",
        },
      },
    });

    $.export("$summary", `Successfully uploaded file with Id: ${response.data.id}`);
    return response;
  },
};
