import base from "../common/base.mjs";
import { recordId } from "../common/props.mjs";

export default {
  ...base,
  key: "knack-delete-record",
  name: "Delete Record",
  description:
    "Delete a Record for a Knack object [(See docs here)](https://docs.knack.com/docs/object-based-delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...base.props,
    recordId,
  },
  methods: {
    getBaseParams() {
      return {
        objectKey: this.objectKey,
        recordId: this.recordId,
      };
    },
  },
  async run({ $ }) {
    const response = await this.knack.deleteRecord($, this.getBaseParams());

    $.export("$summary", "Deleted record successfully");

    return response;
  },
};
