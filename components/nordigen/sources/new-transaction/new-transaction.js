import hash from 'object-hash';
import axios from "axios";

export default {
  name: "New transaction",
  description: "This source emits an event when a new transaction occurs",
  props: {
    db: "$.service.db",
    nordigen: {
      type: "app",
      app: "nordigen",
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
            "accept": `application/json`,
          }
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

    const requisition_id = this.db.get("requisition_id");

    // ========== 3 LIST ACCOUNTS ==========

    if(requisition_id != null) {

      const step_3 = await axios({
        url: `https://ob.nordigen.com/api/v2/requisitions/${requisition_id}`,
        method: 'GET',
        headers: {
          "accept": "application/json",
        "Authorization": `Bearer ${this.nordigen.$auth.oauth_access_token}`,
        }
      });

      if(step_3.data.accounts.length > 0) {
        console.log("Account found: " + step_3.data.accounts[0]);

        // ========== 4 LIST TRANSACTIONS ==========

        const step_4 = await axios({
          url: `https://ob.nordigen.com/api/v2/accounts/${step_3.data.accounts[0]}/transactions`,
          method: 'GET',
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${this.nordigen.$auth.oauth_access_token}`,
          }
        });
        
        const transactions = step_4.data.transactions.booked;

        var new_transactions = [];
        var current_transactions = [];

        //Retrieve the previous transaction ids
        const previous_transactions = this.db.get("previous_transactions") || [];

        //For each transaction
        for(const transaction of transactions) {
          const transaction_hash = hash(transaction);

          //Add the transaction id to the current transactions list
          current_transactions.push(transaction_hash);

          //If the transaction id is not in the previous transactions list
          if(!previous_transactions.includes(transaction_hash)){
            //Add it to the new transactions list
            new_transactions.push(transaction);
          }
        }

        //Save the current transactions ids list
        this.db.set("previous_transactions", current_transactions);

        new_transactions.forEach((new_transaction) => {
          this.$emit(new_transaction);
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

    const step_5 = await axios({
      url: `https://ob.nordigen.com/api/v2/agreements/enduser/`,
      method: 'POST',
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
          "transactions"
        ]
      }
    });

    // ========== 6 BUILD REQUISITION LINK ==========

    const step_6 = await axios({
      url: `https://ob.nordigen.com/api/v2/requisitions/`,
      method: 'POST',
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.nordigen.$auth.oauth_access_token}`,
      },
      data: {
        "redirect": "https://pipedream.com",
        "institution_id": this.institution_id,
        "reference": Date.now(),
        "agreement": step_5.id,
        "user_language":"EN"
      }
    });

    // ========== 7 SAVE REQUISITION ID ==========

    this.db.set("requisition_id", step_6.data.id);
    console.log("New requisition link: " + step_6.data.link);

    // ========== 8 SEND LINK ==========
    
    this.$emit({
      "requisition": step_6.data.link,
    });
  }
};
