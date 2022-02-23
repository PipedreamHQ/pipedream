// legacy_hash_id: a_Vpi8Rv
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-send-to-s3",
  name: "Send to Amazon S3",
  description: "Send data to Amazon S3 using Pipedream's destination integration. See https://docs.pipedream.com/destinations/s3/",
  version: "0.2.1",
  type: "action",
  props: {
    helper_functions,
    bucket: {
      type: "string",
      label: "S3 Bucket",
      description: "The name of the S3 bucket you'd like to send data to",
    },
    prefix: {
      type: "string",
      description: "The bucket prefix where you'd like to save data. You must include a trailing slash (for example, \"test/\") if you'd like this prefix to operate like a folder in S3",
      optional: true,
    },
    payload: {
      type: "object",
      description: "An object, either a reference to a variable from a previous step (for example, event.body), or a set of hardcoded key-value pairs.",
    },
  },
  async run({ $ }) {
    $.send.s3({
      bucket: this.bucket,
      prefix: this.prefix,
      payload: this.payload,
    });
  },
};
