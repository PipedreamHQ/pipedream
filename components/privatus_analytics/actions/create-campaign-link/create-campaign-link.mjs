import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-create-campaign-link",
  name: "Create Campaign Link",
  description: "Saves a tagged campaign link (with UTM parameters) in the campaign URL builder and returns the full URL. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": false,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Link name, up to 120 characters.",
    },
    destination: {
      type: "string",
      label: "Destination URL",
      description: "Landing page URL, http or https, up to 2048 characters. Existing utm_ parameters in it are replaced by the ones you set.",
    },
    utmSource: {
      type: "string",
      label: "UTM Source",
      description: "Where the traffic comes from, e.g. newsletter. Lowercased, trimmed, spaces become underscores. Personal data is rejected.",
      optional: true,
    },
    utmMedium: {
      type: "string",
      label: "UTM Medium",
      description: "Marketing medium, e.g. email or cpc. Lowercased, trimmed, spaces become underscores.",
      optional: true,
    },
    utmCampaign: {
      type: "string",
      label: "UTM Campaign",
      description: "Campaign name, e.g. spring_sale. Lowercased, trimmed, spaces become underscores.",
      optional: true,
    },
    utmContent: {
      type: "string",
      label: "UTM Content",
      description: "Variant, e.g. header_button. Lowercased, trimmed, spaces become underscores.",
      optional: true,
    },
    utmTerm: {
      type: "string",
      label: "UTM Term",
      description: "Paid search keyword. Lowercased, trimmed, spaces become underscores.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for finding the link later. Up to 20, lowercased and cut at 40 characters. Comma separated entries are split.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Free text notes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/campaigns/links.json`,
      data: utils.compact({
        name: this.name,
        destination: this.destination,
        utm_source: this.utmSource,
        utm_medium: this.utmMedium,
        utm_campaign: this.utmCampaign,
        utm_content: this.utmContent,
        utm_term: this.utmTerm,
        tags: utils.toList(this.tags),
        notes: this.notes,
      }),
    });
    $.export("$summary", `Successfully created campaign link '${response.name}'`);
    return response;
  },
};
