import talenthr from "../../talenthr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "talenthr-respond-time-off-request",
  name: "Respond to Time Off Request",
  description: "Responds to an employee's time off request. This action requires the request ID and the response status as props. [See the documentation](https://apidocs.talenthr.io/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    talenthr,
    requestId: {
      propDefinition: [
        talenthr,
        "requestId",
      ],
    },
    responseStatus: {
      propDefinition: [
        talenthr,
        "responseStatus",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.talenthr.respondToTimeOffRequest({
      requestId: this.requestId,
      responseStatus: this.responseStatus,
    });

    $.export("$summary", `Successfully responded to time off request with ID ${this.requestId}`);
    return response;
  },
};
