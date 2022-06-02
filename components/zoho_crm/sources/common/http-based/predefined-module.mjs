import base from "./base.mjs";

export default {
  ...base,
  hooks: {
    ...base.hooks,
    async activate() {
      const moduleType = await this._retrieveModuleType();
      this._setModuleType(moduleType);

      // Call "super" method
      await base.hooks.activate.bind(this)();
    },
  },
  methods: {
    ...base.methods,
    /**
     * This function retrieves the "formal" API type name of the Zoho CRM module
     * to which the event source will listen for notifications. The function
     * makes an API call to retrieve module information, and uses the specific
     * module name of this event source to find its counterpart.
     *
     * The returned value corresponds to the `api_name` attributed returned the
     * Zoho CRM API:
     * https://www.zoho.com/crm/developer/docs/api/v2/modules-api.html
     *
     * @returns {string}  The API name of the module supported by this event
     * source
     */
    async _retrieveModuleType() {
      const { modules } = await this.zohoCrm.listModules();
      const { api_name: moduleType } = modules
        .find(({ singular_label: moduleName }) => moduleName === this.getModuleName());
      return moduleType;
    },
    /**
     * This function returns the "formal" API type name of the Zoho CRM module
     * to which the event source will listen for notifications.
     *
     * The returned value corresponds to the `api_name` attributed returned by
     * the Zoho CRM API:
     * https://www.zoho.com/crm/developer/docs/api/v2/modules-api.html
     *
     * @returns {string}  The API name of the module supported by this event
     * source
     */
    _getModuleType() {
      return this.db.get("moduleType");
    },
    _setModuleType(moduleType) {
      this.db.set("moduleType", moduleType);
    },
    /**
     * This function returns the type name of the Zoho CRM module to which the
     * event source will listen for notifications.
     *
     * The returned value should match any of the `singular_label` values
     * returned by the Zoho CRM API:
     * https://www.zoho.com/crm/developer/docs/api/v2/modules-api.html
     *
     * @returns {string}  The name (i.e. singular label) of the module supported
     * by this event source
     */
    getModuleName() {
      throw new Error("getModuleName is not implemented");
    },
    getEvents() {
      const moduleType = this._getModuleType();
      return this
        .getSupportedOps()
        .map(({ op }) => `${moduleType}.${op}`);
    },
    generateMeta({
      event, resource,
    }) {
      // Call "super" method
      const baseMeta = base.methods.generateMeta.bind(this)({
        event,
        resource,
      });

      const moduleName = this.getModuleName();
      const { operation } = event.body;
      const { id } = resource;
      const summary = `${moduleName} ${operation}: ${id}`;

      return {
        ...baseMeta,
        summary,
      };
    },
  },
};
