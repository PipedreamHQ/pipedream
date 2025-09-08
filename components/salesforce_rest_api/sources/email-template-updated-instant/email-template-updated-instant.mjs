import common from "../common/common-updated-record.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...common,
  type: "source",
  name: "Email Template Updated (Instant, of Selectable Type)",
  key: "salesforce_rest_api-email-template-updated-instant",
  description: "Emit new event when an email template is updated. [See the documentation](https://sforce.co/3yPSJZy)",
  version: "0.0.3",
  props: {
    salesforce: common.props.salesforce,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    timer: {
      type: "$.interface.timer",
      description: "The timer is only used as a fallback if instant event delivery (webhook) is not available.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    fieldsToObtain: {
      propDefinition: [
        common.props.salesforce,
        "fieldsToObtain",
        () => ({
          objType: "EmailTemplate",
        }),
      ],
      optional: true,
      description: "Select the field(s) to be retrieved for the records. Only applicable if the source is running on a timer. If running on a webhook, or if not specified, all fields will be retrieved.",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return "EmailTemplate";
    },
  },
};
