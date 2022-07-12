import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Get Company",
  description: "Retrieve details of a company [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getCompanyUsingGET)",
  key: "infusionsoft-get-company",
  version: "0.0.1",
  type: "action",
  props: {
    infusionsoft,
  },
  async run({ $ }) {
    $.export("$summary", "Retrieved company successfully");
    return true;
  },
});
