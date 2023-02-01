import nordigen from "../../nordigen.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "nordigen-new-transaction",
  name: "New transaction",
  description: "Emit new event when a transaction occurs",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    nordigen,
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "When should the source check for a new event",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    countryCode: {
      propDefinition: [
        nordigen,
        "countryCode",
      ],
    },
    institutionId: {
      propDefinition: [
        nordigen,
        "institutionId",
        (({ countryCode }) => ({
          countryCode,
        })),
      ],
    },
    accessValidForDays: {
      propDefinition: [
        nordigen,
        "accessValidForDays",
      ],
    },
    maxHistoricalDays: {
      propDefinition: [
        nordigen,
        "maxHistoricalDays",
      ],
    },
  },
  methods: {
    _getRequisitionId() {
      return this.db.get("requisitionId");
    },
    _setRequisitionId(data) {
      this.db.set("requisitionId", data);
    },
    _getPreviousTransactions() {
      return this.db.get("previousTransactions") || [];
    },
    _setPreviousTransactions(data) {
      this.db.set("previousTransactions", data);
    },
    async createRequisitionLink() {
      const agreement = await this.nordigen.createEndUserAgreement({
        data: {
          institution_id: this.institutionId,
          max_historical_days: this.maxHistoricalDays,
          access_valid_for_days: this.accessValidForDays,
          access_scope: [
            "transactions",
          ],
        },
      });

      const requisitionLink = await this.nordigen.createRequisition({
        data: {
          redirect: "https://pipedream.com",
          institution_id: this.institutionId,
          reference: Date.now(),
          agreement: agreement.id,
          user_language: "EN",
        },
      });

      this._setRequisitionId(requisitionLink.id);
      console.log("New requisition link: " + requisitionLink.link);

      this.$emit({
        "requisition": requisitionLink.link,
      },
      {
        summary: "Requisition link",
        id: requisitionLink.id,
        ts: new Date(),
      });
    },
    async getRequisitionId() {
      const requisitionId = this._getRequisitionId();
      if (!requisitionId) {
        console.log("No requisition id found");
        await this.createRequisitionLink();
        return null;
      }
      return requisitionId;
    },
    async getAccount(requisitionId) {
      const requisition = await this.nordigen.getRequisition(requisitionId);

      if (requisition.accounts.length === 0) {
        console.log("No account found");
        await this.createRequisitionLink();
        return null;
      }

      return requisition.accounts[0];
    },
  },
  async run() {
    const requisitionId = await this.getRequisitionId();
    if (!requisitionId) {
      return;
    }

    const accountId = await this.getAccount(requisitionId);
    if (!accountId) {
      return;
    }
    console.log("Account found: " + accountId);

    const transactions = await this.nordigen.listTransactions(accountId);
    transactions.forEach((transaction) => {
      this.$emit(transaction, {
        summary: transaction.remittanceInformationUnstructuredArray[0],
        id: transaction.transactionId,
        ts: new Date(),
      });
    });
  },
};
