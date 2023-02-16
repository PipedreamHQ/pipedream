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
  methods: {
    ...pipedreamS3.methods,
    getKey(file) {
      return file.Key;
    },
    getKeyTimestamp(file) {
      return `${file.Key}-${file.LastModified}`;
    },
    updateFileList() {
      throw new Error("updateFileList not implemented");
    },
    emitEvents() {
      throw new Error("emitEvents not implemented");
    },
    getFileList() {
      return this.db.get("fileList") || [];
    },
    setFileList(fileList) {
      this.db.set("fileList", fileList);
    },
  },
  async run() {
    const files = await this.aws.listFiles({
      Bucket: this.bucket,
      Prefix: this.prefix,
    });
    const events = await this.updateFileList(files);
    await this.emitEvents(events);
  },
};
