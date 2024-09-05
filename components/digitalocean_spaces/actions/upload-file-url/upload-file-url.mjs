import fs from "fs";
import base from "@pipedream/aws/actions/s3-upload-file-url/s3-upload-file-url.mjs";
import downloadFileToTmp from "@pipedream/helper_functions/actions/download-file-to-tmp/download-file-to-tmp.mjs";
import common from "../../common/common-s3.mjs";

export default {
  ...common,
  ...base,
  type: "action",
  key: "digitalocean_spaces-upload-file-url",
  name: "Upload File URL",
  description: "Accepts a download link and a filename, downloads it, then uploads to DigitalOcean Spaces. [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html).",
  version: "0.0.2",
  props: {
    ...common.props,
    url: base.props.url,
    filename: base.props.filename,
  },
  async run({ $ }) {
    const {
      uploadFile,
      bucket,
      acl,
      contentType,
      metadata,
    } = this;

    const filedata = await downloadFileToTmp.run.bind(this)({
      $,
    });

    const filename = filedata[0];
    const filepath = filedata[1];
    const file = fs.readFileSync(filepath, {
      encoding: "base64",
    });

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
};
