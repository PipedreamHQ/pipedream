import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-create-key-value-pairs",
  name: "Create Key/Value Pairs",
  description: "Create new Key/Value pairs in a Namespace. [See the docs here](https://api.cloudflare.com/#workers-kv-namespace-write-key-value-pair)",
  version: "0.0.1",
  type: "action",
  props: {
    cloudflare,
    account: {
      propDefinition: [
        cloudflare,
        "accountIdentifier",
      ],
      description: "The account to add the new key/value pairs to",
    },
    namespace: {
      propDefinition: [
        cloudflare,
        "namespace",
        (c) => ({
          accountId: c.account,
        }),
      ],
    },
    values: {
      type: "object",
      label: "Values",
      description: "The values to store",
    },
  },
  async run({ $ }) {
    const data = [];
    for (const [
      key,
      value,
    ] of Object.entries(this.values)) {
      data.push({
        key,
        value,
      });
    }
    const response = await this.cloudflare.createKeyValuePair(this.account, this.namespace, data);

    $.export("$summary", `Successfully created value in namespace with ID ${this.namespace}`);

    return response;
  },
};
