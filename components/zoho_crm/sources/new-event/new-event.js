const sortBy = require("lodash/sortBy");
const common = require("../common/http-based/base");
const crudOps = require("../common/http-based/crud-operations");

module.exports = {
  ...common,
  key: "zoho_crm-new-event",
  name: "New Event (Instant)",
  description: "Emits an event each time a specified event occurs in Zoho CRM",
  version: "0.0.1",
  props: {
    ...common.props,
    events: {
      type: "string[]",
      label: "Events",
      description: "List of CRUD events that will trigger this event source",
      async options({ page = 0 }) {
        if (page !== 0) {
          return [];
        }

        const { modules } = await this.zoho_crm.listModules();
        return sortBy(modules.flatMap(this._moduleSupportedEvents), "label");
      },
    },
  },
  methods: {
    _moduleSupportedEvents(module) {
      // See the docs for more information about these attributes:
      // https://www.zoho.com/crm/developer/docs/api/v2/modules-api.html
      const {
        api_name: moduleKey,
        singular_label: moduleName,
      } = module;

      // As per the docs, the notation for a CRUD event on a record/module is
      // {capitalized record name}.{operation} (e.g. `Contacts.create` will
      // issue notifications when a contact is created). See the docs for more
      // details:
      // https://www.zoho.com/crm/developer/docs/api/v2/notifications/enable.html
      return this
        .getSupportedOps()
        .filter(({ flagName }) => module[flagName])
        .map(({
          description,
          op,
        }) => ({
          label: `${moduleName} ${description}`,
          value: `${moduleKey}.${op}`,
        }));
    },
    getSupportedOps() {
      return crudOps.allOpsData();
    },
    getEvents() {
      return this.events;
    },
  },
};
