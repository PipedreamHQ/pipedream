// legacy_hash_id: a_bKiP3K
import { axios } from "@pipedream/platform";

export default {
  key: "kvdb-set-key-value",
  name: "Set a Key Value",
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
      description: "The maximum length of a key is 128 bytes.",
    },
    value: {
      type: "string",
    },
  },
  async run({ $ }) {
    const config = {
      method: "post",
      url: `https://kvdb.io/${this.kvdb.$auth.api_key}/${this.key}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: this.value,
    };
    return await axios($, config);
  },
};
