import base from "../common/base.mjs";
import {
  recordId, recordData,
} from "../common/props.mjs";

export default {
  ...base,
  key: "knack-update-record",
  name: "Update Record",
  description:
    "Update a Record for a Knack object [(See docs here)](https://docs.knack.com/docs/object-based-put)",
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
    recordData,
  },
  methods: {
    getBaseParams() {
      return {
        objectKey: this.objectKey,
        recordId: this.recordId,
        data: this.recordData,
      };
    },
  },
  async run({ $ }) {
    const response = await this.knack.updateRecord($, this.getBaseParams());

    $.export("$summary", "Updated record successfully");

    return response;
  },
};
