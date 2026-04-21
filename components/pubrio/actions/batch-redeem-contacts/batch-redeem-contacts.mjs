import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-batch-redeem-contacts",
  name: "Batch Redeem Contacts",
  description: "Batch reveal contact information for multiple people (uses credits). [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/redeem/people/batch)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pubrio,
    peoples: {
      type: "string[]",
      label: "People",
      description: "People search IDs or LinkedIn URLs to redeem",
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
    const data = {
      peoples: this.peoples,
    };
    if (this.peopleContactTypes?.length) data.people_contact_types = this.peopleContactTypes;
    const response = await this.pubrio.batchRedeemContacts({
      $,
      data,
    });
    $.export("$summary", "Successfully submitted batch redeem request");
    return response;
  },
};
