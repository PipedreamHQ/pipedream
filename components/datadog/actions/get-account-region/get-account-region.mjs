import { axios } from "@pipedream/platform";
import datadog from "../../datadog.app.mjs";
import regions from "../../common/constants.mjs";

export default {
  key: "datadog-get-account-region",
  name: "Get Account Region",
  description:
    "Detect the Datadog region for the connected account"
    + " by validating the API key against each regional endpoint."
    + " Use this to discover the correct region before calling"
    + " other Datadog actions."
    + " [See the docs](https://docs.datadoghq.com/api/latest/"
    + "authentication/#validate-api-key)",
  version: "0.0.1",
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
