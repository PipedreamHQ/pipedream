// legacy_hash_id: a_vgid7B
import { axios } from "@pipedream/platform";

export default {
  key: "adalo-get-all-collections-records",
  name: "Get all collection records",
  description: "Get all collection records",
  version: "0.1.1",
  type: "action",
  props: {
    adalo: {
      type: "app",
      app: "adalo",
    },
    collectionId: {
      type: "string",
      description: "Id of collection for getting data",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.adalo.com/v0/apps/${this.adalo.$auth.appId}/collections/${this.collectionId}`,
      headers: {
        "Authorization": `Bearer ${this.adalo.$auth.api_key}`,
        "Content-Type": "application/json",
      },
    });
  },
};
