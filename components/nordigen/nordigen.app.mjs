import axios from "axios";

export default {
  type: "app",
  app: "nordigen",
  propDefinitions: {
    country_code: {
      type: "string",
      label: "Country",
      description: "Country where your bank is located.",
	  options: [
		{
		  label: '🇦🇹 Austria',
		  value: 'AT',
		},
		{
		  label: '🇧🇪 Belgium',
		  value: 'BE',
		},
		{
		  label: '🇧🇬 Bulgaria',
		  value: 'BG',
		},
		{
		  label: '🇭🇷 Croatia',
		  value: 'HR',
		},
		{
		  label: '🇨🇾 Cyprus',
		  value: 'CY',
		},
		{
		  label: '🇨🇿 Czech Republic',
		  value: 'CZ',
		},
		{
		  label: '🇩🇰 Denmark',
		  value: 'DK',
		},
		{
		  label: '🇪🇪 Estonia',
		  value: 'EE',
		},
		{
		  label: '🇫🇮 Finland',
		  value: 'FI',
		},
		{
		  label: '🇫🇷 France',
		  value: 'FR',
		},
		{
		  label: '🇩🇪 Germany',
		  value: 'DE',
		},
		{
		  label: '🇬🇷 Greece',
		  value: 'GR',
		},
		{
		  label: '🇭🇺 Hungary',
		  value: 'HU',
		},
		{
		  label: '🇮🇸 Iceland',
		  value: 'IS',
		},
		{
		  label: '🇮🇪 Ireland',
		  value: 'IE',
		},
		{
		  label: '🇮🇹 Italy',
		  value: 'IT',
		},
		{
		  label: '🇱🇻 Latvia',
		  value: 'LV',
		},
		{
		  label: '🇱🇹 Lithuania',
		  value: 'LT',
		},
		{
		  label: '🇱🇮 Liechtenstein',
		  value: 'LI',
		},
		{
		  label: '🇱🇺 Luxembourg',
		  value: 'LU',
		},
		{
		  label: '🇲🇹 Malta',
		  value: 'MT',
		},
		{
		  label: '🇳🇱 Netherlands',
		  value: 'NL',
		},
		{
		  label: '🇳🇴 Norway',
		  value: 'NO',
		},
		{
		  label: '🇵🇱 Poland',
		  value: 'PL',
		},
		{
		  label: '🇵🇹 Portugal',
		  value: 'PT',
		},
		{
		  label: '🇷🇴 Romania',
		  value: 'RO',
		},
		{
		  label: '🇸🇰 Slovakia',
		  value: 'SK',
		},
		{
		  label: '🇸🇮 Slovenia',
		  value: 'SI',
		},
		{
		  label: '🇪🇸 Spain',
		  value: 'ES',
		},
		{
		  label: '🇸🇪 Sweden',
		  value: 'SE',
		},
		{
		  label: '🇬🇧 United Kingdom',
		  value: 'GB',
		}
	  ],
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
