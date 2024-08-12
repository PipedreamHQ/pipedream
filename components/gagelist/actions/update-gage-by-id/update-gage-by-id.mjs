import gagelist from "../../gagelist.app.mjs";

export default {
  key: "gagelist-update-gage-by-id",
  name: "Update Gage By ID",
  description: "Updates a specific gage using its ID on Gagelist",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gagelist,
    gageId: {
      propDefinition: [
        gagelist,
        "gageId",
      ],
      description: "Enter the ID of the gage you want to update",
    },
    gageInformation: {
      propDefinition: [
        gagelist,
        "gageInformation",
      ],
      description: "Enter the new information for the gage",
    },
  },
  async run({ $ }) {
    const response = await this.gagelist.updateGage(this.gageId, this.gageInformation);
    $.export("$summary", `Successfully updated gage with ID: ${this.gageId}`);
    return response;
  },
};
