import espoCrm from "../../espo-crm.app.mjs";

export default {
  key: "espo-crm-create-contact",
  name: "Create Contact in Espo CRM",
  description: "Creates a new contact in Espo CRM with the provided details",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    espoCrm,
    contactName: espoCrm.propDefinitions.contactName,
    contactEmail: espoCrm.propDefinitions.contactEmail,
    contactPhone: espoCrm.propDefinitions.contactPhone,
    contactAddress: espoCrm.propDefinitions.contactAddress,
    contactJobTitle: espoCrm.propDefinitions.contactJobTitle,
    contactCompany: espoCrm.propDefinitions.contactCompany,
  },
  async run({ $ }) {
    const contactData = {
      name: this.contactName,
      email: this.contactEmail,
      phone: this.contactPhone,
      address: this.contactAddress,
      jobTitle: this.contactJobTitle,
      company: this.contactCompany,
    };

    const response = await this.espoCrm.createContact({
      data: contactData,
    });
    $.export("$summary", `Successfully created contact ${this.contactName}`);
    return response;
  },
};
