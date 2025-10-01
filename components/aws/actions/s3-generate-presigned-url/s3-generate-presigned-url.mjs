import common from "../../common/common-s3.mjs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default {
  ...common,
  key: "aws-s3-generate-presigned-url",
  name: "S3 - Generate Presigned URL",
  description: "Creates a presigned URL to download from a bucket. [See the documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_Scenario_PresignedUrl_section.html)",
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
    key: {
      ...common.props.key,
      description: "The name of the S3 key with extension you'd like to download",
    },
  },
  async run({ $ }) {
    const client = this._clientS3();
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: this.key,
    });
    const response = getSignedUrl(client, command, {
      expiresIn: 3600,
    });
    $.export("$summary", "Successfully generated presigned URL");
    return response;
  },
};
