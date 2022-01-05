import hash from "object-hash";
import axios from "axios";

export default {
  key: "nordigen-new-transation",
  name: "New transaction",
  description: "Emit new event when a transaction occurs",
  version: "0.0.1",
  type: "source",
  props: {
    db: "$.service.db",
    nordigen: {
      type: "app",
      app: "nordigen",
      label: "Nordigen account",
      description: "Nordigen account on which your bank account is connected to",
      propDefinitions: {},
      methods: {
        // this.$auth contains connected account data
        authKeys() {
          console.log(Object.keys(this.$auth));
        },
      },
    },
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "When should the source check for a new event",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    country_code: {
      type: "string",
      label: "Enter a country code",
      description: "ISO 3166 two-character code for the country (eg. `FR`). Full list: https://www.iso.org/obp/ui/en/#iso:pub:PUB500001:en",
    },
    institution_id: {
      type: "string",
      label: "Institution",
      description: "Select your institution",
      async options() {
        const institutions = await axios({
          url: `https://ob.nordigen.com/api/v2/institutions/?country=${this.country_code}`,
          method: "GET",
          headers: {
            "Authorization": `Bearer ${this.nordigen.$auth.oauth_access_token}`,
            "accept": "application/json",
          },
        });
        return institutions.data.map((institution) => {
          return {
            label: institution.name,
            value: institution.id,
          };
        });
      },
    },
    access_valid_for_days: {
      type: "string",
      label: "Validity days",
      description: "Number of days the user agreement will be valid.",
    },
    max_historical_days: {
      type: "string",
      label: "Maximum historical days",
      description: "Number of days the user agreement will grand acess to when listing transactions.",
    },
  },

  async run() {

    // ========== 2 GET REQUISITION ID ==========

    const requisitionId = this.db.get("requisitionId");

    // ========== 3 LIST ACCOUNTS ==========

    if (requisitionId != null) {

      const step3 = await axios({
        url: `https://ob.nordigen.com/api/v2/requisitions/${requisitionId}`,
        method: "GET",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${this.nordigen.$auth.oauth_access_token}`,
        },
      });

      if (step3.data.accounts.length > 0) {
        console.log("Account found: " + step3.data.accounts[0]);

        // ========== 4 LIST TRANSACTIONS ==========

        const step4 = await axios({
          url: `https://ob.nordigen.com/api/v2/accounts/${step3.data.accounts[0]}/transactions`,
          method: "GET",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${this.nordigen.$auth.oauth_access_token}`,
          },
        });

        const transactions = step4.data.transactions.booked;

        var newTransactions = [];
        var currentTransactions = [];

        //Retrieve the previous transaction ids
        const previousTransactions = this.db.get("previousTransactions") || [];

        //For each transaction
        for (const transaction of transactions) {
          const transactionHash = hash(transaction);

          //Add the transaction id to the current transactions list
          currentTransactions.push(transactionHash);

          //If the transaction id is not in the previous transactions list
          if (!previousTransactions.includes(transactionHash)) {
            //Add it to the new transactions list
            newTransactions.push(transaction);
          }
        }

        //Save the current transactions ids list
        this.db.set("previousTransactions", currentTransactions);

        newTransactions.forEach((newTransaction) => {
          this.$emit(newTransaction);
        });
      }
      else {
        console.log("No account found");
        create_requisition_link();
      }
    }
    else {
      console.log("No requisition id found");
      create_requisition_link();
    }
  },

  async create_requisition_link() {
    // ========== 5 CREATE END USER AGREEMENT ==========

    const step5 = await axios({
      url: "https://ob.nordigen.com/api/v2/agreements/enduser/",
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.nordigen.$auth.oauth_access_token}`,
      },
      data: {
        "institution_id": this.institution_id,
        "max_historical_days": this.max_historical_days,
        "access_valid_for_days": this.access_valid_for_days,
        "access_scope": [
          "balances",
          "details",
          "transactions",
        ],
      },
    });

    // ========== 6 BUILD REQUISITION LINK ==========

    const step6 = await axios({
      url: "https://ob.nordigen.com/api/v2/requisitions/",
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.nordigen.$auth.oauth_access_token}`,
      },
      data: {
        "redirect": "https://pipedream.com",
        "institution_id": this.institution_id,
        "reference": Date.now(),
        "agreement": step5.id,
        "user_language": "EN",
      },
    });

    // ========== 7 SAVE REQUISITION ID ==========

    this.db.set("requisitionId", step6.data.id);
    console.log("New requisition link: " + step6.data.link);

    // ========== 8 SEND LINK ==========

    this.$emit({
      "requisition": step6.data.link,
    });
  },
};
