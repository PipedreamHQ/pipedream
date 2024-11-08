import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-delete-lead",
  name: "Delete Lead",
  description: "Deletes an existing lead from InsertChat. [See the documentation](https://docs.insertchat.com/)",
  version: "0.0.1",
  type: "action",
  props: {
    insertchat,
    leadId: {
      propDefinition: [
        insertchat,
        "leadId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.insertchat.deleteLead(this.leadId);
    $.export("$summary", `Successfully deleted lead with ID: ${this.leadId}`);
    return response;
  },
};
