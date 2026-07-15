import md5 from "md5";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "microsoft_outlook-new-email-in-shared-folder",
  name: "New Email in Shared Folder Event",
  description: "Emit new event when an email is received in specified shared folders.",
  version: "0.0.20",
  type: "source",
  dedupe: "unique",
  props: {
    microsoftOutlook,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    userId: {
      propDefinition: [
        microsoftOutlook,
        "userId",
      ],
    },
    sharedFolderId: {
      propDefinition: [
        microsoftOutlook,
        "sharedFolderId",
        ({ userId }) => ({
          userId,
        }),
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00Z";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const items = this.microsoftOutlook.paginate({
        fn: this.microsoftOutlook.listSharedFolderMessages,
        args: {
          params: {
            $orderBy: "receivedDateTime desc",
            $filter: `receivedDateTime gt ${lastDate}`,
          },
          sharedFolderId: this.sharedFolderId,
          userId: this.userId,
        },
        max: maxResults,
      });

      let responseArray = [];

      for await (const item of items) {
        responseArray.push(item);
      }
      let newLastDate;
      try {
        for (const item of responseArray.reverse()) {
          const ts = Date.parse(item.receivedDateTime);
          this.$emit(
            item,
            {
              id: md5(item.id),
              summary: `A new email with subject ${item.subject} was received!`,
              ts,
            },
          );
          // advance the checkpoint only after a successful emit, so a failed
          // emit doesn't silently skip un-emitted events on the next poll
          newLastDate = item.receivedDateTime;
        }
      } finally {
        if (newLastDate) {
          this._setLastDate(newLastDate);
        }
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
