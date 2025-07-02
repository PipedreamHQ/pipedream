import app from "../digitalocean_spaces.app.mjs";
import common from "../../aws/common/common-s3.mjs";

export default {
  ...common,
  props: {
    aws: app,
    bucket: common.props.bucket,
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
