import signerx from "../../signerx.app.mjs";

export default {
  key: "signerx-send-template-signatures",
  name: "Send Template Signatures",
  description: "Add a recipient to a template and invite to sign. [See the documentation](https://documenter.getpostman.com/view/13877745/2sa3xv9kni)",
  version: "0.0.1",
  type: "action",
  props: {
    signerx,
    packageId: {
      propDefinition: [
        signerx,
        "packageId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the recipient",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the recipient",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the recipient",
    },
  },
  async run({ $ }) {
    const response = await this.signerx.addRecipientToTemplate({
      $,
      packageId: this.packageId,
      data: {
        id: this.packageId,
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
      },
    });
    $.export("$summary", `Successfully added recipient ${this.firstName} ${this.lastName} to package ${this.packageId}`);
    return response;
  },
};
