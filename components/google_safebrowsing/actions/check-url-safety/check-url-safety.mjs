import safebrowsing from "../../google_safebrowsing.app.mjs";

export default {
  key: "google_safebrowsing-check-url-safety",
  name: "Check URL Safety",
  description: "Scan a given URL or URLs for potential security threats. [See the documentation](https://developers.google.com/safe-browsing/v4/reference/rest/v4/threatMatches/find)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    safebrowsing,
    threatTypes: {
      propDefinition: [
        safebrowsing,
        "threatTypes",
      ],
    },
    platformTypes: {
      propDefinition: [
        safebrowsing,
        "platformTypes",
        (c) => ({
          threatTypes: c.threatTypes,
        }),
      ],
    },
    threatEntryTypes: {
      propDefinition: [
        safebrowsing,
        "threatEntryTypes",
        (c) => ({
          threatTypes: c.threatTypes,
          platformTypes: c.platformTypes,
        }),
      ],
    },
    threatEntries: {
      type: "string[]",
      label: "Threat Entries",
      description: "An array of URLs to be checked",
    },
  },
  async run({ $ }) {
    const threatEntries = this.threatEntries.map((entry) => ({
      url: entry,
    }));
    const data = {
      threatInfo: {
        threatTypes: this.threatTypes,
        platformTypes: this.platformTypes,
        threatEntryTypes: this.threatEntryTypes,
        threatEntries,
      },
    };
    const response = await this.safebrowsing.findThreatMatches({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully scanned ${threatEntries.length} URL${threatEntries.length === 1
        ? ""
        : "s"}`);
    }

    return response;
  },
};
