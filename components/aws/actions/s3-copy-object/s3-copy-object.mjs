import { ConfigurationError } from "@pipedream/platform";
import common from "../../common/common-s3.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-s3-copy-object",
  name: "S3 - Copy Object",
  description: toSingleLineString(`
    Copies one S3 object to a new key, in the same bucket or another bucket (including a bucket in a different region).
    The original is left in place; to rename or relocate it, use **S3 - Move Object** instead.
    Refuses to replace an object that already exists at the destination unless \`overwrite\` is on.
    Objects larger than 5 GB can't be copied with this action.
    Get source keys from **S3 - List Objects**.
    Example: \`bucket\` \`acme-docs\`, \`key\` \`inbox/scan.pdf\`, \`destinationKey\` \`archive/2025/scan.pdf\` returns
    \`{ "source": { "bucket": "acme-docs", "key": "inbox/scan.pdf" }, "destination": { "bucket": "acme-docs", "key": "archive/2025/scan.pdf" }, "etag": "\\"9b2cf535f27731c974343645a3985328\\"" }\`.
    [See the documentation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CopyObject.html)
  `),
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    aws: common.props.aws,
    region: {
      ...common.props.region,
      description: "The AWS region of the destination bucket, e.g. `us-east-1`. Optional: when omitted, it is looked up automatically. Run **List AWS Region Options** to see the available regions, or **S3 - List Buckets** to see each bucket's region.",
    },
    bucket: {
      ...common.props.bucket,
      label: "Source Bucket",
      description: "The bucket that holds the object to copy. Run **S3 - List Buckets** to see the buckets this account can access.",
    },
    key: {
      ...common.props.key,
      label: "Source Key",
      description: "The key of the object to copy, e.g. `inbox/scan.pdf`. Run **S3 - List Objects** to find keys.",
    },
    destinationBucket: {
      ...common.props.bucket,
      label: "Destination Bucket",
      description: "The bucket to copy the object into. Defaults to the source bucket. Run **S3 - List Buckets** to see the buckets this account can access, with their regions.",
      optional: true,
    },
    destinationKey: {
      ...common.props.key,
      label: "Destination Key",
      description: "The key for the copy, e.g. `archive/2025/scan.pdf`. Folders are created implicitly by using `/` in the key.",
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite",
      description: "Replace an object that already exists at the destination key. When off (the default), the copy fails instead.",
      optional: true,
      default: false,
    },
  },
  methods: {
    ...common.methods,
    /**
     * Validates and performs the copy; shared with the move action.
     */
    async copyObjectChecked() {
      const {
        bucket, key, destinationKey, overwrite,
      } = this;
      const destinationBucket = this.destinationBucket || bucket;

      if (destinationBucket === bucket && destinationKey === key) {
        throw new ConfigurationError("The source and destination are the same object. Choose a different `Destination Key` or `Destination Bucket`.");
      }
      if (!overwrite && await this.objectExists(destinationBucket, destinationKey)) {
        throw new ConfigurationError(`An object already exists at \`${destinationBucket}/${destinationKey}\`. Turn on \`Overwrite\` to replace it, or choose a different \`Destination Key\`.`);
      }

      const response = await this.copyObject({
        sourceBucket: bucket,
        sourceKey: key,
        destinationBucket,
        destinationKey,
      });
      return {
        source: {
          bucket,
          key,
        },
        destination: {
          bucket: destinationBucket,
          key: destinationKey,
        },
        etag: response.CopyObjectResult?.ETag,
        lastModified: response.CopyObjectResult?.LastModified,
        versionId: response.VersionId,
      };
    },
  },
  async run({ $ }) {
    const result = await this.copyObjectChecked();
    $.export("$summary", `Copied \`${result.source.bucket}/${result.source.key}\` to \`${result.destination.bucket}/${result.destination.key}\``);
    return result;
  },
};
