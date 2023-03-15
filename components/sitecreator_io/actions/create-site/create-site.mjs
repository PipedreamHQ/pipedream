import sitecreator from "../../sitecreator_io.app.mjs";
import * as locale from "locale-codes";

export default {
  key: "sitecreator_io-create-site",
  name: "Create Site",
  description: "Create a new website. [See the docs here](http://api-doc.sitecreator.io/#tag/Site/operation/postSite)",
  version: "0.0.1",
  type: "action",
  props: {
    sitecreator,
    siteUrl: {
      type: "string",
      label: "Site URL",
      description: "Domain name of the new site",
    },
    siteName: {
      type: "string",
      label: "Name",
      description: "Name of the new site",
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code for the new site",
      optional: true,
      default: "en-US",
      async options() {
        return locale.all.map(({
          name, tag,
        }) => ({
          label: name,
          value: tag,
        }));
      },
    },
    siteData: {
      type: "string",
      label: "Site Data",
      description: "Site data for the new site",
    },
  },
  methods: {
    async checkAvailability(siteUrl) {
      return this.sitecreator.checkAvailability({
        data: {
          siteUrl,
        },
      });
    },
  },
  async run({ $ }) {
    if (!(await this.checkAvailability(this.siteUrl))) {
      throw new Error("Domain already in use");
    }

    const data = {
      siteName: this.siteName,
      siteUrl: this.siteUrl,
      language: this.language,
      siteData: this.siteData,
      siteStyle: {
        accent: "#536DFE",
        gradientBg: "#9c27b0",
        gradientImage: "radial-gradient(circle at 50% 60%, #f44336, #e91e63, #9c27b0 100%)",
        lightBg: "#f4f4f4",
        name: "Purple Indigo",
        primaryBg: "#9C27B0",
        primaryText: "#ffffff",
        secondaryBg: "#7B1FA2",
        secondaryText: "#000000",
      },
    };

    const response = await this.sitecreator.createSite({
      data,
      $,
    });

    $.export("$summary", `Successfully created site with ID ${response.siteId}`);

    return response;
  },
};
