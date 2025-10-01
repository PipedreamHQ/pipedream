// legacy_hash_id: a_vgi821
import { axios } from "@pipedream/platform";

export default {
  key: "kvdb-get-key-value",
  name: "Get a Key Value",
  description: "KVDB is designed for quick and easy integration into projects that need a globally accessible key-value database. To get started, create at API key at https://kvdb.io/",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kvdb: {
      type: "app",
      app: "kvdb",
    },
    key: {
      type: "string",
    },
  },
  async run({ $ }) {
    const config = {
      url: `https://kvdb.io/${this.kvdb.$auth.api_key}/${this.key}`,
    };
    return await axios($, config);
  },
};
