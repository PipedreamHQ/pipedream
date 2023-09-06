import app from "../../eden_ai.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "eden_ai-translate-document",
  name: "Translate Document",
  description: "Translates a document using Eden AI. [See docs here](https://docs.edenai.co/reference/translation_document_translation_create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    providers: {
      type: "string[]",
      label: "Providers",
      description: "One or more providers (e.g. `deepl`, `google`) that the data will be redirected to in order to get the processed results.",
    },
    sourceLanguage: {
      type: "string",
      label: "Source Language",
      description: "The source language code (e.g. `en`, `fr`)",
    },
    targetLanguage: {
      type: "string",
      label: "Target Language",
      description: "The language code to translate the document to",
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
      providers, sourceLanguage, targetLanguage, file, fileUrl,
    } = this;

    const strProviders = providers.join();

    let data, headers;

    if (file) {
      data = new FormData();
      data.append("providers", strProviders);
      data.append("source_language", sourceLanguage);
      data.append("target_language", targetLanguage);
      data.append("file", fs.createReadStream(file.startsWith("/tmp/")
        ? file
        : `/tmp/${file}`));

      headers = {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      };
    } else if (fileUrl) {
      data = {
        providers: strProviders,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        file_url: fileUrl,
      };
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
