import common from "../../common/common-s3.mjs";
import base from "../../../aws/actions/s3-upload-base64-as-file/s3-upload-base64-as-file.mjs";

export default {
  ...common,
  ...base,
  type: "action",
  key: "digitalocean_spaces-upload-file-base64",
  name: "Upload File Base64",
  description: "Accepts a base64-encoded string and a filename, then uploads as a file to DigitalOcean Spaces. [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html).",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    filename: base.props.filename,
    data: base.props.data,
  },
  async run({ $ }) {
    const {
      uploadFile,
      bucket,
      filename,
      data,
      acl,
      contentType,
      metadata,
    } = this;

    const response = await uploadFile({
      Bucket: bucket,
      Key: filename,
      Body: Buffer.from(data, "base64"),
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
};
