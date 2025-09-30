import app from "../../retriever.app.mjs";

export default {
  key: "retriever-create-device-return",
  name: "Create Device Return",
  description: "Creates a device return order. [See the documentation](https://app.helloretriever.com/api/v1/docs/#tag/Device-Return-Orders/operation/Submit%20Order)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    requestCharger: {
      type: "boolean",
      label: "Request Charger",
      description: "Whether or not to request a charger with the device return.",
    },
    employeeInfoEmail: {
      type: "string",
      label: "Employee Info Email",
      description: "Optional email address for notifying the employee when a box ships and is delivered, as well as sending reminders.",
      optional: true,
    },
    employeeInfoName: {
      type: "string",
      label: "Employee Info Name",
      description: "The employee name to print on the shipping label.",
    },
    employeeInfoAddressLine1: {
      type: "string",
      label: "Employee Info Address Line 1",
      description: "The first line of the employee's address (typically the street address), or a full, comma-separated address. If providing the *Employee Info Address Line 1*, *Employee Info Address City*, *Employee Info Address State*, and *Employee Info Address Zip* are required (*Employee Info Address Line 2* remains optional). If providing a full address, it is best to use the format `1 Main St, New York, NY 10001` or `1 Main St, Apt 200, New York, NY 10001`. We will attempt to parse any full address, but cannot guarantee accuracy - especially if other formats are used. It is highly recommended to provide the address in separate fields.",
    },
    employeeInfoAddressLine2: {
      type: "string",
      label: "Employee Info Address Line 2",
      description: "Optional second line of the employee's address.",
      optional: true,
    },
    employeeInfoAddressCity: {
      type: "string",
      label: "Employee Info Address City",
      description: "Optional if a full address is provided in *Employee Info Address Line 1*. Required otherwise.",
      optional: true,
    },
    employeeInfoAddressState: {
      type: "string",
      label: "Employee Info Address State",
      description: "Optional if a full address is provided in *Employee Info Address Line 1*. Required otherwise.",
      optional: true,
    },
    employeeInfoAddressZip: {
      type: "string",
      label: "Employee Info Address Zip",
      description: "Optional if a full address is provided in *Employee Info Address Line 1*. Required otherwise.",
      optional: true,
    },
    companyInfoReturnRecipientName: {
      type: "string",
      label: "Company Info Return Recipient Name",
      description: "The return recipient name to print on the shipping label.",
    },
    companyInfoReturnAddressCompany: {
      type: "string",
      label: "Company Info Return Address Company",
      description: "The return recipient company to print on the shipping label.",
      optional: true,
    },
    companyInfoReturnAddressLine1: {
      type: "string",
      label: "Company Info Return Address Line 1",
      description: "The first line of the return address (typically the street address), or a full, comma-separated address. If providing the *Company Info Return Address Line 1*, *Company Info Return Address City*, *Company Info Return Address State*, and *Company Info Return Address  Zip* are required (*Company Info Return Address Line 2* remains optional). If providing a full address, it is best to use the format `1 Main St, New York, NY 10001` or `1 Main St, Apt 200, New York, NY 10001`. We will attempt to parse any full address, but cannot guarantee accuracy - especially if other formats are used. It is highly recommended to provide the address in separate fields.",
    },
    companyInfoReturnAddressLine2: {
      type: "string",
      label: "Company Info Return Address Line 2",
      description: "Optional second line of the return address.",
      optional: true,
    },
    companyInfoReturnAddressCity: {
      type: "string",
      label: "Company Info Return Address City",
      description: "Optional if a full address is provided in *Company Info Return Address Line 1*. Required otherwise.",
      optional: true,
    },
    companyInfoReturnAddressState: {
      type: "string",
      label: "Company Info Return Address State",
      description: "Optional if a full address is provided in *Company Info Return Address Line 1*. Required otherwise.",
      optional: true,
    },
    companyInfoReturnAddressZip: {
      type: "string",
      label: "Company Info Return Address Zip",
      description: "Optional if a full address is provided in *Company Info Return Address Line 1*. Required otherwise.",
      optional: true,
    },
    companyInfoDisplayName: {
      type: "string",
      label: "Company Info Display Name",
      description: "Used in email communications with the employee.",
    },
    companyInfoNotificationEmail: {
      type: "string",
      label: "Company Info Notification Email",
      description: "Optional email address for updates on the status of this device return.",
      optional: true,
    },
  },
  methods: {
    createDeviceReturn(args = {}) {
      return this.app.post({
        path: "/device_returns/",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      createDeviceReturn,
      requestCharger,
      employeeInfoEmail,
      employeeInfoName,
      employeeInfoAddressLine1,
      employeeInfoAddressLine2,
      employeeInfoAddressCity,
      employeeInfoAddressState,
      employeeInfoAddressZip,
      companyInfoReturnRecipientName,
      companyInfoReturnAddressCompany,
      companyInfoReturnAddressLine1,
      companyInfoReturnAddressLine2,
      companyInfoReturnAddressCity,
      companyInfoReturnAddressState,
      companyInfoReturnAddressZip,
      companyInfoDisplayName,
      companyInfoNotificationEmail,
    } = this;

    const response = await createDeviceReturn({
      step,
      data: {
        request_charger: requestCharger,
        employee_info: {
          email: employeeInfoEmail,
          name: employeeInfoName,
          address_line_1: employeeInfoAddressLine1,
          address_line_2: employeeInfoAddressLine2,
          address_city: employeeInfoAddressCity,
          address_state: employeeInfoAddressState,
          address_zip: employeeInfoAddressZip,
        },
        company_info: {
          return_recipient_name: companyInfoReturnRecipientName,
          return_address_company: companyInfoReturnAddressCompany,
          return_address_line_1: companyInfoReturnAddressLine1,
          return_address_line_2: companyInfoReturnAddressLine2,
          return_address_city: companyInfoReturnAddressCity,
          return_address_state: companyInfoReturnAddressState,
          return_address_zip: companyInfoReturnAddressZip,
          display_name: companyInfoDisplayName,
          notification_email: companyInfoNotificationEmail,
        },
      },
    });

    step.export("$summary", `Successfully created device return order with ID \`${response.id}\``);

    return response;
  },
};
