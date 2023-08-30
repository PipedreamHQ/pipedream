import {
  axios,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "docusign-envelope-sent-or-complete",
  version: "0.0.4",
  name: "Envelope Sent or Complete",
  description: "Emit new event when an envelope status is set to sent or complete",
  type: "source",
  props: {
    docusign: {
      type: "app",
      app: "docusign",
    },
    db: "$.service.db",
    timer: {
      label: "Polling Interval",
      description: "Pipedream will poll the Docusign API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    account: {
      type: "string",
      label: "Account",
      description: "Docusign Account",
      async options() {
        const { accounts } = await this.getUserInfo({});
        return accounts.map((account) => ({
          label: account.account_name,
          value: account.account_id,
        }));
      },
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "The envelope status that you are checking for",
      options: [
        "sent",
        "completed",
      ],
      default: [
        "sent",
      ],
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.docusign.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $, config,
    }) {
      config.headers = this._getHeaders();
      try {
        return await axios($ ?? this, config);
      } catch (e) {
        throw new Error(e.response.data.message);
      }
    },
    async getBaseUri({
      $, accountId,
    }) {
      const { accounts } = await this.getUserInfo({
        $,
      });
      const account = accounts.find((a) => a.account_id === accountId);
      const { base_uri: baseUri } = account;
      return `${baseUri}/restapi/v2.1/accounts/${accountId}/`;
    },
    async getUserInfo({ $ }) {
      const config = {
        method: "GET",
        url: "https://account.docusign.com/oauth/userinfo",
      };
      return this._makeRequest({
        $,
        config,
      });
    },
    async listEnvelopes(baseUri, params) {
      const config = {
        method: "GET",
        url: `${baseUri}envelopes`,
        params,
      };
      return this._makeRequest({
        config,
      });
    },
    _getLastEvent() {
      return this.db.get("lastEvent");
    },
    _setLastEvent(lastEvent) {
      this.db.set("lastEvent", lastEvent);
    },
    monthAgo() {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    generateMeta({
      envelopeId: id, emailSubject: summary, status,
    }, ts) {
      return {
        id: `${id}${status}`,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const { timestamp: ts } = event;
    const lastEvent = this._getLastEvent() || this.monthAgo().toISOString();
    const baseUri = await this.getBaseUri({
      accountId: this.account,
    });
    let done = false;
    const params = {
      from_date: lastEvent,
      status: this.status.join(),
    };
    do {
      const {
        envelopes = [],
        nextUri,
        endPosition,
      } = await this.listEnvelopes(baseUri, params);
      if (nextUri) {
        params.start_position += endPosition + 1;
      }
      else done = true;

      for (const envelope of envelopes) {
        const meta = this.generateMeta(envelope, ts);
        this.$emit(envelope, meta);
      }
    } while (!done);
    this._setLastEvent(new Date(ts * 1000).toISOString());
  },
};
