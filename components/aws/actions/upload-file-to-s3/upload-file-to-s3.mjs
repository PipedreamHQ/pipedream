// legacy_hash_id: a_k6iKxV
import AWS from "aws-sdk";

export default {
  key: "aws-upload-file-to-s3",
  name: "S3 - Upload File",
  description: "Accepts a base64-encoded string, a filename, and a content type, then uploads as a file to S3",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    bucket: {
      type: "string",
      label: "S3 Bucket Name",
    },
    ContentType: {
      type: "string",
      label: "Content Type",
      description: "MIME type of the content to upload, for S3 metadata",
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
    const {
      bucket,
      ContentType,
      filename,
      data,
    } = this;
    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;

    const s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
    });

    const uploadParams = {
      Bucket: bucket,
      Key: filename,
      Body: Buffer.from(data, "base64"),
      ContentType,
    };
    $.export("S3Response", await s3.upload(uploadParams).promise());
    console.log("Uploaded file to S3!");
  },
};
