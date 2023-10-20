import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import mailwizz from "../../mailwizz.app.mjs";

export default {
  key: "mailwizz-email-sent",
  name: "New Email Sent",
  description: "Emit new event when an email campaign is successfully sent.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    mailwizz,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Mailwizz on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    campaignId: {
      propDefinition: [
        mailwizz,
        "campaignId",
      ],
    },
  },
  methods: {
    async startEvent () {
      const campaign = await this.mailwizz.getCampaign( {
        id: this.campaignId,
      } );
      const {
        data: {
          record: {
            status,
            campaign_uid,
            name,
            sent_at,
          },
        },
      } = campaign;

      if ( status === "sent" ) {
        this.$emit(
          campaign,
          {
            id: campaign_uid,
            summary: `The campaign "${name}" was successfully sent!`,
            ts: sent_at,
          },
        );
      }
    },
  },
  hooks: {
    async deploy () {
      await this.startEvent();
    },
  },
  async run () {
    await this.startEvent();
  },
};
