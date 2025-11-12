import affinda from "../../affinda.app.mjs";

export default {
  key: "affinda-upload-document-from-url",
  name: "Upload Document for Parsing",
  description: "Uploads a document for parsing. [See docs here](https://docs.affinda.com/reference/createdocument)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    affinda,
    organization: {
      propDefinition: [
        affinda,
        "organization",
      ],
    },
    workspace: {
      propDefinition: [
        affinda,
        "workspace",
        (c) => ({
          organization: c.organization,
        }),
      ],
    },
    collection: {
      propDefinition: [
        affinda,
        "collection",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL to download the document.",
    },
    wait: {
      type: "boolean",
      label: "Wait",
      description: "If `true`, will return a response only after processing has completed. If `false`, will return an empty data object which can be polled at the GET endpoint until processing is complete. Defaults to `true`.",
      optional: true,
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "Specify a custom identifier for the document.",
      optional: true,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Optional filename of the file",
      optional: true,
    },
    expiryTime: {
      type: "string",
      label: "Expiry Time",
      description: "The date/time in ISO-8601 format when the document will be automatically deleted. Defaults to no expiry.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code in ISO 639-1 format. Must specify zh-cn or zh-tw for Chinese.",
      optional: true,
    },
    rejectDuplicates: {
      type: "boolean",
      label: "Reject Duplicates",
      description: "If `true`, parsing will fail when the uploaded document is duplicate of an existing document, no credits will be consumed. If `false`, will parse the document normally whether its a duplicate or not. If not provided, will fallback to the workspace settings.",
      optional: true,
    },
    regionBias: {
      type: "object",
      label: "Region Bias",
      description: "A JSON representation of the RegionBias object. Example: `{\"country\": \"vn\"}`",
      optional: true,
    },
    lowPriority: {
      type: "boolean",
      label: "Low Priority",
      description: "Explicitly mark this document as low priority.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (typeof this.regionBias === "string") {
      this.regionBias = JSON.parse(this.regionBias);
    }

    const response = await this.affinda.uploadDocument({
      $,
      data: {
        url: this.url,
        collection: this.collection,
        workspace: this.workspace,
        wait: this.wait,
        identifier: this.identifier,
        fileName: this.fileName,
        expiryTime: this.expiryTime,
        language: this.language,
        rejectDuplicates: this.rejectDuplicates,
        regionBias: this.regionBias,
        lowPriority: this.lowPriority,
      },
    });
    $.export("$summary", "Document uploaded successfully");
    return response;
  },
};
