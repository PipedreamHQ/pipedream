import esignatures_io from "../../esignatures_io.app.mjs";

export default {
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "esignatures_io-create-contract",
  name: "Create Contract",
  description: "Creates a contract and sends the links (via email or SMS) to the signers to collect their signatures. [See docs here](https://esignatures.io/docs/api#contracts)",
  type: "action",
  props: {
    esignatures_io,
    templateId: {
      propDefinition: [
        esignatures_io,
        "templateId",
      ],
    },
    title: {
      label: "Title",
      description: "The title of the contract",
      type: "string",
    },
    signers: {
      label: "Signers",
      description: "A list of the signers. E.g `{ \"name\": \"Lucas Caresia\", \"email\": \"user@email.com\", \"company_name\": \"Pipedream\" }`",
      type: "string[]",
    },
    customWebhookUrl: {
      label: "Custom Webhook URL",
      description: "The Custom webhook URL to be used for the webhook notifications instead of the default one specified on your API page",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedSigners = Array.isArray(this.signers)
      ? this.signers.map((signer) => typeof signer === "string"
        ? JSON.parse(signer)
        : signer)
      : JSON.parse(this.signers);

    const response = await this.esignatures_io.createContract({
      $,
      data: {
        template_id: this.templateId,
        title: this.title,
        custom_webhook_url: this.customWebhookUrl,
        signers: parsedSigners,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created contract with ID ${response.contract.id}`);
    }

    return response;
  },
};
