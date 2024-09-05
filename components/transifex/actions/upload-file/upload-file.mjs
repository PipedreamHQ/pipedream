import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import transifex from "../../transifex.app.mjs";

export default {
  key: "transifex-upload-file",
  name: "Upload File to Transifex",
  description: "Uploads a given file to the Transifex platform. [See the documentation](https://developers.transifex.com/reference/post_resource-strings-async-uploads)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
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
            content: fs.readFileSync(checkTmp(this.file), {
              encoding: "base64",
            }),
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
