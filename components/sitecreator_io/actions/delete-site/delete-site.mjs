import sitecreator from "../../sitecreator_io.app.mjs";

export default {
  key: "sitecreator_io-delete-site",
  name: "Delete Site",
  description: "Deletes an existing website. [See the docs here](http://api-doc.sitecreator.io/#tag/Site/operation/deleteSite)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sitecreator,
    siteId: {
      propDefinition: [
        sitecreator,
        "siteId",
      ],
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
