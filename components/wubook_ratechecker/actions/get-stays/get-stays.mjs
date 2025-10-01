import wubook from "../../wubook_ratechecker.app.mjs";

export default {
  key: "wubook_ratechecker-get-stays",
  name: "Get Stays",
  description: "Retrieve a list of stays from a competitor. [See the docs](https://wubook.net/wrpeeker/ratechecker/api_examples)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wubook,
    competitorId: {
      propDefinition: [
        wubook,
        "competitorId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wubook.getStays({
      $,
      params: {
        competitor_id: this.competitorId,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.length} stays for competitor with ID ${this.competitorId}.`);

    return response;
  },
};
