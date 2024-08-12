import cloudpresenter from "../../cloudpresenter.app.mjs";

export default {
  key: "cloudpresenter-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact within the Cloudpresenter application.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cloudpresenter,
    contactId: {
      propDefinition: [
        cloudpresenter,
        "contactId",
      ],
    },
    contactDetails: {
      propDefinition: [
        cloudpresenter,
        "contactDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cloudpresenter.updateContact(this.contactId, this.contactDetails);
    $.export("$summary", `Successfully updated contact with ID: ${this.contactId}`);
    return response;
  },
};
