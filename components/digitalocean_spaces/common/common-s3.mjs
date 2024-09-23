import app from "../digitalocean_spaces.app.mjs";
import pipedreamS3 from "@pipedream/aws/common/common-s3.mjs";

export default {
  ...pipedreamS3,
  props: {
    aws: app,
    bucket: pipedreamS3.props.bucket,
    acl: {
      propDefinition: [
        app,
        "acl",
      ],
    },
    contentType: {
      propDefinition: [
        app,
        "contentType",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
};
