import {
  API_ENDPOINTS, SORT_ORDERS,
} from "../../common/constants.mjs";
import {
  createEventSummary, getEventTimestamp,
} from "../../common/utils.mjs";

export default {
  name: "New Time Registration Created",
  description: "Emit new event when a new time registration is created",
  key: "timeRegistrationCreated",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    buddee: {
      type: "app",
      app: "buddee",
      label: "Buddee",
      description: "The Buddee app instance to use",
    },
    db: {
      type: "$.service.db",
      label: "Database",
      description: "The database service to store state",
    },
  },
  methods: {
    _getLastTimeRegistrationId() {
      return this.db.get("lastTimeRegistrationId");
    },
    _setLastTimeRegistrationId(registrationId) {
      this.db.set("lastTimeRegistrationId", registrationId);
    },
  },
  async run({ $ }) {
    const lastTimeRegistrationId = this._getLastTimeRegistrationId();

    const params = {
      limit: 100,
      sort: "created_at",
      order: SORT_ORDERS.DESC,
    };

    if (lastTimeRegistrationId) {
      params.since_id = lastTimeRegistrationId;
    }

    const response = await this.buddee._makeRequest({
      $,
      path: API_ENDPOINTS.TIME_REGISTRATIONS,
      params,
    });

    const timeRegistrations = response.data;

    if (timeRegistrations && timeRegistrations.length > 0) {
      // Store the latest time registration ID for next run
      this._setLastTimeRegistrationId(timeRegistrations[0].id);

      // Return only new time registrations (excluding the last one we already processed)
      const newTimeRegistrations = lastTimeRegistrationId
        ? timeRegistrations.filter((reg) => reg.id > lastTimeRegistrationId)
        : timeRegistrations;

      return newTimeRegistrations.map((registration) => ({
        id: registration.id,
        summary: createEventSummary("time_registration_created", registration),
        ts: getEventTimestamp(registration),
        data: registration,
      }));
    }

    return [];
  },
};
