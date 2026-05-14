import { axios } from "@pipedream/platform";
import datadog from "../../datadog.app.mjs";
import regions from "../../common/constants.mjs";

export default {
  key: "datadog-get-account-info",
  name: "Get Account Info",
  description:
    "Detect the Datadog region for the connected account."
    + " Call this FIRST before any other Datadog tool if"
    + " you do not already know the region. Returns the"
    + " region domain (e.g. `datadoghq.com`) which must"
    + " be passed as the `region` parameter to"
    + " **Search Logs**, **Search Monitors**,"
    + " **Get Metric Data**, and all other Datadog tools."
    + " [See the docs](https://docs.datadoghq.com/api/"
    + "latest/authentication/#validate-api-key)",
  version: "1.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    datadog,
  },
  async run({ $ }) {
    for (const {
      label, value: region,
    } of regions.REGION_OPTIONS) {
      try {
        await axios($, {
          url: `https://api.${region}/api/v1/validate`,
          headers: {
            "DD-API-KEY": this.datadog.$auth.api_key,
          },
        });
        $.export(
          "$summary",
          `Detected region: ${label} (${region})`,
        );
        return {
          region,
          label,
          api_url: `https://api.${region}`,
        };
      } catch {
        // Key not valid for this region, try next
      }
    }

    throw new Error(
      "Could not detect region. API key validation failed for all regions.",
    );
  },
};
