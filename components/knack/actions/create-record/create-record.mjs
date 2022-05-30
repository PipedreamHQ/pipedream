import common from "../common.mjs";
import knack from "../../knack.app.mjs";

export default {
  ...common,
  key: "knack-create-record",
  name: "Create Record",
  description:
    "Create a Record on Knack [(See docs here)](https://docs.knack.com/docs/object-based-post)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    recordData: {
      propDefinition: [
        knack,
        "recordData",
      ],
    },
  },
  async run({ $ }) {
    const data = this.recordData;

    const response = await this.knack.httpRequest($, {
      method: "POST",
      objectKey: this.objectKey,
      data,
    });

    $.export("$summary", "Created record successfully");

    return response;
  },
};
