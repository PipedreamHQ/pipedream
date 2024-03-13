import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docupost",
  propDefinitions: {
    apiToken: {
      type: "string",
      label: "API Token",
      description: "Your DocuPost account API token used to authenticate all API requests.",
      secret: true,
    },
    toName: {
      type: "string",
      label: "Recipient's Name",
      description: "The name of the recipient. Must be less than 40 characters.",
    },
    toAddress1: {
      type: "string",
      label: "Recipient's Address Line 1",
      description: "The first line of the recipient's address.",
    },
    toAddress2: {
      type: "string",
      label: "Recipient's Address Line 2",
      description: "The second line of the recipient's address.",
      optional: true,
    },
    toCity: {
      type: "string",
      label: "Recipient's City",
      description: "The city of the recipient.",
    },
    toState: {
      type: "string",
      label: "Recipient's State",
      description: "The 2-letter abbreviation code for the recipient's U.S. state.",
    },
    toZip: {
      type: "string",
      label: "Recipient's Postal Code",
      description: "The 5-digit postal code for the recipient.",
    },
    fromName: {
      type: "string",
      label: "Sender's Name",
      description: "Your sender/return address name. Must be less than 40 characters.",
    },
    fromAddress1: {
      type: "string",
      label: "Sender's Address Line 1",
      description: "The first line of your sender/return address.",
    },
    fromAddress2: {
      type: "string",
      label: "Sender's Address Line 2",
      description: "The second line of your sender/return address.",
      optional: true,
    },
    fromCity: {
      type: "string",
      label: "Sender's City",
      description: "The city of your sender/return address.",
    },
    fromState: {
      type: "string",
      label: "Sender's State",
      description: "The 2-letter abbreviation code for your sender's U.S. state.",
    },
    fromZip: {
      type: "string",
      label: "Sender's Postal Code",
      description: "The 5-digit postal code for your sender/return address.",
    },
    letterPdfUrl: {
      type: "string",
      label: "Letter PDF URL",
      description: "A valid PDF URL for the letter content. 10mb max. 8.5x11 recommended.",
    },
    postcardFrontImageUrl: {
      type: "string",
      label: "Postcard Front Image URL",
      description: "A valid image URL for the front of your postcard. Image should be 1875 x 1275. PNG recommended.",
    },
    postcardBackText: {
      type: "string",
      label: "Postcard Back Text",
      description: "Text for the back of the postcard.",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color Printing",
      description: "Whether the document should be in color. 'true' or 'false'. Defaults to false.",
      options: [
        "true",
        "false",
      ],
      optional: true,
    },
    doubleSided: {
      type: "string",
      label: "Double-Sided Printing",
      description: "Whether the document should be printed double-sided. 'true' or 'false'. Defaults to true.",
      options: [
        "true",
        "false",
      ],
      optional: true,
    },
    mailClass: {
      type: "string",
      label: "Mail Class",
      description: "Must be 'usps_first_class' or 'usps_standard'. Defaults to 'usps_first_class'.",
      options: [
        "usps_first_class",
        "usps_standard",
      ],
      optional: true,
    },
    serviceLevel: {
      type: "string",
      label: "Service Level",
      description: "Only available for 'usps_first_class' mailings. Should be blank for non-certified, or 'certified' or 'certified_return_receipt'.",
      options: [
        "",
        "certified",
        "certified_return_receipt",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.docupost.com/api/1.1/wf";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    async sendLetter({
      apiToken,
      toName,
      toAddress1,
      toAddress2,
      toCity,
      toState,
      toZip,
      fromName,
      fromAddress1,
      fromAddress2,
      fromCity,
      fromState,
      fromZip,
      letterPdfUrl,
      color = "false",
      doubleSided = "true",
      mailClass = "usps_first_class",
      serviceLevel = "",
    }) {
      const queryParams = new URLSearchParams({
        api_token: apiToken,
        to_name: toName,
        to_address1: toAddress1,
        to_address2: toAddress2 || "",
        to_city: toCity,
        to_state: toState,
        to_zip: toZip,
        from_name: fromName,
        from_address1: fromAddress1,
        from_address2: fromAddress2 || "",
        from_city: fromCity,
        from_state: fromState,
        from_zip: fromZip,
        pdf: letterPdfUrl,
        color,
        doublesided: doubleSided,
        class: mailClass,
        servicelevel: serviceLevel,
      });

      return this._makeRequest({
        path: "/sendletter",
        params: queryParams,
      });
    },
    async sendPostcard({
      apiToken,
      toName,
      toAddress1,
      toAddress2,
      toCity,
      toState,
      toZip,
      fromName,
      fromAddress1,
      fromAddress2,
      fromCity,
      fromState,
      fromZip,
      postcardFrontImageUrl,
      postcardBackText,
      color = "true",
    }) {
      const queryParams = new URLSearchParams({
        api_token: apiToken,
        to_name: toName,
        to_address1: toAddress1,
        to_address2: toAddress2 || "",
        to_city: toCity,
        to_state: toState,
        to_zip: toZip,
        from_name: fromName,
        from_address1: fromAddress1,
        from_address2: fromAddress2 || "",
        from_city: fromCity,
        from_state: fromState,
        from_zip: fromZip,
        front_image: postcardFrontImageUrl,
        back_text: postcardBackText,
        color,
      });

      return this._makeRequest({
        path: "/sendpostcard",
        params: queryParams,
      });
    },
  },
  version: "0.0.{{ts}}",
};
