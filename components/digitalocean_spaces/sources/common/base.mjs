import app from "../../digitalocean_spaces.app.mjs";
import pipedreamS3 from "../../../aws/common/common-s3.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...pipedreamS3,
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    aws: app,
    bucket: pipedreamS3.props.bucket,
    prefix: {
      propDefinition: [
        app,
        "prefix",
      ],
    },
  },
  async run() {
    const files = await this.aws.listFiles({
      Bucket: this.bucket,
      Prefix: this.prefix,
    });
    console.log(files);
    return files;
  },
};
