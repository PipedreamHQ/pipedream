import wildapricot from "../../wildapricot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "wildapricot-new-event-registration-created-instant",
  name: "New Event Registration Created",
  description: "Emit new event when a registration to an existing event in WildApricot is newly created.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    wildapricot: {
      type: "app",
      app: "wildapricot",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    eventId: {
      propDefinition: [
        wildapricot,
        "eventId",
      ],
    },
  },
  methods: {
    getParticipantDetails(body) {
      const { Registrant } = body;
      if (!Registrant) return {};
      const {
        FirstName, LastName, Email,
      } = Registrant;
      return {
        firstName: FirstName,
        lastName: LastName,
        email: Email,
      };
    },
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const targetUrl = `${this.wildapricot._baseUrl()}/accounts/${this.wildapricot.$auth.account_id}/hooks`;
      const { data } = await axios(this, {
        url: targetUrl,
        method: "POST",
        data: {
          WebHookUrl: webhookUrl,
          AuthorizationType: "OAuth",
          Event: "EventRegistrationCreated",
        },
      });
      this.db.set("hookId", data.Id);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      if (!hookId) return;
      const targetUrl = `${this.wildapricot._baseUrl()}/accounts/${this.wildapricot.$auth.account_id}/hooks/${hookId}`;
      await axios(this, {
        url: targetUrl,
        method: "DELETE",
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const { Event } = body;
    if (Event && Event.Id === this.eventId) {
      const participantDetails = this.getParticipantDetails(body);
      this.$emit(
        {
          ...body,
          ...participantDetails,
        },
        {
          id: body.Id,
          summary: `New registration for event ${this.eventId}`,
          ts: Date.now(),
        },
      );
    }
  },
};
