import app from "../../livestorm.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "livestorm-register-someone-for-session",
  name: "Register Someone For A Session",
  description: "Register a new participant for a session (either an external registrant or internal team member). [See the Documentation](https://developers.livestorm.co/reference/post_sessions-id-people)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sessionId: {
      reloadProps: true,
      propDefinition: [
        app,
        "sessionId",
      ],
    },
    referrer: {
      type: "string",
      label: "Referrer",
      description: "The referrer of the person registering for the session.",
      optional: true,
    },
    utmSource: {
      type: "string",
      label: "UTM Source",
      description: "The UTM source of the person registering for the session.",
      optional: true,
    },
    utmMedium: {
      type: "string",
      label: "UTM Medium",
      description: "The UTM medium of the person registering for the session.",
      optional: true,
    },
    utmCampaign: {
      type: "string",
      label: "UTM Campaign",
      description: "The UTM campaign of the person registering for the session.",
      optional: true,
    },
    utmTerm: {
      type: "string",
      label: "UTM Term",
      description: "The UTM term of the person registering for the session.",
      optional: true,
    },
    utmContent: {
      type: "string",
      label: "UTM Content",
      description: "The UTM content of the person registering for the session.",
      optional: true,
    },
  },
  methods: {
    mapFields(fields = {}) {
      return Object.entries(fields)
        .reduce((acc, [
          id,
          value,
        ]) => !value
          ? acc
          : acc.concat({
            id,
            value,
          }), []);
    },
    registerSomeoneForSession({
      sessionId, ...args
    } = {}) {
      return this.app.post({
        path: `/sessions/${sessionId}/people`,
        ...args,
      });
    },
  },
  async additionalProps() {
    const { sessionId } = this;

    const { data: { attributes: { event_id: eventId } } } =
      await this.app.getSession({
        sessionId,
      });

    const { data: { attributes: { fields } } } =
      await this.app.getEvent({
        eventId,
      });

    return fields.reduce((acc, {
      type, id, required,
    }) => {
      if (type !== "text") {
        return acc;
      }
      const label = utils.snakeCaseToTileCase(id);
      return {
        ...acc,
        [id]: {
          type: "string",
          label,
          description: `The **${label}** of the person registering for the session.`,
          optional: !required,
        },
      };
    }, {});
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      sessionId,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      ...fields
    } = this;

    const response = await this.registerSomeoneForSession({
      step,
      sessionId,
      data: {
        data: {
          type: "people",
          attributes: {
            referrer,
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            utm_term: utmTerm,
            utm_content: utmContent,
            fields: this.mapFields(JSON.parse(JSON.stringify(fields))),
          },
        },
      },
    });

    step.export("$summary", `Successfully registered someone for session with ID ${response.data.id}}`);

    return response;
  },
};
