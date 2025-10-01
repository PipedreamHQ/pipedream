import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-create-key-value-pairs",
  name: "Create Key/Value Pairs",
  description: "Create new Key/Value pairs in a Namespace. [See the documentation](https://developers.cloudflare.com/api/node/resources/kv/subresources/namespaces/methods/bulk_update/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.cloudflare.createKeyValuePair({
      namespaceId: this.namespace,
      body: data,
    });

    $.export("$summary", `Successfully created value in namespace with ID ${this.namespace}`);

    return response;
  },
};
