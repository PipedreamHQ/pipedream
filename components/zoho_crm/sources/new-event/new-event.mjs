import sortBy from "lodash.sortby";
import common from "../common/http-based/base.mjs";
import crudOps from "../common/http-based/crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-event",
  name: "New Event (Instant)",
  description: "Emit new custom events from Zoho CRM",
  version: "0.0.13",
  type: "source",
  props: {
    ...common.props,
    events: {
      type: "string[]",
      label: "Events",
      description: "Choose one or more module events to trigger this event source.",
      async options({ page = 0 }) {
        if (page !== 0) {
          return [];
        }

        const { modules } = await this.zohoCrm.listModules();
        return sortBy(modules.flatMap(this._moduleSupportedEvents), "label");
      },
    },
  },
  methods: {
    ...common.methods,
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
