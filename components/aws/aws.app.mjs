import {
  EC2Client,
  DescribeRegionsCommand,
} from "@aws-sdk/client-ec2";
import {
  S3Client,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import {
  regions,
  defaultRegion,
} from "./common/regions.mjs";

export default {
  type: "app",
  app: "aws",
  propDefinitions: {
    region: {
      type: "string",
      label: "AWS Region",
      description: "The AWS region",
      default: defaultRegion,
      async options() {
        try {
          const { Regions } = await this.ec2ListRegions();
          return Regions.map((regionInfo) => regionInfo.RegionName).sort();
        } catch (error) {
          // Retrieval of available regions can fail if the registered account
          // does not have enough permissions to call the EC2 `DescribeRegions`
          // API. In that case, we default to the static list of regions.
          console.log(`Could not retrieve available regions from AWS. ${error}, falling back to default regions`);
          return regions;
        }
      },
    },
    eventData: {
      type: "object",
      label: "Event data",
      description: "A JSON object that will be sent as an event",
      optional: true,
    },
    objectKey: {
      type: "string",
      label: "Key",
      description: "The key of the object to download.",
      async options({
        region, bucket,
      }) {
        if (!bucket) {
          return [];
        }
        const { Contents: resources } = await this.listObjects({
          region,
          params: {
            Bucket: bucket,
          },
        });
        return resources
          .filter(({ Key: key }) => !key.endsWith("/"))
          .map(({ Key: key }) => key);
      },
    },
  },
  methods: {
    getAWSClient(clientType, region = defaultRegion) {
      return new clientType({
        credentials: {
          accessKeyId: this.$auth.accessKeyId,
          secretAccessKey: this.$auth.secretAccessKey,
        },
        region,
      });
    },
    async ec2ListRegions() {
      const client = this.getAWSClient(EC2Client);
      return client.send(new DescribeRegionsCommand({}));
    },
    listObjects({
      params, region,
    }) {
      const client = this.getAWSClient(S3Client, region);
      return client.send(new ListObjectsV2Command(params));
    },
    async pagination(fn, params, nextTokenAttr, lastTokenAttr = null) {
      let response;
      const results = [];
      do {
        response = await fn(params);
        results.push(...response.Items);
        params[nextTokenAttr] = lastTokenAttr
          ? response[lastTokenAttr]
          : response[nextTokenAttr];
      } while (params[nextTokenAttr]);
      response.Items = results;
      return response;
    },
  },
};
