import common from "../../common/common-s3.mjs";

export default {
  ...common,
  type: "action",
  key: "digitalocean_spaces-list-files",
  name: "List Files",
  description: "List files in a bucket. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/listobjectsv2command.html).",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ...common.props,
    prefix: {
      propDefinition: [
        common.props.aws,
        "prefix",
      ],
    },
  },
  async run({ $ }) {
    const files = await this.aws.listFiles({
      Bucket: this.bucket,
      Prefix: this.prefix,
    });
    const suffix = files.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully retrieved ${files.length} file${suffix}`);
    return files;
  },
};
