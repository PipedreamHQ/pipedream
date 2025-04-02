import sailpoint from "../../sailpoint.app.mjs";

export default {
  key: "sailpoint-list-certification-campaigns",
  name: "List Certification Campaigns",
  description: "Retrieves multiple certification campaigns in IdentityNow. [See the documentation](https://developer.sailpoint.com/docs/api/v2024/get-active-campaigns)",
  version: "0.0.1",
  type: "action",
  props: {
    sailpoint,
    filter: {
      propDefinition: [
        "sailpoint",
        "filter",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.sailpoint.paginate({
      fn: this.sailpoint.listCertificationCampaigns,
      params: {
        detail: "full",
      },
    });

    const responseArray = [];

    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully retrieved ${responseArray.length} certification campaigns`);
    return responseArray;
  },
};
