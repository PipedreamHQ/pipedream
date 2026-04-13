import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-linkedin-person-lookup",
  name: "People LinkedIn Lookup",
  description: "Real-time LinkedIn person lookup. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/people/linkedin_lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    peopleLinkedinUrl: {
      type: "string",
      label: "People LinkedIn URL",
      description: "Person LinkedIn URL to look up",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.linkedinPersonLookup({
      $,
      data: {
        people_linkedin_url: this.peopleLinkedinUrl,
      },
    });
    $.export("$summary", `Successfully looked up LinkedIn person: ${this.peopleLinkedinUrl}`);
    return response;
  },
};
