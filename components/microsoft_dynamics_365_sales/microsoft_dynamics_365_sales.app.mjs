import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import { APPOINTMENT_CATEGORY_OF_APPOINTMENT_FIELD } from "./common/utils.mjs";

const APPOINTMENT_CATEGORY_FIELD = APPOINTMENT_CATEGORY_OF_APPOINTMENT_FIELD;

export default {
  type: "app",
  app: "microsoft_dynamics_365_sales",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The identifier of a contact",
      optional: true,
      async options() {
        const { value } = await this.listContacts();
        return value?.map(({
          contactid: value, fullname: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    solutionId: {
      type: "string",
      label: "Solution ID",
      description: "Identifier of a solution",
      async options() {
        const { value } = await this.listSolutions();
        return value?.filter(({ isvisible }) => isvisible)?.map(({
          solutionid: value, uniquename, friendlyname,
        }) => ({
          value,
          label: friendlyname || uniquename,
        })) || [];
      },
    },
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "Identifier of an opportunity",
      async options({ prevContext }) {
        const response = await this.listOpportunities({
          url: prevContext?.url,
        });
        return {
          options: response.value?.map(({
            opportunityid: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            url: response["@odata.nextLink"],
          },
        };
      },
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Identifier of an account",
      async options() {
        const { value } = await this.listAccounts();
        return value?.map(({
          accountid: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    appointmentId: {
      type: "string",
      label: "Appointment ID",
      description: "The appointment (activity) GUID in Dynamics",
      optional: true,
      async options({ prevContext }) {
        const response = await this.listAppointmentsForOptions({
          url: prevContext?.url,
        });
        return {
          options: response.value?.map(({
            activityid: value, subject: label,
          }) => ({
            value,
            label: label || value,
          })) || [],
          context: {
            url: response["@odata.nextLink"],
          },
        };
      },
    },
    appointmentCategory: {
      type: "integer",
      label: "Category of appointment",
      description: `Numeric option value for the **${APPOINTMENT_CATEGORY_FIELD}** attribute (Category of Appointment). Options are loaded from metadata when available`,
      optional: true,
      async options() {
        return this.getAppointmentCategorySelectOptions();
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.api_url}/api/data/v9.2`;
    },
    /** Base org URL (no `/api/data/...`) for model-driven app deep links */
    _orgRootUrl() {
      return this._baseUrl().replace(/\/api\/data\/v[\d.]+\/?$/i, "");
    },
    async _makeRequest({
      $ = this,
      path,
      url,
      headers,
      ...opts
    }) {
      try {
        return await axios($, {
          url: url || `${this._baseUrl()}${path}`,
          headers: {
            ...headers,
            "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
            "odata-maxversion": "4.0",
            "odata-version": "4.0",
            "content-type": "application/json",
            "If-None-Match": null,
          },
          ...opts,
        });
      } catch (error) {
        throw new ConfigurationError(error.message);
      }
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    getPublisher({
      publisherId, ...opts
    }) {
      return this._makeRequest({
        path: `/publishers(${publisherId})`,
        ...opts,
      });
    },
    getSolution({
      solutionId, ...opts
    }) {
      return this._makeRequest({
        path: `/solutions(${solutionId})`,
        ...opts,
      });
    },
    listSolutions(opts = {}) {
      return this._makeRequest({
        path: "/solutions",
        ...opts,
      });
    },
    listOpportunities(opts = {}) {
      return this._makeRequest({
        path: "/opportunities",
        ...opts,
      });
    },
    listActivityPointers(opts = {}) {
      return this._makeRequest({
        path: "/activitypointers",
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    getEntity({
      entityId, ...opts
    }) {
      return this._makeRequest({
        path: `/${entityId}`,
        ...opts,
      });
    },
    createCustomEntity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/EntityDefinitions",
        ...opts,
      });
    },
    /**
     * Query accounts with a fixed field projection used by list/search actions
     * @param {object} opts
     * @param {string} [opts.filter] OData `$filter`
     * @param {number} [opts.top]
     */
    queryAccounts(opts = {}) {
      const {
        filter, top = 50, ...rest
      } = opts;
      return this._makeRequest({
        path: "/accounts",
        params: {
          $select: "accountid,name,telephone1,emailaddress1,primarycontactid",
          $top: top,
          ...(filter && {
            $filter: filter,
          }),
        },
        ...rest,
      });
    },
    /**
     * @param {object} opts
     * @param {string} opts.accountId
     */
    getAccountById({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts(${accountId})`,
        ...opts,
      });
    },
    /**
     * @param {object} opts
     * @param {string} opts.searchTerm Raw name substring (single quotes escaped internally)
     */
    searchAccountsByName({
      searchTerm, ...opts
    }) {
      const safe = searchTerm.replace(/'/g, "''");
      return this.queryAccounts({
        filter: `contains(name,'${safe}')`,
        ...opts,
      });
    },
    /**
     * List appointments for dropdowns (paginated via `url` from `@odata.nextLink`)
     * @param {object} [opts]
     * @param {string} [opts.url] Next-page URL
     */
    listAppointmentsForOptions(opts = {}) {
      const {
        url, ...rest
      } = opts;
      if (url) {
        return this._makeRequest({
          url,
          ...rest,
        });
      }
      return this._makeRequest({
        path: "/appointments",
        params: {
          $select: "activityid,subject",
          $orderby: "modifiedon desc",
          $top: 25,
        },
        ...rest,
      });
    },
    /**
     * @param {object} opts
     * @param {string} [opts.filter] OData `$filter`
     * @param {number} [opts.top] Capped at 100
     */
    listAppointments({
      filter, top = 25, ...opts
    }) {
      const t = Math.min(Math.max(1, top), 100);
      return this._makeRequest({
        path: "/appointments",
        params: {
          $top: t,
          $orderby: "scheduledstart desc",
          ...(filter && {
            $filter: filter,
          }),
        },
        ...opts,
      });
    },
    /**
     * @param {object} opts
     * @param {string} opts.email Internal email address of a system user
     */
    listSystemUsersByEmail({
      email, ...opts
    }) {
      const safe = email.replace(/'/g, "''");
      return this._makeRequest({
        path: "/systemusers",
        params: {
          $filter: `internalemailaddress eq '${safe}' and isdisabled eq false`,
          $select: "systemuserid,fullname,internalemailaddress",
        },
        ...opts,
      });
    },
    /**
     * @param {object} opts
     * @param {Record<string, unknown>} opts.data Appointment payload
     */
    createAppointment({
      data, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/appointments",
        headers: {
          Prefer: "return=representation",
        },
        data,
        ...opts,
      });
    },
    /**
     * @param {object} opts
     * @param {string} opts.appointmentId
     * @param {Record<string, unknown>} opts.data PATCH body
     */
    patchAppointment({
      appointmentId, data, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/appointments(${appointmentId})`,
        data,
        ...opts,
      });
    },
    /**
     * @param {object} opts
     * @param {string} opts.appointmentId
     * @param {string} [opts.select] `$select` field list (default scheduling fields)
     */
    getAppointment({
      appointmentId,
      select: selectFields = "scheduledstart,scheduledend",
      ...opts
    }) {
      return this._makeRequest({
        path: `/appointments(${appointmentId})`,
        params: {
          ...(selectFields && {
            $select: selectFields,
          }),
        },
        ...opts,
      });
    },
    /**
     * Returns picklist option rows or distinct raw values from existing appointments.
     * Resolves to `{ type, categories }` where `categories` shape depends on `type`.
     */
    async fetchAppointmentCategories(opts = {}) {
      const categoryField = APPOINTMENT_CATEGORY_FIELD;
      const metadataUrl =
        `${this._baseUrl()}/EntityDefinitions(LogicalName='appointment')/Attributes(LogicalName='${categoryField}')`;
      let attributeType;
      try {
        const metaResponse = await this._makeRequest({
          url: metadataUrl,
          ...opts,
        });
        attributeType = metaResponse?.AttributeType;
        const typeName = metaResponse?.AttributeTypeName?.Value;
        if (attributeType == null && typeName) {
          attributeType = typeName;
        }
      } catch {
        return {
          type: "unknown",
          categories: [],
        };
      }
      const isPicklist =
        attributeType === "Picklist" ||
        attributeType === "Virtual" ||
        attributeType === 9 ||
        attributeType === "PicklistType";
      if (isPicklist) {
        try {
          const optionSetUrl =
            `${this._baseUrl()}/EntityDefinitions(LogicalName='appointment')/Attributes(LogicalName='${categoryField}')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options),GlobalOptionSet($select=Options)`;
          const data = await this._makeRequest({
            url: optionSetUrl,
            ...opts,
          });
          const options =
            data.OptionSet?.Options ??
            data.GlobalOptionSet?.Options ??
            [];
          const categories = options.map((opt) => ({
            value: opt.Value,
            label:
              opt.Label?.UserLocalizedLabel?.Label ??
              opt.Label?.LocalizedLabels?.[0]?.Label ??
              String(opt.Value),
          }));
          return {
            type: "picklist",
            categories,
          };
        } catch {
          // Fall through to distinct-values path
        }
      }
      const appointments = [];
      try {
        let response = await this._makeRequest({
          path: "/appointments",
          params: {
            $select: categoryField,
            $filter: `${categoryField} ne null`,
            $orderby: `${categoryField} asc`,
            $top: 500,
          },
          ...opts,
        });
        for (;;) {
          appointments.push(...(response?.value ?? []));
          const nextLink = response?.["@odata.nextLink"];
          if (!nextLink) {
            break;
          }
          response = await this._makeRequest({
            url: nextLink,
            ...opts,
          });
        }
      } catch {
        return {
          type: "unknown",
          categories: [],
        };
      }
      const distinctCategories = [
        ...new Set(
          appointments
            .map((a) => a[categoryField])
            .filter((c) => c != null && (typeof c === "number" || (typeof c === "string" && c.trim().length > 0)))
            .map((c) => (typeof c === "number"
              ? String(c)
              : c.trim())),
        ),
      ].sort();
      return {
        type: "text",
        categories: distinctCategories,
      };
    },
    /**
     * Options for props — maps picklist or distinct values to `{ value, label }`
     */
    async getAppointmentCategorySelectOptions(opts = {}) {
      const result = await this.fetchAppointmentCategories(opts);
      if (result.type === "picklist") {
        return result.categories.map(({
          value, label,
        }) => ({
          value,
          label: `${label} (${value})`,
        }));
      }
      if (result.type === "unknown") {
        return [];
      }
      return result.categories.flatMap((c) => {
        const n = Number(c);
        if (!Number.isFinite(n)) {
          return [];
        }
        return [
          {
            value: n,
            label: String(c),
          },
        ];
      });
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      let count = 0;
      let nextLink = null;

      do {
        const response = await fn(args);
        const items = response.value;
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        nextLink = response["@odata.nextLink"];
        args.url = nextLink;
      } while (nextLink);
    },
  },
};
