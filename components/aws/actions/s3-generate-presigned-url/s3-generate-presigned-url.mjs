import common from "../../common/common-s3.mjs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default {
  ...common,
  key: "aws-s3-generate-presigned-url",
  name: "S3 - Generate Presigned URL",
  description: "Creates a presigned URL to download from a bucket. [See the documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_Scenario_PresignedUrl_section.html)",
  version: "0.0.5",
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
      description: "The key of the object to create a download URL for, e.g. `reports/2025/summary.pdf`. Run **S3 - List Objects** to find keys.",
    },
  },
  async run({ $ }) {
    // A presigned URL is bound to the bucket's region, which isn't discovered by
    // redirect (no request is sent), so use the `region` prop or a region S3 actually
    // reported: signing for a guessed region would return a URL that doesn't work.
    const client = await this._getS3Client(this.bucket, {
      requireVerified: true,
    });
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: this.key,
    });
    const response = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });
    $.export("$summary", "Successfully generated presigned URL");
    return response;
  },
};
