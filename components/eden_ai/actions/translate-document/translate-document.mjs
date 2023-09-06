import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import fs from "fs";

export default {
  key: "eden_ai-translate-document",
  name: "Translate Document",
  description: "Translates a document using Eden AI. [See docs here](https://docs.edenai.co/reference/translation_document_translation_create)",
  version: "0.0.1",
  type: "action",
  props: {
    eden_ai: {
      type: "app",
      app: "eden_ai",
    },
    source_language: {
      type: "string",
      label: "Source Language",
      description: "The source language of the document to translate",
    },
    target_language: {
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
    file_url: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to translate",
      optional: true,
    },
  },
  methods: {
    async translateDocument({
      $, source_language, target_language, file, file_url,
    }) {
      if (file) {
        const formData = new FormData();
        formData.append("source_language", source_language);
        formData.append("target_language", target_language);
        formData.append("file", fs.createReadStream(`/tmp/${file}`));

        return axios($, {
          method: "POST",
          url: "https://api.edenai.run/v1/pretrained/translation/document_translation",
          headers: {
            "Authorization": `Bearer ${this.eden_ai.$auth.api_key}`,
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          },
          data: formData,
        });
      } else if (file_url) {
        return axios($, {
          method: "POST",
          url: "https://api.edenai.run/v1/pretrained/translation/document_translation",
          headers: {
            "Authorization": `Bearer ${this.eden_ai.$auth.api_key}`,
            "Content-Type": "application/json",
          },
          data: {
            source_language,
            target_language,
            file_url,
          },
        });
      } else {
        throw new ConfigurationError("You must provide either a file or a file URL");
      }
    },
  },
  async run({ $ }) {
    const {
      source_language, target_language, file, file_url,
    } = this;
    if (!file && !file_url) {
      throw new ConfigurationError("You must provide either a file path or a file URL");
    }

    const response = await this.translateDocument({
      $,
      source_language,
      target_language,
      file,
      file_url,
    });
    $.export("$summary", "Document translated successfully");
    return response;
  },
};
