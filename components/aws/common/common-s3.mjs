import aws from "../aws.app.mjs";
import {
  S3Client,
  CreateBucketCommand,
  ListBucketsCommand,
  HeadBucketCommand,
  GetBucketLocationCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand,
  PutBucketPolicyCommand,
  GetBucketNotificationConfigurationCommand,
  PutBucketNotificationConfigurationCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import { defaultRegion } from "./regions.mjs";

// Bucket regions never change, so remember lookups for the life of the process.
const bucketRegions = new Map();

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "The AWS region of the bucket, e.g. `us-east-1` or `us-west-2`. Optional: when omitted, the bucket's region is looked up automatically. Run **List AWS Region Options** to see the available regions, or **S3 - List Buckets** to see each bucket's region.",
      optional: true,
      // no default: an empty region means "look the bucket's region up"
      default: undefined,
    },
    bucket: {
      type: "string",
      label: "S3 Bucket Name",
      description: "The S3 Bucket Name, e.g. `acme-docs`. Run **S3 - List Buckets** to see the buckets this account can access, with their regions.",
      async options({ prevContext }) {
        const response = await this.listBuckets({
          ContinuationToken: prevContext?.continuationToken,
        });
        return {
          options: (response.Buckets ?? []).map(({
            Name: name, BucketRegion: bucketRegion,
          }) => ({
            label: bucketRegion
              ? `${name} (${bucketRegion})`
              : name,
            value: name,
          })),
          context: {
            continuationToken: response.ContinuationToken,
          },
        };
      },
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The absolute URL of the file you'd like to upload",
    },
    key: {
      type: "string",
      label: "S3 Filename Key",
      description: "The name of the S3 key with extension you'd like to upload this file to",
    },
  },
  methods: {
    /**
     * Synchronous client in `region` (or the default region). Prefer
     * `_getS3Client(bucket)`, which finds the bucket's region when none is set.
     */
    _clientS3() {
      return this.aws.getAWSClient(S3Client, this.region || defaultRegion);
    },
    /**
     * Returns the region of `bucket`: the `region` prop when set, otherwise it
     * is looked up from S3 (HeadBucket, falling back to GetBucketLocation).
     * S3 reports a bucket's region in the `x-amz-bucket-region` header even when
     * it answers with a redirect or access denied, so that header is read from
     * errors too.
     *
     * Only a region S3 actually reported is remembered. If both lookups fail
     * (a network blip, throttling) the default region is used for this call only,
     * so one bad lookup can't pin a bucket to the wrong region for the life of
     * the process.
     *
     * `ownRegion` skips the `region` prop, for a bucket the prop doesn't describe
     * (e.g. the source bucket of a cross-region move, where `region` is the
     * destination's).
     *
     * `requireVerified` throws instead of falling back to the default region. Use
     * it where no request is sent that could follow a redirect (e.g. signing a URL),
     * since a guessed region would produce a URL that doesn't work.
     */
    async getBucketRegion(bucket, {
      ownRegion = false, requireVerified = false,
    } = {}) {
      if (this.region && !ownRegion) {
        return this.region;
      }
      if (!bucket) {
        return defaultRegion;
      }
      if (bucketRegions.has(bucket)) {
        return bucketRegions.get(bucket);
      }
      const client = this.aws.getAWSClient(S3Client, defaultRegion);
      let region;
      try {
        ({ BucketRegion: region } = await client.send(new HeadBucketCommand({
          Bucket: bucket,
        })));
      } catch (err) {
        region = err?.$response?.headers?.["x-amz-bucket-region"];
        if (!region) {
          try {
            const command = new GetBucketLocationCommand({
              Bucket: bucket,
            });
            const { LocationConstraint: location } = await client.send(command);
            // S3 reports us-east-1 as an empty value and eu-west-1 as `EU`
            region = location === "EU"
              ? "eu-west-1"
              : location || "us-east-1";
          } catch {
            // fall through to the default region, without remembering it
          }
        }
      }
      if (!region) {
        if (requireVerified) {
          throw new ConfigurationError(`Could not determine the region of bucket \`${bucket}\`. Set \`Region\` (run **S3 - List Buckets** to see each bucket's region) and try again.`);
        }
        return defaultRegion;
      }
      bucketRegions.set(bucket, region);
      return region;
    },
    /**
     * Client for `bucket`, in the bucket's region. Also follows S3's region
     * redirect if the region still turns out to be wrong.
     */
    async _getS3Client(bucket, options) {
      return this.aws.getAWSClient(S3Client, await this.getBucketRegion(bucket, options), {
        followRegionRedirects: true,
      });
    },
    /**
     * This method creates an S3 bucket in the specified region.
     *
     * @param {string} bucketName - The name of the S3 bucket you'd like to create
     * @returns {Promise<object>} An object containing the new bucket's Location
     */
    async createBucket(params) {
      // S3 throws an error if you specify us-east-1 as the region in
      // the create bucket LocationConstraint. See https://stackoverflow.com/a/51912090
      const region = this.region || defaultRegion;
      if (region !== "us-east-1") {
        params.CreateBucketConfiguration = {
          LocationConstraint: region,
        };
      }
      const { Location } = await this._clientS3().send(new CreateBucketCommand(params));
      return {
        Location,
      };
    },
    /**
     * This method sets an S3 bucket's policy
     *
     * @param {string} bucketName - The name of the S3 bucket you'd like to create
     * @param {string} policy - The bucket policy JSON
     * @returns {Promise<object>} An object containing the put bucket policy response
     */
    async putBucketPolicy(params) {
      return this._clientS3().send(new PutBucketPolicyCommand(params));
    },
    /**
     * Lists the account's buckets with their regions. ListBuckets is not tied to
     * a bucket's region, so the default region's endpoint is used. S3 only
     * returns each bucket's `BucketRegion` when a paging parameter is sent, so
     * `MaxBuckets` is always set (callers page with `ContinuationToken`).
     */
    async listBuckets(params = {}) {
      return this._clientS3().send(new ListBucketsCommand({
        MaxBuckets: 10000,
        ...params,
      }));
    },
    async listObjectsV2(params) {
      const client = await this._getS3Client(params.Bucket);
      return client.send(new ListObjectsV2Command(params));
    },
    async getObject(params) {
      const client = await this._getS3Client(params.Bucket);
      return client.send(new GetObjectCommand(params));
    },
    async headObject(params, options) {
      const client = await this._getS3Client(params.Bucket, options);
      return client.send(new HeadObjectCommand(params));
    },
    /**
     * Copies an object. CopyObject is sent to the destination bucket's region,
     * which works for same-region and cross-region copies up to 5 GB.
     */
    async copyObject({
      sourceBucket, sourceKey, destinationBucket, destinationKey, ...params
    }) {
      const client = await this._getS3Client(destinationBucket);
      return client.send(new CopyObjectCommand({
        ...params,
        CopySource: `${sourceBucket}/${encodeURIComponent(sourceKey).replace(/%2F/g, "/")}`,
        Bucket: destinationBucket,
        Key: destinationKey,
      }));
    },
    async deleteObject(params, options) {
      const client = await this._getS3Client(params.Bucket, options);
      return client.send(new DeleteObjectCommand(params));
    },
    /**
     * Whether `key` exists in `bucket`. Only a definite "not found" counts as
     * missing: any other failure (e.g. access denied, which S3 also returns for
     * missing keys when the caller can't list the bucket) is rethrown so an
     * existing object is never overwritten by mistake.
     */
    async objectExists(bucket, key) {
      try {
        await this.headObject({
          Bucket: bucket,
          Key: key,
        });
        return true;
      } catch (err) {
        if (err?.name === "NotFound" || err?.$metadata?.httpStatusCode === 404) {
          return false;
        }
        throw err;
      }
    },
    async uploadFile(params) {
      const parallelUploads3 = new Upload({
        client: await this._getS3Client(params.Bucket),
        params,
      });
      return parallelUploads3.done();
    },
    async streamFile(fileUrl) {
      return axios(this, {
        url: fileUrl,
        responseType: "stream",
        returnFullResponse: true,
      });
    },
    async getBucketNotificationConfiguration(params) {
      return this._clientS3().send(new GetBucketNotificationConfigurationCommand(params));
    },
    async putBucketNotificationConfiguration(params) {
      return this._clientS3().send(new PutBucketNotificationConfigurationCommand(params));
    },
  },
};
