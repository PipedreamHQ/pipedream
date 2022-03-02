import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-s3-stream-file",
  name: "AWS - S3 - Stream file to S3 from URL",
  description: toSingleLineString(`
    Accepts a file URL, and streams the file to the provided S3 bucket/key.
    [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)
  `),
  version: "0.2.2",
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
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The absolute URL of the file you'd like to upload",
    },
    filename: {
      propDefinition: [
        aws,
        "key",
      ],
    },
  },
  async run({ $ }) {
    const fileResponse = await this.aws.streamFile(this.fileUrl);
    const response = await this.aws.s3UploadFile(this.region, {
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
