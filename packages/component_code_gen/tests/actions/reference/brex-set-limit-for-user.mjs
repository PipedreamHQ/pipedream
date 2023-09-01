import { axios } from "@pipedream/platform";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "Set Limit for User",
  description: "Sets the monthly limit for a user. [See the docs here](https://developer.brex.com/openapi/team_api/#operation/setUserLimit).",
  key: "brex-set-limit-for-user",
  version: "0.1.0",
  type: "action",
  props: {
    brex: {
      type: "app",
      app: "brex",
    },
    user: {
      label: "User",
      description: "User to set the new limit",
      withLabel: true,
      async options({ prevContext }) {
        const LIMIT = 100;
        const res = await this.getUsers(prevContext.cursor, LIMIT);
        return {
          options: res.data.items?.map((item) => ({
            label: `${item.first_name} ${item.last_name} <${item.email}>`,
            value: item.id,
          })),
          context: {
            cursor: res.data.next_cursor,
          },
        };
      },
    },
    amount: {
      type: "integer",
      label: "Monthly Limit",
      description: "The amount of money, in the smallest denomination of the currency indicated by currency. For example, when currency is USD, amount is in cents (`1000.00`).",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The type of currency, in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format. Default to `USD` if not specified",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://platform.brexapis.com";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Idempotency-Key": uuidv4(),
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    async getUsers(cursor, limit) {
      return axios(this, this._getAxiosParams({
        method: "GET",
        path: "/v2/users",
        params: {
          cursor,
          limit,
        },
        returnFullResponse: true,
      }));
    },
  },
  async run ({ $ }) {
    const {
      user,
      amount,
      currency,
    } = this;

    const res = await axios($, this._getAxiosParams({
      method: "POST",
      path: `/v2/users/${user.value || user}/limit`,
      data: {
        monthly_limit: {
          amount,
          currency,
        },
      },
    }));

    $.export("$summary", `Monthly limit for ${user.label || user} successfully updated`);
    return res;
  },
};
