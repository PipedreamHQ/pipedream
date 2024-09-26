import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";
import base from "@pipedream/aws/actions/s3-upload-file-tmp/s3-upload-file-tmp.mjs";
import common from "../../common/common-s3.mjs";

export default {
  ...common,
  ...base,
  type: "action",
  key: "digitalocean_spaces-upload-file-tmp",
  name: "Upload File /tmp",
  description: "Accepts a file path starting from /tmp, then uploads as a file to DigitalOcean Spaces. [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html).",
  version: "0.0.2",
  props: {
    ...common.props,
    customFilename: base.props.customFilename,
    path: base.props.path,
  },
  methods: {
    ...base.methods,
    async uploadSingleFile($) {
      const {
        uploadFile,
        bucket,
        path,
        customFilename,
        acl,
        contentType,
        metadata,
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
        Key: filename,
        Body: Buffer.from(file, "base64"),
        ...(acl && {
          ACL: acl,
        }),
        ...(contentType && {
          ContentType: contentType,
        }),
        ...(metadata && {
          Metadata: metadata,
        }),
      });
      $.export("$summary", `Uploaded file ${filename} to S3`);
      return response;
    },
  },
};
