import workamajig from "../../workamajig.app.mjs";

export default {
  key: "workamajig-create-activity",
  name: "Create Activity",
  description: "Initiates the creation of a fresh activity in Workamajig",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    workamajig,
    leadType: {
      propDefinition: [
        workamajig,
        "leadType",
      ],
      optional: true,
    },
    opportunityId: {
      propDefinition: [
        workamajig,
        "opportunityId",
      ],
    },
    activityDetails: {
      propDefinition: [
        workamajig,
        "activityDetails",
      ],
    },
    companyDetails: {
      propDefinition: [
        workamajig,
        "companyDetails",
      ],
    },
    contactId: {
      propDefinition: [
        workamajig,
        "contactId",
      ],
    },
    newContactDetails: {
      propDefinition: [
        workamajig,
        "newContactDetails",
      ],
    },
  },
  async run({ $ }) {
    const activity = await this.workamajig.createActivity({
      activityDetails: this.activityDetails,
    });
    const company = await this.workamajig.createCompany({
      companyDetails: this.companyDetails,
    });
    const contact = await this.workamajig.updateContact({
      contactId: this.contactId,
      newContactDetails: this.newContactDetails,
    });

    $.export("$summary", `Successfully created activity with ID ${activity.id}, company with ID ${company.id}, and updated contact with ID ${contact.id}`);
    return {
      activity,
      company,
      contact,
    };
  },
};
