import diabatixColdstream from "../../diabatix_coldstream.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diabatix_coldstream-run-simulation",
  name: "Run Thermal Simulation",
  description: "Starts a new thermal simulation in ColdStream with specified parameters and submits the created case. [See the documentation](https://coldstream.readme.io/reference/post_cases)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    diabatixColdstream,
    caseName: {
      type: "string",
      label: "Case Name",
      description: "The name of the case",
    },
    caseType: {
      propDefinition: [
        diabatixColdstream,
        "caseType",
      ],
    },
  },
  async run({ $ }) {
    const caseTypeValue = 1; // As per requirement, the caseType prop value is set to 1

    // Create a new case
    const createCaseResponse = await this.diabatixColdstream.createCase({
      caseType: caseTypeValue,
      caseName: this.caseName,
    });

    // Extract the case ID from the response
    const caseId = createCaseResponse.id;

    // Submit the created case for calculation
    const submitCaseResponse = await this.diabatixColdstream.submitCase({
      caseId,
      data: {}, // No additional data is provided for submission as per the requirements
    });

    // Export a summary of the action
    $.export("$summary", `Successfully started and submitted thermal simulation case with ID ${caseId}`);

    // Return the response from the submit case request
    return submitCaseResponse;
  },
};
