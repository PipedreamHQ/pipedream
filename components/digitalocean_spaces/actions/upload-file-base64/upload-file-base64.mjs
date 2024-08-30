import common from "../../common/common-s3.mjs";
import base from "@pipedream/aws/actions/s3-upload-file/s3-upload-file.mjs";

export default {
  ...common,
  ...base,
  type: "action",
  key: "digitalocean_spaces-upload-file-base64",
  name: "Upload File Base64",
  description: "Accepts a base64-encoded string and a filename, then uploads as a file to DigitalOcean Spaces. [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html).",
  version: "0.0.2",
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
