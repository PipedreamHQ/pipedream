import bigmailer from "../../bigmailer.app.mjs";

export default {
  key: "bigmailer-send-transactional-email",
  name: "Send Transactional Email",
  description: "Sends an email as part of a transactional campaign. [See the documentation](https://docs.bigmailer.io/reference/sendtransactionalcampaign)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bigmailer,
    brandId: {
      propDefinition: [
        bigmailer,
        "brandId",
      ],
    },
    campaignId: {
      propDefinition: [
        bigmailer,
        "campaignId",
        (c) => ({
          brandId: c.brandId,
        }),
      ],
    },
    email: {
      propDefinition: [
        bigmailer,
        "email",
        (c) => ({
          brandId: c.brandId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bigmailer.sendTransactionalCampaign({
      brandId: this.brandId,
      campaignId: this.campaignId,
      data: {
        email: this.email,
      },
    });
    if (response) {
      $.export("$summary", "Email sent successfully");
    }
    return response;
  },
};
