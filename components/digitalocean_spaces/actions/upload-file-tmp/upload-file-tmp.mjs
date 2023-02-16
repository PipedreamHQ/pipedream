import common from "../../common/common-s3.mjs";
import base from "../../../aws/actions/s3-upload-file-tmp/s3-upload-file-tmp.mjs";

export default {
  ...common,
  ...base,
  type: "action",
  key: "digitalocean_spaces-upload-file-tmp",
  name: "Upload File /tmp",
  description: "Accepts a file path starting from /tmp, then uploads as a file to DigitalOcean Spaces. [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html).",
  version: "0.0.1",
  props: {
    ...common.props,
    filename: base.props.filename,
    path: base.props.path,
  },
};
