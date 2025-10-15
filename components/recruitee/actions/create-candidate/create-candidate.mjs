import app from "../../recruitee.app.mjs";

export default {
  name: "Create Candidate",
  description: "Create a new candidate. [See the documentation](https://api.recruitee.com/docs/index.html#candidate.web.candidate-candidate.web.candidate)",
  key: "recruitee-create-candidate",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Full Name",
      description: "The full name of the candidate",
    },
    phones: {
      label: "Phones",
      description: "The candidate's phone number. e.g. `+12223334444`",
      type: "string[]",
      optional: true,
    },
    emails: {
      label: "Emails",
      description: "The candidate's email",
      type: "string[]",
      optional: true,
    },
    socialLinks: {
      label: "Social Media Profiles",
      description: "The candidate's social media profiles",
      type: "string[]",
      optional: true,
    },
    links: {
      label: "Links",
      description: "The candidate's external links",
      type: "string[]",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      name: this.name,
      phones: this.phones,
      emails: this.emails,
      social_links: this.socialLinks,
      links: this.links,
    };
    const response = await this.app.createCandidate({
      $,
      data: {
        candidate: payload,
      },
    });
    $.export("$summary", `Successfully created candidate with ID \`${response.candidate.id}\``);
    return response;
  },
};
