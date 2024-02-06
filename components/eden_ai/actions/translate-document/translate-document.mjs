import app from "../../eden_ai.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";

const options = [
  "deepl",
  "google",
];

export default {
  key: "eden_ai-translate-document",
  name: "Translate Document",
  description: "Translates a document from a local file or URL. [See the documentation](https://docs.edenai.co/reference/translation_document_translation_create)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    providers: {
      propDefinition: [
        app,
        "providers",
      ],
      options,
    },
    fallbackProviders: {
      propDefinition: [
        app,
        "fallbackProviders",
      ],
      options,
    },
    showOriginalResponse: {
      propDefinition: [
        app,
        "showOriginalResponse",
      ],
    },
    sourceLanguage: {
      propDefinition: [
        app,
        "language",
      ],
      label: "Source Language",
      optional: true,
    },
    targetLanguage: {
      propDefinition: [
        app,
        "language",
      ],
      label: "Target Language",
    },
    file: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
      optional: true,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to translate",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      providers, fallbackProviders, showOriginalResponse, sourceLanguage, targetLanguage, file, fileUrl, // eslint-disable-line max-len
    } = this;

    let headers, data = {
      providers: providers.join(),
      fallback_providers: fallbackProviders?.join(),
      show_original_response: showOriginalResponse,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    };

    if (file) {
      const formData = new FormData();
      Object.entries(data).forEach(([
        key,
        value,
      ]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const content = fs.createReadStream(file.includes("tmp/")
        ? file
        : `/tmp/${file}`);
      formData.append("file", content);
      headers = {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      };
      data = formData;
    } else if (fileUrl) {
      data.file_url = fileUrl;
      headers = {
        "Content-Type": "application/json",
      };
    } else {
      throw new ConfigurationError("You must provide either a file or a file URL");
    }

    const response = await this.app.translateText({
      $,
      data,
      headers,
    });
    $.export("$summary", "Document translated successfully");
    return response;
  },
};
