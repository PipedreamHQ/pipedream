import { join } from "path";
import fs from "fs";
import {
  getFileStreamAndMetadata,
  ConfigurationError,
} from "@pipedream/platform";
import common from "../../common/common-s3.mjs";

export default {
  ...common,
  key: "aws-s3-upload-files",
  name: "S3 - Upload Files",
  description: "Upload files to S3. Accepts either a file URL, a local file path, or a directory path. [See the documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File Path, Url, Or Folder Path",
      description: "Provide either a file URL, a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`), or a directory path to upload all files.",
    },
    customFilename: {
      type: common.props.key.type,
      label: common.props.key.label,
      description: common.props.key.description,
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });
        stream.on("error", reject);
      });
    },
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
        const {
          stream,
          metadata,
        } = await getFileStreamAndMetadata(filePath);
        const relativePath = filePath.substring(folderPath.length + 1);
        const s3Key = join(prefix, relativePath);

        await uploadFile({
          Bucket: bucket,
          Key: s3Key,
          Body: stream,
          ContentType: metadata.contentType,
          ContentLength: metadata.size,
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

      const {
        stream,
        metadata,
      } = await getFileStreamAndMetadata(filePath);
      const filename = customFilename || filePath.split("/").pop();

      const response = await uploadFile({
        Bucket: bucket,
        Key: join(prefix, filename),
        Body: stream,
        ContentType: metadata.contentType,
        ContentLength: metadata.size,
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

    // If path is a URL, treat it as a single file
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return await uploadSingleFile($, path);
    }

    // For local paths, check if it exists
    if (!fs.existsSync(path)) {
      throw new ConfigurationError(`The file or directory path \`${path}\` does not exist. Please verify the path and include the leading /tmp if needed.`);
    }

    const stat = fs.statSync(path);
    return stat.isDirectory()
      ? await uploadFolderFiles($, path)
      : await uploadSingleFile($, path);
  },
};
