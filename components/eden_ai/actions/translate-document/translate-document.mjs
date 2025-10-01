import app from "../../eden_ai.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

const options = [
  "deepl",
  "google",
];

export default {
  key: "eden_ai-translate-document",
  name: "Translate Document",
  description: "Translates a document from a local file or URL. [See the documentation](https://docs.edenai.co/reference/translation_document_translation_create)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.pdf`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      providers,
      fallbackProviders,
      showOriginalResponse,
      sourceLanguage,
      targetLanguage,
      file,
    } = this;

    const data = {
      providers: providers.join(),
      fallback_providers: fallbackProviders?.join(),
      show_original_response: showOriginalResponse,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    };

    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(file);
    const formData = new FormData();

    Object.entries(data).forEach(([
      key,
      value,
    ]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    formData.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await app.translateText({
      $,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    });

    $.export("$summary", "Document translated successfully");
    return response;
  },
};
