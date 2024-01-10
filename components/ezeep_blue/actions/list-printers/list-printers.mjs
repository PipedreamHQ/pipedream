import printService from "../../print_service.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "print_service-list-printers",
  name: "List Printers",
  description: "Retrieve a list of all available printers in the network. [See the documentation](https://api.printservice.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    printService,
  },
  async run({ $ }) {
    const response = await this.printService.listPrinters();
    $.export("$summary", `Retrieved ${response.length} printers`);
    return response;
  },
};
