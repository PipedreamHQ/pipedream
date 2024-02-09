import qualetics from "../../qualetics.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "qualetics-run-data-machine",
  name: "Run Data Machine",
  description: "Initiates a previously designed data machine within Qualetics, executing the specific analytical tasks it was built for. [See the documentation](https://docs.qualetics.com/data-machines)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    qualetics,
    dataMachineId: {
      propDefinition: [
        qualetics,
        "dataMachineId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.qualetics.initiateDataMachine(this.dataMachineId);
    $.export("$summary", `Successfully initiated Data Machine with ID: ${this.dataMachineId}`);
    return response;
  },
};
