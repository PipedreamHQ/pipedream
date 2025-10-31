import app from "../../tomba.app.mjs";

export default {
  key: "tomba-linkedin-finder",
  name: "LinkedIn Finder",
  description:
    "Generate or retrieve the most likely email address from a LinkedIn URL. [See the documentation](https://tomba.io/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.linkedinFinder({
      $,
      linkedinUrl: this.linkedinUrl,
    });

    $.export(
      "$summary",
      `Successfully found email from LinkedIn profile: ${this.linkedinUrl}`,
    );
    return response;
  },
};
