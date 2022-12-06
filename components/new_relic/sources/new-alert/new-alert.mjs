import common from "../../common/common-sources.mjs";

export default {
  dedupe: "unique",
  type: "source",
  key: "new_relic-new-alert",
  name: "New Alert",
  description: "Emit new event when a new alert is created.",
  version: "0.0.2",
  props: {
    ...common.props,
    product: {
      label: "Product",
      description: "Filter by New Relic product",
      type: "string",
      optional: true,
    },
    entityType: {
      label: "Entity Type",
      description: "Filter by entity type",
      type: "string",
      optional: true,
    },
    entityGroupId: {
      label: "Entity Group ID",
      description: "Filter by entity group ID",
      type: "string",
      optional: true,
    },
    entityId: {
      label: "Entity ID",
      description: "Filter by entity ID",
      type: "string",
      optional: true,
    },
    eventType: {
      label: "Event Type",
      description: "Filter by event type",
      type: "string",
      optional: true,
    },
    incidentId: {
      label: "Incident ID",
      description: "Filter by incident ID",
      type: "string",
      optional: true,
    },
  },
  methods: {
    _setLastEmittedAlert(deployment) {
      this.db.set("lastEmittedAlert", deployment);
    },
    _getLastEmittedAlert() {
      return this.db.get("lastEmittedAlert");
    },
    getMeta({
      id,
      description,
      timestamp,
    }) {
      return {
        id,
        summary: description,
        ts: new Date(timestamp),
      };
    },
  },
  async run () {
    const params = {
      product: this.product,
      entity_type: this.entityType,
      entity_group_id: this.entityGroupId,
      entity_id: this.entityId,
      event_type: this.eventType,
      incident_id: this.incidentId,
    };
    const alerts = await this.app.listAlerts(params);
    const toEmitEvents = [];
    const prevRequestFirstItem = this._getLastEmittedAlert();
    for (const alert of alerts) {
      if (prevRequestFirstItem == alert.id) {
        break;
      }
      toEmitEvents.unshift(alert);
    }
    this._setLastEmittedAlert(alerts[0].id);

    for (const alert of toEmitEvents) {
      this.$emit(alert, this.getMeta(alert));
    }
  },
};
