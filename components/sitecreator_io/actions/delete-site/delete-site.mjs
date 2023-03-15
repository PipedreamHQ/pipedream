import sitecreator from "../../sitecreator_io.app.mjs";

export default {
  key: "sitecreator_io-delete-site",
  name: "Delete Site",
  description: "Deletes an existing website. [See the docs here](http://api-doc.sitecreator.io/#tag/Site/operation/deleteSite)",
  version: "0.0.1",
  type: "action",
  props: {
    sitecreator,
    siteId: {
      type: "string",
      label: "Site ID",
      description: "ID of the site to be deleted",
    },
  },
  async run({ $ }) {
    const response = await this.sitecreator.deleteSite(this.siteId, {
      $,
    });

    $.export("$summary", `Successfully deleted site with ID ${this.siteId}`);

    return response;
  },
};
