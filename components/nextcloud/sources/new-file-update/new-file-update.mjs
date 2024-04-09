import nextcloud from "../../nextcloud.app.mjs";

export default {
  key: "nextcloud-new-file-update",
  name: "New File Update",
  description: "Emits an event whenever a file is either created or updated in Nextcloud",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    nextcloud,
    directory: {
      propDefinition: [
        nextcloud,
        "directory",
      ],
    },
    fileType: {
      propDefinition: [
        nextcloud,
        "fileType",
      ],
      optional: true,
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,  // 15 minutes
      },
    },
  },
  methods: {
    getEventMeta(event) {
      const {
        id, timestamp, name,
      } = event;
      const summary = `New File Update: ${name}`;
      return {
        id,
        summary,
        ts: timestamp,
      };
    },
  },
  async run() {
    const {
      directory, fileType,
    } = this;

    const params = {
      directory,
    };

    if (fileType) {
      params.fileType = fileType;
    }

    const lastEvent = this.db.get("lastEvent") || {
      timestamp: 0,
    };
    const events = await this.nextcloud.emitFileEvent(params);

    for (const event of events) {
      if (event.timestamp > lastEvent.timestamp) {
        this.$emit(event, this.getEventMeta(event));
        if (event.timestamp > lastEvent.timestamp) {
          lastEvent.timestamp = event.timestamp;
          this.db.set("lastEvent", lastEvent);
        }
      }
    }
  },
};
