// legacy_hash_id: a_bKiPAo
import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  key: "rockset-add-documents",
  name: "Add Documents",
  description: "Add documents to a collection in Rockset. Learn more at https://docs.rockset.com/rest/#adddocuments.",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rockset: {
      type: "app",
      app: "rockset",
    },
    data: {
      type: "string[]",
      label: "Documents",
      description: "Array of JSON documents to add, one JSON string per entry, e.g. `{\"field\":\"value\"}`. Learn more at https://docs.rockset.com/rest/#adddocuments.",
    },
    workspace: {
      type: "string",
      description: "Name of the workspace.",
    },
    collection: {
      type: "string",
      description: "Name of the collection.",
    },
  },
  methods: {
    parseDocuments(items) {
      return items?.map((item) => {
        if (typeof item !== "string") {
          return item;
        }
        try {
          return JSON.parse(item);
        } catch (error) {
          throw new ConfigurationError(`Documents: \`${item}\` is not valid JSON`);
        }
      });
    },
  },
  async run({ $ }) {
    const data = {
      "data": this.parseDocuments(this.data),
    };

    return await axios($, {
      method: "POST",
      url: `https://api.rs2.usw2.rockset.com/v1/orgs/self/ws/${this.workspace}/collections/${this.collection}/docs`,
      headers: {
        "Authorization": `ApiKey ${this.rockset.$auth.apikey}`,
      },
      data,
    });
  },
};
