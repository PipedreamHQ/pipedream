import raisely from "../../raisely.app.mjs";

export default {
  key: "raisely-list-donations",
  name: "List Donations",
  description: "Retrieves a list of donations in Raisely. [See the documentation](https://developers.raisely.com/reference/getdonations)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    raisely,
    campaignId: {
      propDefinition: [
        raisely,
        "campaignId",
      ],
      description: "Filter donations by campaign",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const items = this.raisely.paginate({
      resourceFn: this.raisely.listDonations,
      args: {
        params: {
          campaign: this.campaignId,
          sort: "createdAt",
          order: "desc",
        },
      },
    });

    const donations = [];
    let count = 0;

    for await (const item of items) {
      donations.push(item);

      if (++count === this.maxResults) {
        break;
      }
    }

    if (donations.length) {
      $.export("$summary", `Successfully retrieved ${donations.length} donation${donations.length === 1
        ? ""
        : "s"}.`);
    }

    return donations;
  },
};
