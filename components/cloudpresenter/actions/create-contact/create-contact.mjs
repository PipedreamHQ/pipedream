import cloudpresenter from "../../cloudpresenter.app.mjs";

export default {
  key: "cloudpresenter-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within the Cloudpresenter application",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cloudpresenter,
    newContactDetails: {
      propDefinition: [
        cloudpresenter,
        "newContactDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cloudpresenter.createContact(this.newContactDetails);
    $.export("$summary", `Successfully created contact with ID: ${response.id}`);
    return response;
  },
};
