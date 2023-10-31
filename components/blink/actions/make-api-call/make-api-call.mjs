import blink from "../../blink.app.mjs";

export default {
  key: "blink-make-api-call",
  name: "Make API Call",
  description: "Performs an arbitrary authorized API call to Blink. [See the documentation](https://developer.joinblink.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blink,
    apiEndpoint: {
      propDefinition: [
        blink,
        "apiEndpoint",
      ],
    },
    method: {
      propDefinition: [
        blink,
        "method",
      ],
    },
    data: {
      propDefinition: [
        blink,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.blink.callAPI({
      apiEndpoint: this.apiEndpoint,
      method: this.method,
      data: this.data,
    });
    $.export("$summary", `Successfully made a ${this.method} request to ${this.apiEndpoint}`);
    return response;
  },
};
