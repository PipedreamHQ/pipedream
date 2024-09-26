import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

export default {
  type: "app",
  app: "digitalocean_spaces",
  propDefinitions: {
    files: {
      type: "string[]",
      label: "Files",
      description: "The list of files to be deleted",
      async options({ bucket }) {
        const files = await this.listFiles({
          Bucket: bucket,
        });
        return files.map((file) => file.Key);
      },
    },
    prefix: {
      type: "string",
      label: "Prefix",
      description: "Limits the response to keys that begin with the specified prefix",
      optional: true,
    },
    acl: {
      type: "string",
      label: "ACL",
      description: "The canned ACL to apply to the object",
      options: [
        "private",
        "public-read",
        "public-read-write",
        "authenticated-read",
        "aws-exec-read",
        "bucket-owner-read",
        "bucket-owner-full-control",
      ],
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "A standard MIME type describing the format of the object data. Eg. `text/plain`",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "A map of metadata to store with the object in S3.",
      optional: true,
    },
  },
  methods: {
    getAWSClient(clientType) {
      this.region = this.$auth.region; // sets this so it is accessible by app and methods
      return new clientType({
        forcePathStyle: false, // Configures to use subdomain/virtual calling format.
        endpoint: `https://${this.region}.digitaloceanspaces.com`,
        region: this.region,
        credentials: {
          accessKeyId: this.$auth.key,
          secretAccessKey: this.$auth.secret,
        },
      });
    },
    _clientS3() {
      return this.getAWSClient(S3Client);
    },
    async listFiles(params) {
      const files = [];
      do {
        const response = await this._clientS3().send(new ListObjectsV2Command(params));
        files.push(...response.Contents);
        params.ContinuationToken = response.NextContinuationToken;
        console.log(params.ContinuationToken);
      } while (params.ContinuationToken);
      return files;
    },
    async deleteFiles(params) {
      return this._clientS3().send(new DeleteObjectsCommand(params));
    },
  },
};
