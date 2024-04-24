import vryno from "../../vryno.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vryno-create-unique-lead",
  name: "Create Unique Lead",
  description: "Creates a unique lead in the Vryno system, ensuring no duplication of lead details. [See the documentation]()", // Placeholder for documentation link
  version: "0.0.1",
  type: "action",
  props: {
    vryno,
    name: vryno.propDefinitions.name,
    email: vryno.propDefinitions.email,
    phoneNumber: vryno.propDefinitions.phoneNumber,
    source: vryno.propDefinitions.source,
    interest: vryno.propDefinitions.interest,
  },
  async run({ $ }) {
    // Check for duplicate lead
    const duplicateCheck = await this.vryno.checkLeadDuplicate({
      email: this.email,
      phoneNumber: this.phoneNumber,
    });

    if (duplicateCheck.data && duplicateCheck.data.exists) {
      $.export("$summary", "A lead with the same email and phone number already exists.");
      return duplicateCheck.data;
    }

    // Create the lead if no duplicate was found
    const response = await this.vryno.createLead({
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      source: this.source,
      interest: this.interest,
    });

    $.export("$summary", `Successfully created unique lead with email ${this.email}`);
    return response;
  },
};
