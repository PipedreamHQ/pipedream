import common from "../../common/common-s3.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-s3-list-buckets",
  name: "S3 - List Buckets",
  description: toSingleLineString(`
    Lists the S3 buckets the connected AWS account owns, with each bucket's name, region and creation date.
    Use it to find the bucket name (and region) to pass to **S3 - List Objects**, **S3 - Download File to /tmp**,
    **S3 - Upload Files** and the other S3 actions.
    Example result: \`{ "buckets": [{ "name": "acme-docs", "region": "us-west-2", "creationDate": "2024-03-01T12:00:00.000Z" }], "count": 1 }\`.
    [See the documentation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListBuckets.html)
  `),
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aws: common.props.aws,
  },
  async run({ $ }) {
    const buckets = [];
    let continuationToken;
    do {
      const response = await this.listBuckets({
        ContinuationToken: continuationToken,
      });
      for (const bucket of response.Buckets ?? []) {
        buckets.push({
          name: bucket.Name,
          region: bucket.BucketRegion ?? null,
          creationDate: bucket.CreationDate,
        });
      }
      continuationToken = response.ContinuationToken;
    } while (continuationToken);

    $.export("$summary", `Found ${buckets.length} bucket${buckets.length === 1
      ? ""
      : "s"}`);
    return {
      buckets,
      count: buckets.length,
    };
  },
};
