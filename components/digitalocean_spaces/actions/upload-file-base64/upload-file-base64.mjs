import common from "../../common/common-s3.mjs";
import base from "../../../aws/actions/s3-upload-file/s3-upload-file.mjs";

export default {
  ...common,
  ...base,
  type: "action",
  key: "digitalocean_spaces-upload-file-base64",
  name: "Upload File Base64",
  description: "Accepts a base64-encoded string and a filename, then uploads as a file to DigitalOcean Spaces. [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html).",
  version: "0.0.1",
  props: {
    ...common.props,
    filename: base.props.filename,
    data: base.props.data,
  },
};
