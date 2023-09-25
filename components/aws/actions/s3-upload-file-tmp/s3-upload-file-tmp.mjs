import common from "../../common/common-s3.mjs";
import fs from "fs";
import { join } from "path";
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
  version: "1.0.0",
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    bucket: common.props.bucket,
    prefix: {
      type: "string",
      label: "Prefix",
      description: "This is the destination S3 prefix. Files or folders would both get uploaded to the prefix.",
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
    customFilename: {
      type: common.props.key.type,
      label: common.props.key.label,
      description: common.props.key.description,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async uploadFolderFiles($) {
      const {
        uploadFile,
        bucket,
        folderPath,
        prefix,
      } = this;

      const files = fs.readdirSync(folderPath);
      const promises = [];
      for (const filename of files) {
        const fileContent = fs.readFileSync(join(folderPath, filename), {
          encoding: "base64",
        });
        promises.push(uploadFile({
          Bucket: bucket,
          Key: join(prefix, filename),
          Body: Buffer.from(fileContent, "base64"),
        }));
      }
      const response = await Promise.all(promises);
      $.export("$summary", `Uploaded all files from ${folderPath} to S3`);
      return response;
    },
    async uploadSingleFile($) {
      const {
        uploadFile,
        bucket,
        path,
        prefix,
        customFilename,
      } = this;

      if (!path) {
        throw new ConfigurationError("File Path is required");
      }
      const file = fs.readFileSync(path, {
        encoding: "base64",
      });
      const filename = customFilename || path.split("/").pop();
      const response = await uploadFile({
        Bucket: bucket,
        Key: join(prefix, filename),
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
