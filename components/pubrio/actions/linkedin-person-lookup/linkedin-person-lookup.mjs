import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-linkedin-person-lookup",
  name: "People LinkedIn Lookup",
  description: "Real-time LinkedIn person lookup. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    destructiveHint: false,
  },
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
    $.export("$summary", "Successfully looked up LinkedIn person");
    return response;
  },
};
