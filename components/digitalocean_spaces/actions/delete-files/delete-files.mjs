import common from "../../common/common-s3.mjs";

export default {
  ...common,
  type: "action",
  key: "digitalocean_spaces-delete-files",
  name: "Delete Files",
  description: "Delete files in a bucket. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/deleteobjectscommand.html).",
  version: "1.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    files: {
      propDefinition: [
        common.props.aws,
        "files",
        (c) => ({
          bucket: c.bucket,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.aws.deleteFiles({
      Bucket: this.bucket,
      Delete: {
        Objects: this.files.map((file) => ({
          Key: file,
        })),
      },
    });
    const suffix = this.files.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully deleted file${suffix}`);
    return response;
  },
};
