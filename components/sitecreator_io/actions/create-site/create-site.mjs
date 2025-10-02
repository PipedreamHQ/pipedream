import sitecreator from "../../sitecreator_io.app.mjs";
import constants from "../common/constants.mjs";
import * as locale from "locale-codes";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "sitecreator_io-create-site",
  name: "Create Site",
  description: "Create a new website. [See the docs here](http://api-doc.sitecreator.io/#tag/Site/operation/postSite)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sitecreator,
    siteUrl: {
      type: "string",
      label: "Site Domain",
      description: "Domain name of the new site. This is what will appear between \"https://\" and \".sitecreator.io\". Example: `https://<your-site-domain>.sitecreator.io`",
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
      optional: true,
      default: "empty",
    },
    accent: {
      type: "string",
      label: "Accent",
      description: "Site Style accent color",
      optional: true,
      default: constants.SITE_STYLE_DEFAULTS.ACCENT,
    },
    gradientBg: {
      type: "string",
      label: "Grandient Background",
      description: "Site Style gradient background color",
      optional: true,
      default: constants.SITE_STYLE_DEFAULTS.GRADIENTBG,
    },
    gradientImage: {
      type: "string",
      label: "Grandient Image",
      description: "Site Style gradient image",
      optional: true,
      default: constants.SITE_STYLE_DEFAULTS.GRANDIENTIMAGE,
    },
    lightBg: {
      type: "string",
      label: "Light Background",
      description: "Site Style light background color",
      optional: true,
      default: constants.SITE_STYLE_DEFAULTS.LIGHTBG,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Site Style name",
      optional: true,
      default: constants.SITE_STYLE_DEFAULTS.NAME,
    },
    primaryBg: {
      type: "string",
      label: "Primary Background",
      description: "Site Style primary background color",
      optional: true,
      default: constants.SITE_STYLE_DEFAULTS.PRIMARYBG,
    },
    primaryText: {
      type: "string",
      label: "Primary Text",
      description: "Site Style primary text color",
      optional: true,
      default: constants.SITE_STYLE_DEFAULTS.PRIMARYTEXT,
    },
    secondaryBg: {
      type: "string",
      label: "Secondary Background",
      description: "Site Style secondary background color",
      optional: true,
      default: constants.SITE_STYLE_DEFAULTS.SECONDARYBG,
    },
    secondaryText: {
      type: "string",
      label: "Sedondary Text",
      description: "Site Style secondary text color",
      optional: true,
      default: constants.SITE_STYLE_DEFAULTS.SECONDARYTEXT,
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
    if (this.siteUrl.includes(".")) {
      throw new ConfigurationError("Site Domain cannot contain periods.");
    }

    if (!(await this.checkAvailability(this.siteUrl))) {
      throw new Error("Domain already in use");
    }

    const data = {
      siteName: this.siteName,
      siteUrl: this.siteUrl,
      language: this.language,
      siteData: this.siteData,
      siteStyle: {
        accent: this.accent,
        gradientBg: this.gradientBg,
        gradientImage: this.gradientImage,
        lightBg: this.lightBg,
        name: this.name,
        primaryBg: this.primaryBg,
        primaryText: this.primaryText,
        secondaryBg: this.secondaryBg,
        secondaryText: this.secondaryText,
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
