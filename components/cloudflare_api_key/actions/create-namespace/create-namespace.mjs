import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-create-namespace",
  name: "Create Namespace",
  description: "Create a new Namespace in an account. [See the documentation](https://developers.cloudflare.com/api/node/resources/kv/subresources/namespaces/methods/create/)",
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
      description: "The account to add the new Namespace within",
    },
    title: {
      type: "string",
      label: "Title",
      description: "A human-readable string name for the new Namespace",
    },
  },
  async run({ $ }) {
    const {
      cloudflare,
      account,
      title,
    } = this;

    const response = await cloudflare.createNamespace({
      account_id: account,
      title,
    });

    $.export("$summary", `Successfully created namespace with ID \`${response.result.id}\``);

    return response;
  },
};
