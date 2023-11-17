import realGeeks from "../../real-geeks.app.mjs";

export default {
  key: "real-geeks-create-lead",
  name: "Create Lead",
  description: "Creates a new lead in Real Geeks. [See the documentation](https://docs.realgeeks.com/api-create-lead)", // Link to the documentation should be provided here
  version: "0.0.1",
  type: "action",
  props: {
    realGeeks,
    leadName: {
      propDefinition: [
        realGeeks,
        "leadName",
      ],
    },
    leadEmail: {
      propDefinition: [
        realGeeks,
        "leadEmail",
      ],
    },
    leadPhone: {
      propDefinition: [
        realGeeks,
        "leadPhone",
      ],
    },
    leadSource: {
      propDefinition: [
        realGeeks,
        "leadSource",
      ],
    },
    leadStatus: {
      propDefinition: [
        realGeeks,
        "leadStatus",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.realGeeks.createLead({
      leadName: this.leadName,
      leadEmail: this.leadEmail,
      leadPhone: this.leadPhone,
      leadSource: this.leadSource,
      leadStatus: this.leadStatus,
    });

    $.export("$summary", `Successfully created lead: ${this.leadName}`);
    return response;
  },
};
