import base from "../_common/base.mjs";
import { recordData } from "../_common/props.mjs";

export default {
  ...base,
  key: "knack-create-record",
  name: "Create Record",
  description:
    "Create a Record for a Knack object [(See docs here)](https://docs.knack.com/docs/object-based-post)",
  version: "0.0.2",
  type: "action",
  props: {
    ...base.props,
    recordData,
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
