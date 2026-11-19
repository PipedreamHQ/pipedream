import common from "../../common/common-s3.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-s3-list-objects",
  name: "S3 - List Objects",
  description: toSingleLineString(`
    Lists the objects in an S3 bucket, optionally under a prefix (folder), one page at a time.
    By default it gives a folder view: the objects directly under \`prefix\` plus the subfolders in \`folders\`.
    Turn on \`recursive\` to list every object below the prefix instead.
    A bucket can hold more objects than one page, so check \`truncated\` first: when it is \`true\`,
    call this action again with the same inputs and \`continuationToken\` set to \`nextContinuationToken\` to get the next page,
    and repeat until \`truncated\` is \`false\`. Objects come back in key order, with \`key\`, \`size\` (bytes) and \`lastModified\` only.
    Use the keys with **S3 - Download File to /tmp**, **S3 - Copy Object** or **S3 - Move Object**.
    Example: \`bucket\` \`acme-docs\`, \`prefix\` \`invoices/2025/\`, \`recursive\` on returns
    \`{ "truncated": false, "nextContinuationToken": null, "count": 1, "objects": [{ "key": "invoices/2025/jan.pdf", "size": 48213, "lastModified": "2025-02-01T09:30:00.000Z" }], "folders": [] }\`.
    [See the documentation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html)
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
    region: common.props.region,
    bucket: common.props.bucket,
    prefix: {
      type: "string",
      label: "Prefix",
      description: "Only list keys that start with this prefix. To list a folder, end it with a slash, e.g. `invoices/2025/`. Leave empty to list from the root of the bucket.",
      optional: true,
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "When on, lists every object below the prefix, however deeply nested. When off (the default), lists only the objects directly under the prefix and returns the subfolders in `folders`.",
      optional: true,
      default: false,
    },
    maxKeys: {
      type: "integer",
      label: "Max Keys",
      description: "The maximum number of objects to return in this page (1-1000). Defaults to 100. Set it to 1000 when you need to read a whole bucket or folder, to take the fewest calls. More may exist: check `truncated` in the result.",
      optional: true,
      default: 100,
      min: 1,
      max: 1000,
    },
    continuationToken: {
      type: "string",
      label: "Continuation Token",
      description: "The `nextContinuationToken` from the previous page of results. Leave empty for the first page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      bucket, prefix, recursive, maxKeys, continuationToken,
    } = this;

    const response = await this.listObjectsV2({
      Bucket: bucket,
      Prefix: prefix || undefined,
      Delimiter: recursive
        ? undefined
        : "/",
      MaxKeys: maxKeys ?? 100,
      ContinuationToken: continuationToken || undefined,
    });

    // Zero-byte "folder" placeholders (keys ending in `/`) are not files
    const objects = (response.Contents ?? [])
      .filter(({ Key: key }) => !key.endsWith("/"))
      .map(({
        Key: key, Size: size, LastModified: lastModified,
      }) => ({
        key,
        size,
        lastModified,
      }));
    const folders = (response.CommonPrefixes ?? []).map(({ Prefix: folder }) => folder);
    const truncated = Boolean(response.IsTruncated);

    $.export("$summary", `Listed ${objects.length} object${objects.length === 1
      ? ""
      : "s"}${folders.length
      ? ` and ${folders.length} folder${folders.length === 1
        ? ""
        : "s"}`
      : ""}${truncated
      ? " (more available: pass nextContinuationToken to get the next page)"
      : ""}`);

    // `truncated` and the token come first so they are seen before a long list
    return {
      truncated,
      nextContinuationToken: response.NextContinuationToken ?? null,
      bucket,
      prefix: prefix ?? "",
      count: objects.length,
      objects,
      folders,
    };
  },
};
