import common from "../../common/common-s3.mjs";
import base from "../../../aws/actions/s3-upload-file-url/s3-upload-file-url.mjs";

export default {
  ...common,
  ...base,
  type: "action",
  key: "digitalocean_spaces-upload-file-url",
  name: "Upload File URL",
  description: "Accepts a download link and a filename, downloads it, then uploads to DigitalOcean Spaces. [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html).",
  version: "0.0.1",
  props: {
    ...common.props,
    url: base.props.url,
    filename: base.props.filename,
  },
  async run({ $ }) {
    return base.run.bind(this)({
      $,
    });
  },
};
