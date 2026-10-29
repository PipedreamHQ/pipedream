import fastaf from "../../fastaf.app.mjs";

export default {
  key: "fastaf-scrape",
  name: "Scrape Page",
  description: "Fetch a public page as HTML, markdown, links, images or an AI summary. [Documentation](https://fastaf.co/docs/#scrape)",
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
    formats: {
      type: "string",
      label: "Output Format",
      description: "One format. Default HTML; summary adds 10 AI credits. Reddit supports HTML/markdown only. [Documentation](https://fastaf.co/docs/#scrape)",
      options: [
        "html",
        "markdown",
        "links",
        "images",
        "summary",
      ],
      default: "html",
      optional: true,
    },
    sessionNumber: {
      type: "string",
      label: "Proxy Session",
      description: "Repeat the same identifier to reuse a proxy IP; sessions expire after 60 seconds of inactivity. No extra credits. Ignored for Reddit. [Documentation](https://fastaf.co/docs/#scrape)",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.fastaf.scrape({
      $,
      data: {
        url: this.url,
        dynamic: this.dynamic,
        premium: this.premium,
        country: this.proxyCountry,
        wait: this.wait,
        challenge_mode: this.challengeMode,
        formats: this.formats,
        session_number: this.sessionNumber,
      },
    });
    $.export("$summary", "Successfully scraped one public page.");
    return typeof data === "string"
      ? {
        content: data,
      }
      : data;
  },
};
