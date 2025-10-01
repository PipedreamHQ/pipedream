import base from "../common/base.mjs";
import { recordData } from "../common/props.mjs";

export default {
  ...base,
  key: "knack-create-record",
  name: "Create Record",
  description:
    "Create a Record for a Knack object [(See docs here)](https://docs.knack.com/docs/object-based-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...base.props,
    recordData,
  },
  methods: {
    getBaseParams() {
      return {
        objectKey: this.objectKey,
        data: this.recordData,
      };
    },
  },
  async run({ $ }) {
    const response = await this.knack.createRecord($, this.getBaseParams());

    $.export("$summary", "Created record successfully");

    return response;
  },
};
