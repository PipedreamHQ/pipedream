import axios from "axios";

export default {
  type: "app",
  app: "nordigen",
  propDefinitions: {
    country_code: {
      type: "string",
      label: "Enter a country code",
      description: "[ISO 3166](https://www.iso.org/obp/ui/en/#iso:pub:PUB500001:en) two-character code for the country (eg. `FR`) for one of [these supported countries](https://nordigen.com/en/coverage/).",
    },
    institution_id: {
      type: "string",
      label: "Institution",
      description: "Select your institution",
      async options({ country_code }) {
        const institutions = await this.listInstitutions(country_code);
        return institutions.map((institution) => {
          return {
            label: institution.name,
            value: institution.id,
          };
        });
      },
    }
  },
  methods: {
    _getHost() {
      return "https://ob.nordigen.com/api/v2";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "accept": "application/json",
        "Content-Type": "application/json",
      }
    },
    _getAxiosParams(opts) {
      return {
        ...opts,
        url: this._getHost() + opts.path,
        headers: this._getHeaders()
      }
    },
    async _makeRequest(method, endpoint, data, params) {
      return axios({
        method,
        url: this._getHost() + endpoint,
        headers: this._getHeaders(),
        data,
        params,
      })
    },
    async listInstitutions(countryCode) {
      const institutions = await this._makeRequest("GET", `/institutions/?country=${countryCode}`);
      return institutions.data;
    }
  },
};
