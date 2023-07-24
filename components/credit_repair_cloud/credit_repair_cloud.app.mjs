import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "credit_repair_cloud",
  propDefinitions: {
    type: {
      type: "string",
      label: "Type",
      description: "The type of the user.",
      options: [
        "Client",
        "Lead",
        "Lead/Inactive",
        "Inactive",
        "Suspended",
      ],
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "First name should be in string format.",
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "Last name should be in string format.",
    },
    middlename: {
      type: "string",
      label: "Middle Name",
      description: "Middle name should be in string format.",
      optional: true,
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "Suffix should be in string format.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email should be in email format.",
      optional: true,
    },
    phone_home: {
      type: "integer",
      label: "Home Phone",
      description: "Home Phone should be in 10 digit number format.",
      optional: true,
    },
    phone_work: {
      type: "integer",
      label: "Work Phone",
      description: "Work Phone should be in 10 digit number format.",
      optional: true,
    },
    phone_mobile: {
      type: "string",
      label: "Mobile Phone",
      description: "Mobile Phone format should be in (999) 999-9999.",
      optional: true,
    },
    street_address: {
      type: "string",
      label: "Street Address",
      description: "Street Address should be in string format.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City should be in string format.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State should be in abbreviations format.",
      optional: true,
    },
    post_code: {
      type: "integer",
      label: "Post Code",
      description: "Post code should be in number format.",
      optional: true,
    },
    ssno: {
      type: "integer",
      label: "SSN",
      description: "Social Security no.should be in 4 digit number format.",
      optional: true,
    },
    birth_date: {
      type: "string",
      label: "Birth Date",
      description: "Birth date should be in in mm/dd/yyyy format.",
      optional: true,
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "Memo should be in string format.",
      optional: true,
    },
    previous_mailing_address: {
      type: "string",
      label: "Previous Mailing Address",
      description: "Previous mailing address should be in string format. Previous mailing address (only if at current mailing address for less than 2 years)",
      optional: true,
    },
    previous_city: {
      type: "string",
      label: "Previous City",
      description: "Previous City should be in string format.",
      optional: true,
    },
    previous_state: {
      type: "string",
      label: "Previous State",
      description: "Previous State should be in abbreviations format.",
      optional: true,
    },
    previous_zip: {
      type: "integer",
      label: "Previous Zip",
      description: "Previous zip should be in number format.",
      optional: true,
    },
    client_assigned_to: {
      type: "string",
      label: "Client Assigned To",
      description: "Name of team members with comma separator for assing team members to client. Note: Pls login and go to [https://app.creditrepaircloud.com/mycompany/team](https://app.creditrepaircloud.com/mycompany/team) and Copy team member name in xml",
      optional: true,
    },
    client_portal_access: {
      type: "string",
      label: "Client Portal Access",
      description: "Portal Access for client. Values should be on or off [https://secureclientaccess.com](https://secureclientaccess.com). on = Client can access portal off = Client can not access portal",
      options: [
        "On",
        "Off",
      ],
      optional: true,
    },
    client_userid: {
      type: "string",
      label: "Client User ID",
      description: "Userid same as email Note: Only accepted if client_portal_access is on",
      optional: true,
    },
    client_agreement: {
      type: "string",
      label: "Client Agreement",
      description: "Agreement name should be in alphanumeric string. Note: Pls login and go to [https://app.creditrepaircloud.com/mycompany/agreement](https://app.creditrepaircloud.com/mycompany/agreement) and Copy agreement name in xml. Note: Only accepted if client_portal_access is on",
      optional: true,
    },
    send_setup_password_info_via_email: {
      type: "string",
      label: "Send Setup Password Info Via Email",
      description: "Syes = System will send login information via email and instructions for setting password to client. no = System will not send login information via email and instructions for setting password to client. Note: Only accepted if client_portal_access is on",
      options: [
        "Yes",
        "No",
      ],
      optional: true,
    },
    referred_by_firstname: {
      type: "string",
      label: "Referred By First Name",
      description: "Referred by first name should be in string format.",
      optional: true,
    },
    referred_by_lastname: {
      type: "string",
      label: "Referred By Last Name",
      description: "Referred by last name should be in string format.",
      optional: true,
    },
    referred_by_email: {
      type: "string",
      label: "Referred By Email",
      description: "Email should be in email format.",
      optional: true,
    },
    id: {
      type: "string",
      label: "ID",
      description: "Encrypted alphanumeric string.",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(this.$auth);
    },
    _getAuthKey() {
      return this.$auth.api_key;
    },
    _getAuthSecret() {
      return this.$auth.api_secret;
    },
    _getBaseUrl() {
      return "https://app.creditrepaircloud.com/api";
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        params: {
          ...opts.params,
          apiauthkey: this._getAuthKey(),
          secretkey: this._getAuthSecret(),
        },
      };
      return axios(ctx, axiosOpts);
    },
    createClient(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/lead/insertRecord",
        params: {
          xmlData: data,
        },
      });
    },
    updateClient(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/lead/updateRecord",
        params: {
          xmlData: data,
        },
      });
    },
    deleteClient(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/lead/deleteRecord",
        params: {
          xmlData: data,
        },
      });
    },
    getClient(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/lead/viewRecord",
        params: {
          xmlData: data,
        },
      });
    },
  },
};
