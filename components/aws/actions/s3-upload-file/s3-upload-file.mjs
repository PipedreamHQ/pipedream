import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-s3-upload-file",
  name: "S3 - Upload File",
  description: toSingleLineString(`
    Accepts a base64-encoded string and a filename, then uploads as a file to S3.
    [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)
  `),
  version: "0.2.0",
  type: "action",
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
    bucket: {
      propDefinition: [
        aws,
        "bucket",
      ],
    },
    filename: {
      propDefinition: [
        aws,
        "key",
      ],
    },
    data: {
      type: "string",
      label: "Base64-encoded Data",
      description: "A string of base64-encoded data, or a variable reference to that string",
    },
  },
  async run({ $ }) {
    const response = await this.aws.s3UploadFile(this.region, {
      Bucket: this.bucket,
      Key: this.filename,
      Body: Buffer.from(this.data, "base64"),
    });
    $.export("$summary", `Uploaded file ${this.filename} to S3`);
    return response;
  },
};
