import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "docupost",
  propDefinitions: {
    toName: {
      type: "string",
      label: "Recipient's Name",
      description: "The name of the recipient (who the letter/postcard is being sent to). Must be less than 40 characters.",
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
      description: "The [2-letter abbreviation code](https://pe.usps.com/text/pub28/28apb.htm) for the recipient's U.S. state.",
      options: constants.TWO_LETTER_ABBREVIATION_CODES,
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
      description: "The [2-letter abbreviation code](https://pe.usps.com/text/pub28/28apb.htm) for your sender's U.S. state.",
      options: constants.TWO_LETTER_ABBREVIATION_CODES,
    },
    fromZip: {
      type: "string",
      label: "Sender's Postal Code",
      description: "The 5-digit postal code for your sender/return address.",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getAuth(data) {
      return {
        ...data,
        api_token: this.$auth.api_token,
      };
    },
    async _makeRequest({
      $ = this, path, headers, params, ...args
    } = {}) {
      const response = await axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getAuth(headers),
        params: this.getAuth(params),
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
