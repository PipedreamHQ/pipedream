import fastaf from "../../fastaf.app.mjs";

export default {
  key: "fastaf-extract",
  name: "Extract Page Data",
  description: "Extract data from one public page using an AI prompt or extraction rules. Adds 10 credits to the selected scrape mode. [Documentation](https://fastaf.co/docs/#scrape)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fastaf,
    url: {
      propDefinition: [
        fastaf,
        "url",
      ],
    },
    dynamic: {
      propDefinition: [
        fastaf,
        "dynamic",
      ],
    },
    premium: {
      propDefinition: [
        fastaf,
        "premium",
      ],
    },
    proxyCountry: {
      propDefinition: [
        fastaf,
        "proxyCountry",
      ],
    },
    wait: {
      propDefinition: [
        fastaf,
        "wait",
      ],
    },
    challengeMode: {
      propDefinition: [
        fastaf,
        "challengeMode",
      ],
    },
    aiQuery: {
      propDefinition: [
        fastaf,
        "aiQuery",
      ],
    },
    aiExtractRules: {
      propDefinition: [
        fastaf,
        "aiExtractRules",
      ],
    },
  },
  async run({ $ }) {
    if (!this.aiQuery?.trim() && !Object.keys(this.aiExtractRules || {}).length) {
      throw new Error("Provide an extraction prompt or nonempty extraction rules.");
    }
    const { data } = await this.fastaf.scrape({
      $,
      data: {
        url: this.url,
        dynamic: this.dynamic,
        premium: this.premium,
        country: this.proxyCountry,
        wait: this.wait,
        challenge_mode: this.challengeMode,
        ai_query: this.aiQuery,
        ai_extract_rules: this.aiExtractRules
          ? JSON.stringify(this.aiExtractRules)
          : undefined,
      },
    });
    $.export("$summary", "Successfully extracted data from one public page.");
    return typeof data === "string"
      ? {
        content: data,
      }
      : data;
  },
};
