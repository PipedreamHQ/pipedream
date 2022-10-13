import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-create-namespace",
  name: "Create Namespace",
  description: "Create a new Namespace in an account. [See the docs here](https://api.cloudflare.com/#workers-kv-namespace-create-a-namespace)",
  version: "0.0.1",
  type: "action",
  props: {
    cloudflare,
    account: {
      propDefinition: [
        cloudflare,
        "accountIdentifier",
      ],
      description: "The account to add the new Namespace within",
    },
    title: {
      type: "string",
      label: "Title",
      description: "A human-readable string name for the new Namespace",
    },
  },
  async run({ $ }) {
    const response = await this.cloudflare.createNamespace(this.account, {
      title: this.title,
    });

    $.export("$summary", `Successfully created namespace with ID ${response.result.id}`);

    return response;
  },
};
