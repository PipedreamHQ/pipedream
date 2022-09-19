import activecampaign from "../../activecampaign.app.mjs";
import common from "./webhook.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    campaigns: {
      propDefinition: [
        activecampaign,
        "campaigns",
      ],
    },
  },
  methods: {
    isRelevant(body) {
      return (
        this.campaigns?.length === 0 ||
        this.campaigns?.includes(body["campaign[id]"])
      );
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: `${body["campaign[id]"]}${body["contact[id]"]}`,
        summary: `${body["contact[email]"]}, Campaign: ${body["campaign[name]"]}`,
        ts,
      };
    },
  },
};
