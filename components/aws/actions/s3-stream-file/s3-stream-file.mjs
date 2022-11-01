import fs from "fs";
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
  version: "0.3.1",
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    bucket: common.props.bucket,
    fileUrl: common.props.fileUrl,
    filename: common.props.key,
  },
  methods: {
    ...common.methods,
    async getStreamAndContentLength(fileResponse, absoluteFilePath) {
      if (fileResponse.headers["content-length"]) {
        return {
          stream: fileResponse.data,
          contentLength: fileResponse.headers["content-length"],
        };
      }
      const fileName = absoluteFilePath.split("/").pop();
      const tempLocalPath = `/tmp/${fileName}`;
      await (new Promise((resolve) => {
        const writeStream = fs.createWriteStream(tempLocalPath);
        fileResponse.data.pipe(writeStream);
        writeStream.on("finish", resolve);
      }));
      const { size } = fs.statSync(tempLocalPath);
      return {
        stream: fs.createReadStream(tempLocalPath),
        contentLength: size,
      };
    },
  },
  async run({ $ }) {
    const fileResponse = await this.streamFile(this.fileUrl);
    const filePath = this.filename.replace(/^\/+/, "");
    const {
      stream,
      contentLength,
    } = await this.getStreamAndContentLength(fileResponse, filePath);
    const response = await this.uploadFile({
      Bucket: this.bucket,
      Key: filePath,
      Body: stream,
      ContentType: fileResponse.headers["content-type"],
      ContentLength: contentLength,
    });
    $.export("$summary", `Streaming file ${this.filename} to ${this.bucket}`);
    return response;
  },
};
