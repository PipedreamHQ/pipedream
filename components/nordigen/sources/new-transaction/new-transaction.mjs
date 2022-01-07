import nordigen from "../../nordigen.app.mjs";
import axios from "axios";

// TODO: Add description docs
export default {
  key: "nordigen-new-transation",
  name: "New transaction",
  description: "Emit new event when a transaction occurs",
  version: "0.0.1",
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
        intervalSeconds: 60 * 60 * 24,
      },
    },
    country_code: {
      propDefinition: [
        nordigen,
        "country_code",
      ],
    },
    institution_id: {
      propDefinition: [
        nordigen,
        "institution_id",
        (({ country_code }) => ({
          country_code
        }))
      ],
    },
    access_valid_for_days: {
      type: "integer",
      label: "Validity days",
      description: "Number of days the user agreement will be valid.",
    },
    max_historical_days: {
      type: "integer",
      label: "Maximum historical days",
      description: "Number of days the user agreement will grand acess to when listing transactions.",
    },
  },
  methods: {
    _getRequisitionId() {
      return this.db.get("requisitionId")
    },
    _setRequisitionId(data) {
      this.db.set("requisitionId", data)
    },
    _getPreviousTransactions() {
      return this.db.get("previousTransactions") || [];
    },
    _setPreviousTransactions(data) {
      this.db.set("previousTransactions", data);
    },
    _emitEvent(data) {
      this.$emit(data, {
        // TODO: Summary and id???
        ts: Date.now(),
      });
    },
    async createRequisitionLink() {
      const agreementRes = await axios(this.nordigen._getAxiosParams({
        method: "POST",
        path: "/agreements/enduser/",
        data: {
          institution_id: this.institution_id,
          max_historical_days: this.max_historical_days,
          access_valid_for_days: this.access_valid_for_days,
          access_scope: [
            "transactions",
          ],
        },
      }));

      const requisitionLinkRes = await axios(this.nordigen._getAxiosParams({
        method: "POST",
        path: "/requisitions",
        data: {
          "redirect": "https://pipedream.com",
          "institution_id": this.institution_id,
          "reference": Date.now(),
          "agreement": agreementRes.data.id,
          "user_language": "EN",
        },
      }))
      console.log(requisitionLinkRes)
      // TODO: THere is a lot of results here, which one should be used as requisition id?
      return;
      
      this._setRequisitionId(requisitionLinkRes.data?.id)
      console.log("New requisition link: " + requisitionLinkRes.link);

      // TODO: Summary and id???
      this._emitEvent({
        "requisition": requisitionLinkRes.data.link,
      },
      {
         summary: "Requisition link",
      });
    },
    async getRequisitionId() {
      const requisitionId = this._getRequisitionId();
      if (!requisitionId) {
        console.log("No requisition id found");
        await this.createRequisitionLink();
        return null
      }
      return requisitionId;
    },
    async getAccount(requisitionId) {
      const requisitionsRes = await axios(this.nordigen._getAxiosParams({
        method: "GET",
        path: `/requisitions/${requisitionId}`,
      }))
  
      if (requisitionsRes.data.accounts.length === 0) {
        console.log("No account found");
        await this.createRequisitionLink();
        return null
      }

      return requisitionsRes.data.accounts[0]
    },
    async listTransactions(account) {
      const transactionsRes = await axios(this.nordigen._getAxiosParams({
        method: "GET",
        path: `/accounts/${account}/transaction`,
      }))
      return transactionsRes.data.transactions.booked;
    }
  },
  async run() {
    const requisitionId = await this.getRequisitionId();
    console.log(requisitionId);
    /* if (!requisitionId) {
      return
    }

    const account = await this.getAccount(requisitionId)
    console.log(account);
    if (!account) {
      return
    }
    console.log("Account found: " + account);

    const transactions = await this.listTransactions(account)
    transactions.forEach((transaction) => {
      this._emitEvent(transaction, {
        summary: transaction.remittanceInformationUnstructuredArray[0],
        id: transaction.transactionId,
        ts: new Date(),
      });
    }); */
  },
};
