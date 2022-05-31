import common from "../common.mjs";
import knack from "../../knack.app.mjs";

export default {
  ...common,
  key: "knack-delete-record",
  name: "Delete Record",
  description:
    "Delete a Record for a Knack object [(See docs here)](https://docs.knack.com/docs/object-based-delete)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    recordId: {
      propDefinition: [
        knack,
        "recordId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.knack.httpRequest($, {
      method: "DELETE",
      objectKey: this.objectKey,
      recordId: this.recordId,
    });

    $.export("$summary", "Deleted record successfully");

    return response;
  },
};
