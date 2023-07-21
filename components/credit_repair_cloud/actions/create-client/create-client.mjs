import app from "./credit_repair_cloud.app.mjs";

export default {
  name: "Create Client",
  description: "Create Client [See the documentation](https://www.creditrepaircloud.com/api/1.0/docs#!/Clients/post_clients).",
  key: "credit_repair_cloud-create-client",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    firstname: {
      propDefinition: [
        app,
        "firstname",
      ],
    },
    lastname: {
      propDefinition: [
        app,
        "lastname",
      ],
    },
    middlename: {
      propDefinition: [
        app,
        "middlename",
      ],
    },
    suffix: {
      propDefinition: [
        app,
        "suffix",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone_home: {
      propDefinition: [
        app,
        "phone_home",
      ],
    },
    phone_work: {
      propDefinition: [
        app,
        "phone_work",
      ],
    },
    phone_mobile: {
      propDefinition: [
        app,
        "phone_mobile",
      ],
    },
    street_adress: {
      propDefinition: [
        app,
        "street_adress",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    post_code: {
      propDefinition: [
        app,
        "post_code",
      ],
    },
    ssno: {
      propDefinition: [
        app,
        "ssno",
      ],
    },
    birth_date: {
      propDefinition: [
        app,
        "birth_date",
      ],
    },
    memo: {
      propDefinition: [
        app,
        "memo",
      ],
    },
    previous_mailing_address: {
      propDefinition: [
        app,
        "previous_mailing_address",
      ],
    },
    previous_city: {
      propDefinition: [
        app,
        "previous_city",
      ],
    },
    previous_state: {
      propDefinition: [
        app,
        "previous_state",
      ],
    },
    previous_zip: {
      propDefinition: [
        app,
        "previous_zip",
      ],
    },
    client_assigned_to: {
      propDefinition: [
        app,
        "client_assigned_to",
      ],
    },
    client_portal_access: {
      propDefinition: [
        app,
        "client_portal_access",
      ],
    },
    client_userid: {
      propDefinition: [
        app,
        "client_userid",
      ],
    },
    client_agreement: {
      propDefinition: [
        app,
        "client_agreement",
      ],
    },
    send_setup_password_info_via_email: {
      propDefinition: [
        app,
        "send_setup_password_info_via_email",
      ],
    },
    referred_by_firstname: {
      propDefinition: [
        app,
        "referred_by_firstname",
      ],
    },
    referred_by_lastname: {
      propDefinition: [
        app,
        "referred_by_lastname",
      ],
    },
    referred_by_email: {
      propDefinition: [
        app,
        "referred_by_email",
      ],
    },
    async run() {
      /* const {
        app,
        ...data
      } = this;
      const client = await $.createClient(data);
      const response = await $.createClient(data);
      $.export("summary", `Organization successfully created.`);
      return data
      */
    },
  },
};
