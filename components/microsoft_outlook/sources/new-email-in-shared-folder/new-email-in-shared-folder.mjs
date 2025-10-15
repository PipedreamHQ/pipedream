import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "microsoft_outlook-new-email-in-shared-folder",
  name: "New Email in Shared Folder Event",
  description: "Emit new event when an email is received in specified shared folders.",
  version: "0.0.2",
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
            $orderBy: "createdDateTime desc",
            $filter: `createdDateTime gt ${lastDate}`,
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
      if (responseArray.length) this._setLastDate(responseArray[0].createdDateTime);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.conversationId,
            summary: `A new email with id: "${item.conversationId}" was received!`,
            ts: item.createdDateTime,
          },
        );
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
