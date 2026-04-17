import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-reveal-contact",
  name: "Reveal Contact",
  description: "Reveal email or phone number for a person (uses credits). [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/redeem/people)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pubrio,
    peopleSearchId: {
      type: "string",
      label: "People Search ID",
      description: "Pubrio people search ID (provide this or LinkedIn URL)",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "Person LinkedIn URL (provide this or People Search ID)",
      optional: true,
    },
    peopleContactTypes: {
      type: "string[]",
      label: "Contact Types",
      description: "Types of contact info to reveal",
      options: [
        "email-work",
        "email-personal",
        "phone",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.peopleSearchId && !this.linkedinUrl) {
      throw new Error("Either People Search ID or LinkedIn URL must be provided");
    }
    const data = {};
    if (this.peopleSearchId) data.people_search_id = this.peopleSearchId;
    if (this.linkedinUrl) data.linkedin_url = this.linkedinUrl;
    if (this.peopleContactTypes?.length) data.people_contact_types = this.peopleContactTypes;
    const response = await this.pubrio.revealContact({
      $,
      data,
    });
    $.export("$summary", `Successfully revealed contact for ${this.peopleSearchId || this.linkedinUrl}`);
    return response;
  },
};
