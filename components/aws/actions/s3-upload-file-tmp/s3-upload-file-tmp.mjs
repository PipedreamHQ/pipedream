import common from "../../common/common-s3.mjs";
import fs from "fs";
import { toSingleLineString } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "aws-s3-upload-file-tmp",
  name: "S3 - Upload File - /tmp",
  description: toSingleLineString(`
    Accepts a file path or folder path starting from /tmp, then uploads the contents to S3.
    [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)
  `),
  version: "0.2.0",
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    bucket: common.props.bucket,
    filename: {
      type: common.props.key.type,
      label: common.props.key.label,
      description: common.props.key.description,
      optional: true,
    },
    path: {
      type: "string",
      label: "File Path",
      description: "A path starting from `/tmp`, i.e. `/tmp/some_text_file.txt`",
      optional: true,
    },
    folderPath: {
      type: "string",
      label: "Folder Path",
      description: "A path starting from `/tmp`, i.e. `/tmp/some_folder`. If provided, all the files inside this path will be uploaded. This will override the `Filename Key` and `File Path` props.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async uploadFolderFiles($) {
      const files = fs.readdirSync(this.folderPath);
      const promises = [];
      for (const file of files) {
        const fileContent = fs.readFileSync(`${this.folderPath}/${file}`, {
          encoding: "base64",
        });
        promises.push(this.uploadFile({
          Bucket: this.bucket,
          Key: file,
          Body: Buffer.from(fileContent, "base64"),
        }));
      }
      const response = await Promise.all(promises);
      $.export("$summary", `Uploaded all files from ${this.folderPath} to S3`);
      return response;
    },
    async uploadSingleFile($) {
      if (!this.path) {
        throw new ConfigurationError("File Path is required");
      }
      const file = fs.readFileSync(this.path, {
        encoding: "base64",
      });
      const filename = this.filename || this.path.split("/").pop();
      const response = await this.uploadFile({
        Bucket: this.bucket,
        Key: filename,
        Body: Buffer.from(file, "base64"),
      });
      $.export("$summary", `Uploaded file ${filename} to S3`);
      return response;
    },
  },
  async run({ $ }) {
    return this.folderPath
      ? await this.uploadFolderFiles($)
      : await this.uploadSingleFile($);
  },
};
