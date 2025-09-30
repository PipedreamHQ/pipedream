import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-delete-lead",
  name: "Delete Lead",
  description: "Deletes an existing lead from InsertChat. [See the documentation](https://www.postman.com/gold-star-239225/insertchat/request/2vgc20j/delete-a-lead)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.insertchat.deleteLead({
      $,
      leadId: this.leadId,
    });
    $.export("$summary", `Successfully deleted lead with ID: ${this.leadId}`);
    return response;
  },
};
