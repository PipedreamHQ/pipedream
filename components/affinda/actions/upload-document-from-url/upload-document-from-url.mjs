import { axios } from "@pipedream/platform";

export default defineComponent({
  key: "affinda-upload-document-file",
  name: "Upload Document for Parsing",
  description: "Uploads a document for parsing in Affinda. [See docs here](https://docs.affinda.com/reference/createdocument)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    affinda: {
      type: "app",
      app: "affinda",
    },
    organization: {
      type: "string",
      label: "Organization",
      async options() {
        const response = await this.makeApiRequest({
          url: `https://${this.affinda.$auth.api}.affinda.com/v3/organizations`,
        });
        return response.map((org) => ({ label: org.name, value: org.identifier }));
      },
    },
    workspace: {
      type: "string",
      label: "Workspace",
      async options({ organization }) {
        const response = await this.makeApiRequest({
          url: `https://${this.affinda.$auth.api}.affinda.com/v3/workspaces`,
          params: { organization: this.organization },
        });
        return response.map((workspace) => ({ label: workspace.name, value: workspace.identifier }));
      },
    },
    collection: {
      type: "string",
      label: "Collection",
      async options({ workspace }) {
        const response = await this.makeApiRequest({
          url: `https://${this.affinda.$auth.api}.affinda.com/v3/collections`,
          params: { workspace: this.workspace },
        });
        return response.map((collection) => ({ label: collection.name, value: collection.identifier }));
      },
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL to download the document.",
    },
    wait: {
      type: "boolean",
      label: "Wait",
      description: 'If "true" (default), will return a response only after processing has completed. If "false", will return an empty data object which can be polled at the GET endpoint until processing is complete.',
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
      description: 'If "true", parsing will fail when the uploaded document is duplicate of an existing document, no credits will be consumed. If "false", will parse the document normally whether its a duplicate or not. If not provided, will fallback to the workspace settings.',
      optional: true,
    },
    regionBias: {
      type: "string",
      label: "Region Bias",
      description: "A JSON representation of the RegionBias object.",
      optional: true,
    },
    lowPriority: {
      type: "boolean",
      label: "Low Priority",
      description: "Explicitly mark this document as low priority.",
      optional: true,
    },
  },
  methods: {
    async makeApiRequest(config) {
      return await axios(this, {
        headers: {
          Authorization: `Bearer ${this.affinda.$auth.api_key}`,
          "Accept": `application/json`,
        },
        ...config,
      });
    },
  },
  async run({ steps, $ }) {
    const response = await this.makeApiRequest({
      method: "POST",
      url: `https://${this.affinda.$auth.api}.affinda.com/v3/documents`,
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
});
