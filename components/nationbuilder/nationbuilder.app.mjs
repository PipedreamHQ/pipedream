import { axios } from "@pipedream/platform";
import {
  ELECTION_TYPES,
  FEC_TYPES,
  PAYMENT_TYPES,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "nationbuilder",
  propDefinitions: {
    actblueOrderNumber: {
      type: "integer",
      label: "ActBlue Order Number",
      description: "ActBlue order number.",
    },
    amountInCents: {
      type: "integer",
      label: "Amount In Cents",
      description: "Amount of donation in cents.",
    },
    checkNumber: {
      type: "string",
      label: "Check Number",
      description: "Check/wire/MO number.",
    },
    corporateContribution: {
      type: "boolean",
      label: "Corporate Contribution",
      description: "True if the donation is a corporate contribution.",
    },
    cycle: {
      type: "integer",
      label: "Cycle",
      description: "Election cycle.",
    },
    donationId: {
      type: "string",
      label: "Donation Id",
      description: "Donation id that will be used.",
      async options({ prevContext: { nextPage } }) {
        const params = {
          ...this.getPagination(nextPage),
        };

        const {
          results: data, next,
        } = await this.listDonations({
          params,
        });

        return {
          options: data.map(({
            id: value, amount, donor: {
              first_name: firstName, last_name: lastName, email,
            },
          }) => ({
            label: `${amount} - ${firstName} ${lastName} (${email})`,
            value,
          })),
          context: {
            nextPage: next,
          },
        };
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address for this person.",
    },
    employer: {
      type: "string",
      label: "Employer",
      description: "The name of the company for which this person works.",
    },
    facebookUsername: {
      type: "string",
      label: "Facebook Username",
      description: "The person's Facebook username.",
    },
    fecType: {
      type: "string",
      label: "Fec Type",
      description: "FEC code name.",
      options: FEC_TYPES,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The person's first name and middle names.",
    },
    isPrivate: {
      type: "boolean",
      label: "Is Private",
      description: "False if the donation should be posted publicly on the site.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name.",
    },
    ngpId: {
      type: "string",
      label: "NGP Id",
      description: "NGP Id of the person to match.",
    },
    note: {
      type: "string",
      label: "Note",
      description: "a note for this donation.",
    },
    paymentTypeName: {
      type: "string",
      label: "Payment Type Name",
      description: "The name of the payment type.",
      options: PAYMENT_TYPES,
    },
    party: {
      type: "string",
      label: "Party",
      description: "A one-letter code representing [provincial parties for nations](https://nationbuilder.com/support_for_international_parties).",
    },
    period: {
      type: "string",
      label: "Period",
      description: "Election period.",
      options: ELECTION_TYPES,
    },
    personId: {
      type: "string",
      label: "Person Id",
      description: "The id of the person you want to update.",
      async options({ prevContext: { nextPage } }) {
        const params = {
          ...this.getPagination(nextPage),
        };

        const {
          results: data, next,
        } = await this.listPeople({
          params,
        });

        return {
          options: data.map(({
            id: value, first_name: firstName, last_name: lastName, email, phone,
          }) => ({
            label: `${firstName} ${lastName} ${email || ""} ${phone || ""}`,
            value,
          })),
          context: {
            nextPage: next,
          },
        };
      },
    },
    personTags: {
      type: "string[]",
      label: "Tags",
      description: "The tags assigned to this person.",
      async options({ personId }) {
        const { taggings } = await this.listTags({
          personId,
        });

        return taggings.map(({ tag }) => tag);
      },
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "This person's home phone number.",
    },
    recruiterNameOrEmail: {
      type: "string",
      label: "Recruiter Name Or Email",
      description: "Recruiter's name or email address (will also be credited as the fundraiser for this donation).",
    },
    registeredAddress1: {
      type: "string",
      label: "Registered Address 1",
      description: "First Address Line.",
    },
    registeredAddress2: {
      type: "string",
      label: "Registered Address 2",
      description: "Second Address Line.",
    },
    registeredAddress3: {
      type: "string",
      label: "Registered Address 3",
      description: "Third Address Line.",
    },
    registeredAddressCity: {
      type: "string",
      label: "Registered Address City",
      description: "The city of the registered address.",
    },
    registeredAddressCountryCode: {
      type: "string",
      label: "Registered Address Country Code",
      description: "The country code of the registered address (using ISO-3166-1 alpha-2).",
    },
    registeredAddressLat: {
      type: "string",
      label: "Registered Address Lat",
      description: "The latitude of the registered address (using WGS-84).",
    },
    registeredAddressLng: {
      type: "string",
      label: "Registered Address Lng",
      description: "The longitude of the registered address (using WGS-84).",
    },
    registeredAddressState: {
      type: "string",
      label: "Registered Address State",
      description: "The state of the registered address.",
    },
    registeredAddressZip: {
      type: "string",
      label: "Registered Address Zip",
      description: "The zip code of the registered address.",
    },
    sex: {
      type: "string",
      label: "Sex",
      description: "This person's gender.",
      options: [
        "F",
        "M",
        "O",
      ],
    },
    signupType: {
      type: "string",
      label: "Signup Type",
      description: "The type of signup for this person.",
      options: [
        {
          label: "Person",
          value: "0",
        },
        {
          label: "Organization",
          value: "1",
        },
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags assigned to this person.",
    },
    trackingCodeSlug: {
      type: "string",
      label: "Tracking Code Slug",
      description: "Tracking code for this donation.",
    },
    twitterLogin: {
      type: "string",
      label: "Twitter Login",
      description: "The person's Twitter login name.",
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.slug}.nationbuilder.com/api/v1`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    getPagination(nextPage) {
      let __token = "";
      let __nonce = "";
      const options = {};
      if (nextPage) {
        __token = (nextPage.match(/__token=[^&]+/g)[0]).slice(8);
        __nonce = (nextPage.match(/__nonce=[^&]+/g)[0]).slice(8);
      }

      if (__token) options.__token = __token;
      if (__nonce) options.__nonce = __nonce;

      return options;
    },
    addTags({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `people/${personId}/taggings`,
        ...args,
      });
    },
    createDonation(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "donations",
        ...args,
      });
    },
    createMembership({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `people/${personId}/memberships`,
        ...args,
      });
    },
    createPerson(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "people",
        ...args,
      });
    },
    deleteDonation({
      donationId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `donations/${donationId}`,
        ...args,
      });
    },
    listDonations(args = {}) {
      return this._makeRequest({
        path: "donations",
        ...args,
      });
    },
    listPeople(args = {}) {
      return this._makeRequest({
        path: "people",
        ...args,
      });
    },
    listTags({
      personId, ...args
    }) {
      return this._makeRequest({
        path: `people/${personId}/taggings`,
        ...args,
      });
    },
    pushPerson(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "people/push",
        ...args,
      });
    },
    removeTags({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `people/${personId}/taggings`,
        ...args,
      });
    },
    searchPeople(args = {}) {
      return this._makeRequest({
        path: "people/search",
        ...args,
      });
    },
    updateDonation({
      donationId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `donations/${donationId}`,
        ...args,
      });
    },
    updatePerson({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `people/${personId}`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let nextPage = false;
      let count = 0;

      do {
        params = {
          ...params,
          ...this.getPagination(nextPage),
        };

        const {
          results: data,
          next,
        } = await fn({
          params,
          ...args,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        nextPage = next;

      } while (nextPage);
    },
  },
};
