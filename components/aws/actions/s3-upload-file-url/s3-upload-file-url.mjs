import base from "@pipedream/helper_functions/actions/download-file-to-tmp/download-file-to-tmp.mjs";
import common from "../../common/common-s3.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

// override base props label and description
base.props.url = common.props.fileUrl;
base.props.filename = common.props.key;

export default {
  ...common,
  key: "aws-s3-upload-file-url",
  name: "S3 - Upload File - URL",
  description: toSingleLineString(`
    Accepts a download link and a filename, downloads it, then uploads to S3.
    [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)
  `),
  version: "0.0.1",
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    bucket: common.props.bucket,
    ...base.props,
  },
  async run({ $ }) {
    const filedata = await base.run.bind(this)({
      $,
    });
    const filename = filedata[0];
    const content = filedata[3];
    const response = await this.uploadFile({
      Bucket: this.bucket,
      Key: filename,
      Body: content,
    });
    $.export("$summary", `Uploaded file ${filename} to S3`);
    return response;
  },
};
