import { axios } from "@pipedream/platform";

export default {
  name: "Check Remaining Credits",
  description: "Check the remaining credits.",
  key: "ip2proxy-check-credits",
  version: "0.0.1",
  type: "action",
  props: {
    ipl_api_key: {
      type: "app",
      app: "ip2proxy",
      description: "You can sign up for a trial key at [here](https://www.ip2location.com/register?id=1006).",
    }
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.ip2proxy.com/`,
      params: {
        key: `${this.ipl_api_key.$auth.api_key}`,
        check: "1"
      },
    })
  },
}