import aws from "../../aws.app.mjs";

export default {
  key: "aws-upload-file-to-s3",
  name: "AWS - S3 - Upload File",
  description: "Accepts a base64-encoded string and a filename, then uploads as a file to S3. [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)",
  version: "0.1.2",
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
      type: "string",
      label: "Filename",
      description: "Filename with extension",
    },
    data: {
      type: "string",
      label: "Base64-encoded Data",
      description: "A string of base64-encoded data, or a variable reference to that string",
    },
  },
  async run({ $ }) {
    const response = await this.aws.uploadFileToS3(
      this.region,
      this.bucket,
      this.filename,
      this.data,
    );
    $.export("$summary", `Uploaded file ${this.filename} to S3`);
    return response;
  },
};
