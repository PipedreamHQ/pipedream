import common from "../../common/common-s3.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-s3-stream-file",
  name: "S3 - Stream file to S3 from URL",
  description: toSingleLineString(`
    Accepts a file URL, and streams the file to the provided S3 bucket/key.
    [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)
  `),
  version: "0.3.0",
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    bucket: common.props.bucket,
    fileUrl: common.props.fileUrl,
    filename: common.props.key,
  },
  async run({ $ }) {
    const fileResponse = await this.streamFile(this.fileUrl);
    const response = await this.uploadFile({
      Bucket: this.bucket,
      Key: this.filename.replace(/^\/+/, ""),
      Body: fileResponse.data,
      ContentType: fileResponse.headers["content-type"],
      ContentLength: fileResponse.headers["content-length"],
    });
    $.export("$summary", `Streaming file ${this.filename} to ${this.bucket}`);
    return response;
  },
};
