import amazonSellingPartner from "../../amazon_selling_partner.app.mjs";

export default {
  key: "amazon_selling_partner-rotate-client-secret",
  name: "Rotate Client Secret",
  description: "Rotates the application client secret using the Application Management API. The new secret will be sent to your pre-registered Amazon SQS queue. **IMPORTANT:** The old credential expires after 7 days. [See the documentation](https://developer-docs.amazon.com/sp-api/docs/application-management-api#rotateapplicationclientsecret)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    amazonSellingPartner,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    prerequisites: {
      type: "alert",
      alertType: "info",
      content: "Rotates application client secrets for a developer application. Developers must register a destination queue in the developer console before calling this operation. When this operation is called a new client secret is generated and sent to the developer-registered queue",
    },
  },
  async run({ $ }) {
    const response = await this.amazonSellingPartner.rotateClientSecret({
      $,
    });

    $.export("$summary", "Successfully rotated client secret");

    return {
      success: true,
      response,
    };
  },
};
