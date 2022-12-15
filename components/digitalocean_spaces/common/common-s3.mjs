/* eslint-disable no-unused-vars */
import app from "../digitalocean_spaces.app.mjs";
import pipedreamS3 from "../../aws/common/common-s3.mjs";

export default {
  props: {
    aws: app,
    bucket: pipedreamS3.props.bucket,
  },
  methods: {
    ...pipedreamS3.methods,
  },
};
