import gagelist from "../../gagelist.app.mjs";

export default {
  key: "gagelist-find-gage-by-id",
  name: "Find Gage by ID",
  description: "Finds and retrieves a gage based on its ID in GageList. [See the documentation](https://gagelist.com/developer-resources/get-a-single-gage-record/)",
  version: "0.0.1",
  type: "action",
  props: {
    gagelist,
    gageId: {
      propDefinition: [
        gagelist,
        "gageId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gagelist.getGage({
      $,
      gageId: this.gageId,
    });
    $.export("$summary", `Successfully retrieved gage with ID: ${this.gageId}`);
    return response;
  },
};
