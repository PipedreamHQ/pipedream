import donately from "../../donately.app.mjs";

export default {
  key: "donately-get-donation",
  name: "Get Donation",
  description: "Get a donation by ID. [See the documentation](https://developer.donate.ly/api/#donations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    donately,
    donationId: {
      propDefinition: [
        donately,
        "donationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.donately.getDonation({
      $,
      donationId: this.donationId,
    });
    $.export("$summary", `Found donation ${response?.data?.id}`);
    return response;
  },
};
