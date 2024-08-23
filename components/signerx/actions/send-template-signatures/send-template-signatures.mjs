import signerx from "../../signerx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "signerx-send-template-signatures",
  name: "Send Template Signatures",
  description: "Add a recipient to a template and invite to sign. [See the documentation](https://documenter.getpostman.com/view/13877745/2sa3xv9kni)",
  version: "0.0.{{ts}}",
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
      propDefinition: [
        signerx,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        signerx,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        signerx,
        "lastName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.signerx.addRecipientToTemplate({
      packageId: this.packageId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    });
    $.export("$summary", `Successfully added recipient ${this.firstName} ${this.lastName} to package ${this.packageId}`);
    return response;
  },
};
