import appdrag from "../../appdrag.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "appdrag-execute-api-function",
  name: "Execute API Function",
  description: "Executes an API function from a cloud backend. [See the documentation](https://support.appdrag.com/doc/export-documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    appdrag,
    functionName: {
      type: "string",
      label: "Function Name",
      description: "The name of the function to execute.",
    },
    data: {
      type: "string",
      label: "Data",
      description: "The JSON string of the data to send in the request body.",
    },
  },
  async run({ $ }) {
    const parsedData = JSON.parse(this.data); // Assuming the user passes a JSON string
    const response = await this.appdrag.executeApiFunction({
      functionName: this.functionName,
      data: parsedData,
    });
    $.export("$summary", `Executed function ${this.functionName} successfully`);
    return response;
  },
};
