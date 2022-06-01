import base from "../common/base.mjs";
import { recordId } from "../common/props.mjs";

export default {
  ...base,
  key: "knack-delete-record",
  name: "Delete Record",
  description:
    "Delete a Record for a Knack object [(See docs here)](https://docs.knack.com/docs/object-based-delete)",
  version: "0.0.1",
  type: "action",
  props: {
    ...base.props,
    recordId,
  },
  async run({ $ }) {
    const params = {
      objectKey: this.objectKey,
      recordId: this.recordId,
    };

    const response = await this.knack.deleteRecord($, params);

    $.export("$summary", "Deleted record successfully");

    return response;
  },
};
