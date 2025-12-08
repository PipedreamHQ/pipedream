import app from "../../tomba.app.mjs";

export default {
  key: "tomba-find-linkedin-email",
  name: "Find LinkedIn Email",
  description:
    "Generate or retrieve the most likely email address from a LinkedIn URL. [See the documentation](https://docs.tomba.io/api/finder#linkedin-finder)",
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
    const response = await this.app.findLinkedIn({
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
