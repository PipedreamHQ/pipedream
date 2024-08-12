import gagelist from "../../gagelist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gagelist-create-gage",
  name: "Create Gage",
  description: "Creates a new gage on gagelist",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gagelist,
    gageInformation: {
      type: "object",
      label: "Gage Information",
      description: "The information of the gage to create",
    },
  },
  async run({ $ }) {
    const response = await this.gagelist.createGage(this.gageInformation);
    $.export("$summary", "Gage successfully created");
    return response;
  },
};
