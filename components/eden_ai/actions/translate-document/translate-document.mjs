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
    sourceLanguage: {
      type: "string",
      label: "Source Language",
      description: "The source language of the document to translate",
    },
    targetLanguage: {
      type: "string",
      label: "Target Language",
      description: "The language to translate the document to",
    },
    file: {
      type: "string",
      label: "File",
      description: "The path to the file to translate, relative to the /tmp directory",
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
      source_language, target_language, file, file_url,
    } = this;
    if (!file && !file_url) {
      throw new ConfigurationError("You must provide either a file path or a file URL");
    }

    let data, headers;

    if (file) {
      data = new FormData();
      data.append("source_language", source_language);
      data.append("target_language", target_language);
      data.append("file", fs.createReadStream(`/tmp/${file}`));

      headers = {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      };
    } else if (file_url) {
      data = {
        source_language,
        target_language,
        file_url,
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
