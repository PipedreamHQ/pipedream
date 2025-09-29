import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-fetch-ad-account",
  name: "Fetch Ad Account",
  description: "Fetches an individual adAccount given its id. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-accounts#fetch-ad-account)",
  version: "0.1.10",
  type: "action",
  props: {
    linkedin,
    adAccountId: {
      propDefinition: [
        linkedin,
        "adAccountId",
      ],
      description: "ID of the adAccount to fetch.",
    },
  },
  async run({ $ }) {
    const response = await this.linkedin.getAdAccount(encodeURIComponent(this.adAccountId), {
      $,
    });

    $.export("$summary", "Successfully retrieved Ad Account");

    return response;
  },
};
