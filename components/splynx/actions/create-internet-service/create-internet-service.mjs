import splynx from "../../splynx.app.mjs";

export default {
  key: "splynx-create-internet-service",
  name: "Create Internet Service",
  description: "Creates a new internet service with specified details. [See the documentation](https://splynx.docs.apiary.io/#reference/services/internet-services-collection/create-service)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    splynx,
    customerId: {
      propDefinition: [
        splynx,
        "customerId",
      ],
    },
    tariffId: {
      propDefinition: [
        splynx,
        "tariffId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the service",
      options: [
        "active",
        "disabled",
        "hidden",
        "pending",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the service",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Quantity",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date. Format: `YYYY-MM-DD`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date. Format: `YYYY-MM-DD`",
    },
    login: {
      type: "string",
      label: "Login",
      description: "Service login. Recommended to use customer login as prefix",
    },
    takingIpv4: {
      type: "integer",
      label: "Taking IPv4",
      description: "Taking IPv4",
      options: [
        {
          label: "None (Router will assign IP)",
          value: 0,
        },
        {
          label: "Permanent IP (from Static IPs)",
          value: 1,
        },
        {
          label: "Dynamic IP (from IP Pools)",
          value: 2,
        },
      ],
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to be passed in this request. [See the documentation](https://splynx.docs.apiary.io/#reference/services/internet-services-collection/create-service) for available parameters",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.splynx.createInternetService({
      $,
      customerId: this.customerId,
      data: {
        tariff_id: this.tariffId,
        status: this.status,
        description: this.description,
        quantity: this.quantity,
        start_date: this.startDate,
        end_date: this.endDate,
        login: this.login,
        taking_ipv4: this.takingIpv4,
        ...this.additionalOptions,
      },
    });

    $.export("$summary", `Successfully created a new internet service (ID: ${response.id})`);
    return response;
  },
};
