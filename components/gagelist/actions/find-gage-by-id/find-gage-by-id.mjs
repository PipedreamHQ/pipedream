import gagelist from "../../gagelist.app.mjs";

export default {
  key: "gagelist-find-gage-by-id",
  name: "Find Gage by ID",
  description: "Finds and retrieves a gage based on its ID in GageList.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gagelist,
    gageId: {
      propDefinition: [
        gagelist,
        "gageId",
      ],
      description: "The ID of the gage to retrieve.",
    },
  },
  async run({ $ }) {
    const response = await this.gagelist.getGage(this.gageId);
    $.export("$summary", `Successfully retrieved gage with ID: ${this.gageId}`);
    return response;
  },
};
