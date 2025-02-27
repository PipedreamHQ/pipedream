import common from "../../common/common-s3.mjs";
import fs from "fs";
import { join } from "path";
import { toSingleLineString } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "aws-s3-upload-file-tmp",
  name: "S3 - Upload Files - /tmp",
  description: toSingleLineString(`
    Accepts a file path or folder path starting from /tmp, then uploads the contents to S3.
    [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)
  `),
  version: "1.0.3",
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
      label: "File Or Folder Path",
      description: "Path starting from `/tmp`. If it's a directory, all files will be uploaded.",
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
    getFilesRecursive(dir) {
      let results = [];
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const itemPath = join(dir, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          results = results.concat(this.getFilesRecursive(itemPath));
        } else {
          results.push(itemPath);
        }
      }
      return results;
    },
    async uploadFolderFiles($, folderPath) {
      const {
        uploadFile,
        bucket,
        prefix,
      } = this;
      const files = this.getFilesRecursive(folderPath);
      const response = await Promise.all(files.map(async (filePath) => {
        const fileContent = fs.readFileSync(filePath, {
          encoding: "base64",
        });
        const relativePath = filePath.substring(folderPath.length + 1);
        const s3Key = join(prefix, relativePath);

        await uploadFile({
          Bucket: bucket,
          Key: s3Key,
          Body: Buffer.from(fileContent, "base64"),
        });
        return {
          filePath,
          s3Key,
          status: "uploaded",
        };
      }));
      $.export("$summary", `Uploaded all files from ${folderPath} to S3`);
      return response;
    },
    async uploadSingleFile($, filePath) {
      const {
        uploadFile,
        bucket,
        prefix,
        customFilename,
      } = this;

      const file = fs.readFileSync(filePath, {
        encoding: "base64",
      });
      const filename = customFilename || filePath.split("/").pop();

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
    const {
      uploadSingleFile,
      uploadFolderFiles,
      path,
    } = this;
    if (!fs.existsSync(path)) {
      throw new ConfigurationError(`The file or directory path \`${path}\` does not exist. Please verify the path and include the leading /tmp if needed.`);
    }
    const stat = fs.statSync(path);
    return stat.isDirectory()
      ? await uploadFolderFiles($, path)
      : await uploadSingleFile($, path);
  },
};
