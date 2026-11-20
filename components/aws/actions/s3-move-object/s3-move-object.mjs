import { ConfigurationError } from "@pipedream/platform";
import copyObject from "../s3-copy-object/s3-copy-object.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...copyObject,
  type: "action",
  key: "aws-s3-move-object",
  name: "S3 - Move Object",
  description: toSingleLineString(`
    Moves (or renames) an S3 object: copies it to the new key, in the same bucket or another bucket,
    then deletes the original. Use it to file documents, e.g. from \`inbox/\` to \`processed/\`.
    The original is deleted only after the copy succeeds. Refuses to replace an object that already exists
    at the destination unless \`overwrite\` is on. Objects larger than 5 GB can't be moved with this action.
    Get source keys from **S3 - List Objects**.
    Example: \`bucket\` \`acme-docs\`, \`key\` \`inbox/scan.pdf\`, \`destinationKey\` \`processed/scan.pdf\` returns
    \`{ "source": { "bucket": "acme-docs", "key": "inbox/scan.pdf" }, "destination": { "bucket": "acme-docs", "key": "processed/scan.pdf" }, "etag": "\\"9b2cf535f27731c974343645a3985328\\"", "sourceDeleted": true }\`.
    [See the documentation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CopyObject.html)
  `),
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    // Identify the source object first, so only this exact object is copied and
    // deleted: a replacement written meanwhile is never removed. `region` describes
    // the destination bucket, so the source's own region is looked up.
    let etag;
    try {
      ({ ETag: etag } = await this.headObject({
        Bucket: this.bucket,
        Key: this.key,
      }, {
        ownRegion: true,
      }));
    } catch (err) {
      if (err?.name === "NotFound" || err?.$metadata?.httpStatusCode === 404) {
        throw new ConfigurationError(`No object exists at \`${this.bucket}/${this.key}\`. Run **S3 - List Objects** to find the key.`);
      }
      throw err;
    }

    const result = await this.copyObjectChecked({
      sourceEtag: etag,
    });
    try {
      await this.deleteObject({
        Bucket: result.source.bucket,
        Key: result.source.key,
        IfMatch: etag,
      }, {
        ownRegion: true,
      });
    } catch (err) {
      if (err?.$metadata?.httpStatusCode === 412) {
        throw new Error(`Copied \`${result.source.bucket}/${result.source.key}\` to \`${result.destination.bucket}/${result.destination.key}\`, but the original was replaced after the copy began, so it was kept and not deleted. The object now exists at both keys, and the copy holds the earlier version.`);
      }
      throw new Error(`Copied \`${result.source.bucket}/${result.source.key}\` to \`${result.destination.bucket}/${result.destination.key}\`, but could not delete the original: ${err?.message ?? err}. The object now exists at both keys.`);
    }
    $.export("$summary", `Moved \`${result.source.bucket}/${result.source.key}\` to \`${result.destination.bucket}/${result.destination.key}\``);
    return {
      ...result,
      sourceDeleted: true,
    };
  },
};
