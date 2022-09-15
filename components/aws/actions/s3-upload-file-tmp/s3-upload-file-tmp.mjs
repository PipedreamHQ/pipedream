import common from "../../common/common-s3.mjs";
import fs from "fs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-s3-upload-file-tmp",
  name: "S3 - Upload File - /tmp",
  description: toSingleLineString(`
    Accepts a file path starting from /tmp, then uploads as a file to S3.
    [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)
  `),
  version: "0.0.1",
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    bucket: common.props.bucket,
    filename: common.props.key,
    path: {
      type: "string",
      label: "File Path",
      description: "A path starting from `/tmp`, i.e. `/tmp/some_text_file.txt`",
    },
  },
  async run({ $ }) {
    const file = fs.readFileSync(this.path, {
      encoding: "base64",
    });
    const response = await this.uploadFile({
      Bucket: this.bucket,
      Key: this.filename,
      Body: Buffer.from(file, "base64"),
    });
    $.export("$summary", `Uploaded file ${this.filename} to S3`);
    return response;
  },
};
