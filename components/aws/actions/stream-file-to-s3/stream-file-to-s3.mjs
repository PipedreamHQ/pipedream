// legacy_hash_id: a_a4i84m
import AWS from "aws-sdk";
import axios from "axios";

export default {
  key: "aws-stream-file-to-s3",
  name: "S3 - Stream file to S3 from URL",
  description: "Accepts a file URL, and streams the file to the provided S3 bucket/key",
  version: "0.2.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The absolute URL of the file you'd like to upload",
    },
    s3Bucket: {
      type: "string",
      label: "S3 Bucket",
      description: "The name of the S3 bucket you'd like to upload the file to",
    },
    s3Key: {
      type: "string",
      label: "S3 Key",
      description: "The name of the S3 key you'd like to upload this file to",
    },
  },
  async run() {
    const {
      fileUrl,
      s3Bucket,
      s3Key,
    } = this;
    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;
    const s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
    });
    const urlResponse = await axios.get(fileUrl, {
      responseType: "stream",
    });
    const s3Response = await s3.upload({
      Bucket: s3Bucket,
      Key: s3Key.replace(/^\/+/, ""),
      ContentType: urlResponse.headers["content-type"],
      ContentLength: urlResponse.headers["content-length"],
      Body: urlResponse.data,
    }).promise();
    return (await s3Response).Location;
  },
};
