import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clicksend-new-incoming-sms-instant",
  name: "New Incoming SMS (Instant)",
  description: "Emit new event for each new incoming SMS message received. [See the documentation](https://developers.clicksend.com/docs/rest/v3/#view-inbound-sms)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    dedicatedNumber: {
      propDefinition: [
        common.props.app,
        "dedicatedNumber",
      ],
    },
    messageSearchTerm: {
      type: "string",
      label: "Message Search Term",
      description: "Search for a specific message. Eg `hello world`",
    },
  },
  hooks: {
    async activate() {
      const {
        http: { endpoint: actionAddress },
        dedicatedNumber,
        messageSearchTerm,
        createSMSInboundAutomation,
        setWebhookId,
      } = this;

      const response =
        await createSMSInboundAutomation({
          data: {
            dedicated_number: dedicatedNumber,
            rule_name: "PD Inbound SMS",
            message_search_type: constants.MSG_SEARCH_TYPE.ANY_MSG,
            message_search_term: messageSearchTerm,
            action: constants.ACTION.URL,
            action_address: actionAddress,
            enabled: constants.ENABLED,
            webhook_type: constants.WEBHOOK_TYPE.JSON,
          },
        });

      setWebhookId(response.data.inbound_rule_id);
    },
    async deactivate() {
      const {
        getWebhookId,
        deleteSMSInboundAutomation,
      } = this;

      const inboundRuleId = getWebhookId();
      if (inboundRuleId) {
        await deleteSMSInboundAutomation({
          inboundRuleId,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    createSMSInboundAutomation(args = {}) {
      return this.app.post({
        debug: true,
        path: "/automations/sms/inbound",
        ...args,
      });
    },
    deleteSMSInboundAutomation({
      inboundRuleId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/automations/sms/inbound/${inboundRuleId}`,
        ...args,
      });
    },
    generateMeta(resource) {
      return {
        id: resource.message_id,
        summary: `New SMS: ${resource.message_id}`,
        ts: Date.parse(resource.timestamp),
      };
    },
  },
  sampleEmit,
};
