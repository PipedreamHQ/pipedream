import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-get-site-info",
  name: "Get Site Info",
  description:
    "Returns identity and configuration details for the connected Mindbody site, including name, site ID, timezone, phone, and address."
    + " Use this as the identity anchor — call it first to discover the site name, ID, and timezone before querying other resources."
    + " Also provides location IDs needed by **List Staff**, **Get Classes**, and **Book Appointment**."
    + " [See the documentation](https://developers.mindbodyonline.com/PublicDocumentation/V6#tag/Site/operation/SiteService_GetSites)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getSiteInfo({
      $,
    });
    const sites = response.Sites || [];
    const site = sites[0] || {};
    $.export("$summary", `Connected to site: ${site.Name || "Unknown"} (ID: ${site.Id || "N/A"})`);
    return response;
  },
};
