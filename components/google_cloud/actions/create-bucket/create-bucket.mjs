import googleCloud from "../../google_cloud.app.mjs";
import storageClasses from "../../utils/storageClasses.mjs";

export default {
  name: "Create Bucket",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_cloud-create-bucket",
  type: "action",
  description: "Creates a bucket on Google Cloud Storage [See the docs](https://googleapis.dev/nodejs/storage/latest/Bucket.html#create)",
  props: {
    googleCloud,
    bucketName: {
      label: "Bucket name",
      description: "The unique bucket name, Google Cloud Storage uses a flat namespace, so you can't create a bucket with a name that is already in use, [See the docs](https://cloud.google.com/storage/docs/naming-buckets)",
      type: "string",
    },
    location: {
      label: "Location",
      description: "Location of the bucket,  Defaults to 'US' [See the docs](https://cloud.google.com/storage/docs/locations)",
      type: "string",
      optional: true,
    },
    storageClass: {
      label: "Storage class",
      description: "Storage class, [See the docs](https://cloud.google.com/storage/docs/storage-classes)",
      type: "string",
      optional: true,
      default: "STANDARD",
      options: storageClasses,
    },
  },
  async run({ $ }) {
    const {
      bucketName,
      location,
      storageClass,
    } = this;
    const options = {
      location,
      storageClass,
    };
    await this.googleCloud.storageClient().createBucket(bucketName, options);
    $.export("$summary", `${bucketName} successfully created.`);
  },
};
