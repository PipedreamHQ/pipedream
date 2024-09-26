import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import jiraServiceDesk from "../jira_service_desk.app.mjs";

export default {
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
    getSummary() {
      throw new Error("Summary method not implemented in component");
    },
    getRequestDate() {
      throw new Error("Date method not implemented in component");
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
      ?.filter?.((req) => this.getRequestDate(req) > lastDate)
      .forEach((req) => {
        const ts = this.getRequestDate(req);
        const id = req.issueId + ts.toString();
        const summary =
          req.requestFieldValues.find(({ fieldId }) => fieldId === "summary")
            ?.value ?? req.issueKey;
        this.$emit(req, {
          id,
          summary: `${this.getSummary()}: ${summary}`,
          ts,
        });
      });

    this._setLastDate(newDate);
  },
};
