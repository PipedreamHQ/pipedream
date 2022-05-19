import aws from "../aws.app.mjs";
import {
  S3Client,
  CreateBucketCommand,
  ListBucketsCommand,
  GetObjectCommand,
  PutObjectCommand,
  PutBucketPolicyCommand,
  GetBucketNotificationConfigurationCommand,
  PutBucketNotificationConfigurationCommand,
} from "@aws-sdk/client-s3";
import axios from "axios"; // need axios response headers

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "The AWS region tied to your S3, e.g `us-east-1` or `us-west-2`",
    },
    bucket: {
      type: "string",
      label: "S3 Bucket Name",
      description: "The S3 Bucket Name",
      async options() {
        const response = await this.listBuckets();
        return response.Buckets.map((bucket) => bucket.Name);
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
    _clientS3() {
      return this.aws.getAWSClient(S3Client, this.region);
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
      if (this.region !== "us-east-1") {
        params.CreateBucketConfiguration = {
          LocationConstraint: this.region,
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
    async listBuckets() {
      return this._clientS3().send(new ListBucketsCommand({}));
    },
    async getObject(params) {
      return this._clientS3().send(new GetObjectCommand(params));
    },
    async uploadFile(params) {
      return this._clientS3().send(new PutObjectCommand(params));
    },
    async streamFile(fileUrl) {
      return axios.get(fileUrl, {
        responseType: "stream",
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
