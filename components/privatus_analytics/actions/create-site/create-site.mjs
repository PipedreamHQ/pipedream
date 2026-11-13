import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-create-site",
  name: "Create Site",
  description: "Adds a website to the workspace and returns its tracking snippet. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  props: {
    app,
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain to track, like `example.com`. A pasted address such as `https://www.example.com/pricing` is shortened to `example.com`.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Display name. Defaults to the normalized domain.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone name such as Europe/Berlin or America/New_York. Defaults to the workspace timezone.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "3-letter ISO 4217 code such as USD or EUR used for revenue. Defaults to the workspace currency.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: await this.app.workspacePath({
        $,
        path: "/sites.json",
      }),
      data: utils.compact({
        domain: utils.normalizeDomain(this.domain),
        name: this.name,
        timezone: this.timezone,
        currency: this.currency,
      }),
    });
    $.export("$summary", `Successfully created site '${response.domain}'`);
    return response;
  },
};
