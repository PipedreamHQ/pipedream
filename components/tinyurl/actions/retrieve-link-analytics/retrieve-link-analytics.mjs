import { ConfigurationError } from "@pipedream/platform";
import tinyurl from "../../tinyurl.app.mjs";

export default {
  key: "tinyurl-retrieve-link-analytics",
  name: "Retrieve Link Analytics",
  description: "Retrieves analytics for a specific TinyURL link, including total clicks, geographic breakdowns, and device types. [See the documentation]()",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tinyurl,
    alert: {
      type: "alert",
      alertType: "info",
      content: "This action is only allowed for paid accounts.",
    },
    domain: {
      propDefinition: [
        tinyurl,
        "domain",
      ],
    },
    urls: {
      propDefinition: [
        tinyurl,
        "urls",
        ({ domain }) => ({
          domain,
        }),
      ],
    },
    from: {
      type: "string",
      label: "From",
      description: "The start datetime of analitics report",
    },
    to: {
      type: "string",
      label: "To",
      description: "The end datetime of analitics report. Default is now",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Tag to get analytics for",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const analytics = await this.tinyurl.retrieveAnalytics({
        $,
        params: {
          from: this.from,
          to: this.to,
          alias: this.urls,
          tag: this.tag,
        },
      });
      $.export("$summary", `Retrieved analytics for link ${this.urls}`);
      return analytics;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.errors[0]);
    }
  },
};
