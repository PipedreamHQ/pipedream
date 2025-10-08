import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Search Objects",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_cloud-search-objects",
  type: "action",
  description: "Search objects by a prefix, [See the docs](https://googleapis.dev/nodejs/storage/latest/Bucket.html#getFiles)",
  props: {
    googleCloud,
    bucketName: {
      propDefinition: [
        googleCloud,
        "bucketName",
      ],
    },
    prefix: {
      label: "Prefix",
      description: "The directory prefix to search for",
      type: "string",
    },
    delimiter: {
      label: "Delimiter",
      description: "The delimiter to use",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      bucketName,
      prefix,
      delimiter,
    } = this;
    const options = {
      prefix,
      delimiter,
    };
    const [
      resp,
    ] = await this.googleCloud.storageClient()
      .bucket(bucketName)
      .getFiles(options);
    $.export("$summary", `Retrieved objects with prefix ${prefix} in ${bucketName}`);
    return resp;
  },
};
