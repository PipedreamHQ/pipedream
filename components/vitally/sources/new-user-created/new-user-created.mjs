import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import vitally from "../../vitally.app.mjs";

export default {
  key: "vitally-new-user-created",
  name: "New User Created",
  version: "0.0.2",
  description: "Emit new event when a new user is created.",
  type: "source",
  dedupe: "unique",
  props: {
    vitally,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Vitally on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountId: {
      propDefinition: [
        vitally,
        "accountId",
      ],
      optional: true,
    },
    organizationId: {
      propDefinition: [
        vitally,
        "organizationId",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults) {
      const {
        vitally,
        accountId,
        organizationId,
      } = this;

      let responseArray = [];
      const lastDate = this._getLastDate();
      const items = vitally.paginate({
        fn: vitally.listUsers,
        accountId,
        organizationId,
        maxResults,
        params: {
          sortBy: "createdAt",
        },
      });

      for await (const item of items) {
        if (moment(item.createdAt).isSameOrBefore(lastDate)) {
          break;
        }
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0].createdAt);
      }

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: `A new user with id: "${responseItem.id}" was created!`,
            ts: responseItem.createdAt,
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
};
