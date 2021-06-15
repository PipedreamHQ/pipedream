const zoho_crm = require("../../zoho_crm.app");
const get = require("lodash/get");

module.exports = {
  key: "zoho_crm-convert-lead",
  name: "Convert Lead",
  description: "Converts a lead into a contact or an account.",
  version: "0.0.30",
  type: "action",
  props: {
    zoho_crm,
    /*timer: {
        type: "$.interface.timer",
        default: {
          intervalSeconds: 60 * 15, // 15 minutes
        },
      },*/
    recordId: {
      type: "string",
      label: "Record Id",
      description:
        "Unique identifier of the record associated to the Lead you'd like to convert.",
        async options() {
          const options = [];
          const leads = [];
          let page = 1;
          let results;
          do {
            results = await this.zoho_crm.listModules(
              "Leads",
              "asc",
              "id,Full_Name,Email",
              page
            );
            const hasPageResults = get(results, ["data", "length"]);
            if (!hasPageResults) {
              console.log("No data available, skipping iteration");
              break;
            }
            results.data.forEach((account) => leads.push(account));
            if (results.info.more_records) {
              page = results.info.page + 1;
            }
          } while (results.info.more_records);
          for (const lead of leads) {
            options.push({
              label: `${lead.Full_Name} (${lead.Email})`,
              value: lead.id,
            });
          }
          return options;
        },
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite Lead Details?",
      default: false,
      description:
        "Specify if the Lead details must be overwritten in the Contact/Account/Deal based on lead conversion mapping configuration.",
    },
    notifyLeadOwner: {
      type: "boolean",
      label: "Notify Lead Owner?",
      default: false,
      description:
        "Specifies whether the lead owner must get notified about the lead conversion via email.",
    },
    notifyNewEntityOwner: {
      type: "boolean",
      label: "Notify New Contact/Account Owner?",
      default: true,
      description:
        "Specifies whether the user to whom the contact/account is assigned to must get notified about the lead conversion via email.",
    },
    accounts: {
      type: "string",
      label: "Accounts",
      description:
        "Use this key to associate an account with the lead being converted. Pass the unique and valid account ID.",
      optional: true,
      async options() {
        const options = [];
        const accounts = [];
        let page = 1;
        let results;
        do {
          results = await this.zoho_crm.listModules(
            "Accounts",
            "asc",
            "id,Account_Number,Account_Name,Account_Type",
            page
          );
          const hasPageResults = get(results, ["data", "length"]);
          if (!hasPageResults) {
            console.log("No data available, skipping iteration");
            break;
          }
          results.data.forEach((account) => accounts.push(account));
          if (results.info.more_records) {
            page = results.info.page + 1;
          }
        } while (results.info.more_records);
        for (const account of accounts) {
          options.push({
            label: `${account.Account_Number} - ${account.Account_Name} (${account.Account_Type})`,
            value: account.id,
          });
        }
        return options;
      },
    },
    contacts: {
      type: "string",
      label: "Contacts",
      description:
        "Use this key to associate a contact with the lead being converted. Pass the unique and valid contact ID.",
      optional: true,
      async options() {
        const options = [];
        const contacts = [];
        let page = 1;
        let results;
        do {
          results = await this.zoho_crm.listModules(
            "Contacts",
            "asc",
            "id,Full_Name,Title",
            page
          );
          const hasPageResults = get(results, ["data", "length"]);
          if (!hasPageResults) {
            console.log("No data available, skipping iteration");
            break;
          }
          results.data.forEach((contact) => contacts.push(contact));
          if (results.info.more_records) {
            page = results.info.page + 1;
          }
        } while (results.info.more_records);
        for (const contact of contacts) {
          options.push({
            label: `${contact.Full_Name} - ${contact.Title}`,
            value: contact.id,
          });
        }
        return options;
      },
    },
    users: {
      type: "string",
      label: "Users",
      description:
        "Use this key to assign record owner for the new contact and account. Pass the unique and valid user ID.",
      optional: true,
      async options() {
        const options = [];
        const users = [];
        let page = 1;
        let results;
        do {
          results = await this.zoho_crm.listUsers("AllUsers", page);
          const hasPageResults = get(results, ["users", "length"]);
          if (!hasPageResults) {
            console.log("No data available, skipping iteration");
            break;
          }
          results.users.forEach((user) => users.push(user));
          if (results.info.more_records) {
            page = results.info.page + 1;
          }
        } while (results.info.more_records);
        for (const user of users) {
          options.push({
            label: `${user.full_name} (${user.email})`,
            value: user.id,
          });
        }
        return options;
      },
    },
    deals: {
      type: "object",
      label: "Deals",
      description:
        'Use this key to create a deal for the newly created Account. The "Deal_Name", "Closing_Date", and "Stage" are default mandatory keys to be passed as part of the parameter  object structure.',
      optional: true,
    },
    carryOverTags: {
      type: "object",
      label: "Carry Over Tags?",
      description:
        "Use this key to carry over tags of the lead to contact, account, and deal. Refer to sample input for format.",
      optional: true,
    },
  },
  async run() {
    return await this.zoho_crm.convertLead(
      this.recordId,
      this.overwrite,
      this.notifyLeadOwner,
      this.notifyNewEntityOwner,
      this.accounts,
      this.contacts,
      this.users,
      this.deals,
      this.carryOverTags
    );
  },
};
