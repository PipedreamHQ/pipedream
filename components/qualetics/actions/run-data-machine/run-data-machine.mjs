import qualetics from "../../qualetics.app.mjs";

export default {
  key: "qualetics-run-data-machine",
  name: "Run Data Machine",
  description: "Initiates a previously designed data machine within Qualetics, executing the specific analytical tasks it was built for. [See the documentation](https://docs.qualetics.com/data-machines)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    qualetics,
    dataMachineId: {
      propDefinition: [
        qualetics,
        "dataMachineId",
      ],
    },
    input: {
      type: "string",
      label: "Input",
      description: "Input for the data machine",
    },
  },
  async run({ $ }) {
    const response = await this.qualetics.initiateDataMachine({
      $,
      params: {
        id: this.dataMachineId,
      },
      data: JSON.stringify({
        input: this.input,
      }),
    });
    if (response?.status === "Completed") {
      $.export("$summary", `Successfully initiated Data Machine with ID: ${this.dataMachineId}`);
    }
    return response;
  },
};
