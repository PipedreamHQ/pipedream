import unstructured from "../../unstructured.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "unstructured-extract-file",
  name: "Extract File",
  description: "Extract data from a file. [See the documentation](https://docs.unstructured.io/api-reference/general/summary)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    unstructured,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to extract data from. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
    },
    coordinates: {
      type: "boolean",
      label: "Extract Coordinates",
      description: "If `true`, return coordinates for each element extracted via OCR",
      optional: true,
    },
    encoding: {
      type: "string",
      label: "Encoding",
      description: "The encoding method used to decode the text input. Default: utf-8",
      optional: true,
    },
    includePageBreaks: {
      type: "boolean",
      label: "Include Page Breaks",
      description: "If `true`, the output will include page breaks if the filetype supports it",
      optional: true,
    },
    strategy: {
      type: "string",
      label: "Strategy",
      description: "The strategy to use for partitioning PDF/image`",
      options: [
        "fast",
        "hi_res",
        "auto",
        "ocr_only",
        "od_only",
        "vlm",
      ],
      optional: true,
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "The format of the response",
      options: [
        "application/json",
        "text/csv",
      ],
      optional: true,
    },
    startingPageNumber: {
      type: "integer",
      label: "Starting Page Number",
      description: "When PDF is split into pages before sending it into the API, providing this information will allow the page number to be assigned correctly",
      optional: true,
    },
    vlmModelProvider: {
      type: "string",
      label: "VLM Model Provider",
      description: "The VLM Model provider to use",
      options: [
        "openai",
        "anthropic",
        "bedrock",
        "anthropic_bedrock",
        "vertexai",
        "google",
        "azure_openai",
      ],
      optional: true,
    },
    vlmModel: {
      type: "string",
      label: "VLM Model",
      description: "The VLM Model to use. Example: `gpt-4o`",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const form = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);

    form.append("files", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    form.append("content_type", metadata.contentType);
    if (this.coordinates) form.append("coordinates", this.coordinates
      ? "true"
      : "false");
    if (this.encoding) form.append("encoding", this.encoding);
    if (this.includePageBreaks) form.append("include_page_breaks", this.includePageBreaks
      ? "true"
      : "false");
    if (this.strategy) form.append("strategy", this.strategy);
    if (this.outputFormat) form.append("output_format", this.outputFormat);
    if (this.startingPageNumber) form.append("starting_page_number", this.startingPageNumber);
    if (this.vlmModelProvider) form.append("vlm_model_provider", this.vlmModelProvider);
    if (this.vlmModel) form.append("vlm_model", this.vlmModel);

    const response = await this.unstructured.extractFile({
      $,
      data: form,
      headers: form.getHeaders(),
    });

    $.export("$summary", "Successfully extracted file.");
    return response;
  },
};
