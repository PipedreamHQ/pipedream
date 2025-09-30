/* eslint-disable pipedream/props-label, pipedream/props-description */
import { join } from "path";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import base from "../../../aws/actions/s3-upload-files/s3-upload-files.mjs";
import common from "../../common/common-s3.mjs";

export default {
  ...common,
  ...base,
  type: "action",
  key: "digitalocean_spaces-upload-file",
  name: "Upload File",
  description: "Upload a file to DigitalOcean Spaces. Accepts either a file URL or a path to a file in the `/tmp` directory. [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    path: {
      ...base.props.path,
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.pdf`).",
    },
    customFilename: base.props.customFilename,
    prefix: {
      ...base.props.prefix,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      uploadFile,
      bucket,
      prefix,
      customFilename,
      path,
    } = this;

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(path);
    const filename = customFilename || path.split("/").pop();

    const response = await uploadFile({
      Bucket: bucket,
      Key: prefix
        ? join(prefix, filename)
        : filename,
      Body: stream,
      ContentType: metadata.contentType,
      ContentLength: metadata.size,
    });

    $.export("$summary", `Uploaded file ${filename} to S3`);
    return response;
  },
};
