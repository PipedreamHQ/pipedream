// legacy_hash_id: a_bKiPAo
import { axios } from "@pipedream/platform";

export default {
  key: "rockset-add-documents",
  name: "Add Documents",
  description: "Add documents to a collection in Rockset. Learn more at https://docs.rockset.com/rest/#adddocuments.",
  version: "0.1.2",
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
      type: "any",
      description: "Array of JSON documents. Learn more at https://docs.rockset.com/rest/#adddocuments.",
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
  async run({ $ }) {
    const data = {
      "data": this.data,
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
