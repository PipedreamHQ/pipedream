import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-create-lead",
  name: "Create Lead",
  description: "Creates a new lead within Insertchat.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    insertchat,
    leadContactInfo: {
      propDefinition: [
        insertchat,
        "leadContactInfo",
      ],
    },
    leadStatus: {
      propDefinition: [
        insertchat,
        "leadStatus",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.insertchat.createNewLead(this.leadContactInfo, this.leadStatus);
    $.export("$summary", `Created lead with ID: ${response.id}`);
    return response;
  },
};
