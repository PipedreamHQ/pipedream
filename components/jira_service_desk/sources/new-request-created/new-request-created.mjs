import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-new-request-created",
  name: "New Request Created",
  description:
    "Emits an event when a new customer request is created. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/#api-rest-servicedeskapi-request-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    jiraServiceDesk,
    cloudId: {
      propDefinition: [
        jiraServiceDesk,
        "cloudId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") ?? Date.now();
    },
    _setLastDate(value) {
      this.db.set("lastDate", value);
    },
  },
  async run() {
    const newDate = Date.now();
    const lastDate = this._getLastDate();

    const { cloudId } = this;
    const requests = await this.jiraServiceDesk.getCustomerRequests({
      cloudId,
    });

    requests
      ?.filter?.(({ createdDate: { epochMillis } }) => epochMillis > lastDate)
      .forEach((req) => {
        const id = req.issueId;
        const summary =
          req.requestFieldValues.find(({ fieldId }) => fieldId === "summary")
            ?.value ?? req.issueKey;
        const ts = req.createdDate.epochMillis;
        this.$emit(req, {
          id,
          summary: `New Request: ${summary}`,
          ts,
        });
      });

    this._setLastDate(newDate);
  },
};
