import pd from "pipedrive";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pipedrive",
  propDefinitions: {
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the Pipedrive user to set as owner, e.g. `12345678`. If omitted, the authorized user is used. Use **List User ID Options** to find valid user IDs (the `value` field).",
      optional: true,
      async options() {
        const { data: users } = await this.getUsers();
        return users.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    personId: {
      type: "integer",
      label: "Person ID",
      description: "The ID of the person to link, e.g. `42`. Use **Search persons** (by name, email or phone) or **List Persons** to find it (the `id` field).",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.cursor === false) {
          return [];
        }
        const {
          data: persons,
          additional_data: additionalData,
        } = await this.getPersons({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: persons.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor || false,
          },
        };
      },
    },
    organizationId: {
      type: "integer",
      label: "Organization ID",
      description: "The ID of the organization to link, e.g. `7`. Use **List Organizations** to find it (the `id` field).",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.cursor === false) {
          return [];
        }
        const {
          data: organizations,
          additional_data: additionalData,
        } = await this.getOrganizations({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });
        return {
          options: organizations.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor || false,
          },
        };
      },
    },
    probability: {
      type: "integer",
      label: "Probability",
      description: "Deal success probability percentage. Used/shown only when `deal_probability` for the pipeline of the deal is enabled.",
      optional: true,
    },
    lostReason: {
      type: "string",
      label: "Lost Reason",
      description: "Optional message about why the deal was lost (to be used when status=lost)",
      optional: true,
    },
    visibleTo: {
      type: "integer",
      label: "Visible To",
      description: "Visibility of the deal. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
      optional: true,
      options: constants.VISIBLE_TO_OPTIONS,
    },
    addTime: {
      type: "string",
      label: "Add Time",
      description: "The creation date and time of the deal. Requires admin user API token. Format: `YYYY-MM-DDTHH:MM:SSZ`",
      optional: true,
    },
    dealTitle: {
      type: "string",
      label: "Title",
      description: "Deal title",
    },
    dealValue: {
      type: "string",
      label: "Value",
      description: "Value of the deal. If omitted, value will be set to 0.",
      optional: true,
    },
    dealCurrency: {
      type: "string",
      label: "Currency",
      description: "Currency of the deal. Accepts a 3-character currency code. If omitted, currency will be set to the default currency of the authorized user.",
      optional: true,
    },
    stageId: {
      type: "integer",
      label: "Stage ID",
      description: "The ID of the pipeline stage to place the deal in, e.g. `3`. Every stage belongs to exactly one pipeline, so a stage ID also determines the pipeline. If omitted when creating a deal, the deal is placed in the first stage of the default pipeline. Use **List Stages** to find it (the `id` field; filter by pipeline ID to narrow the list).",
      optional: true,
      async options({ prevContext }) {
        if (prevContext.cursor === false) {
          return [];
        }
        const {
          data: stages,
          additional_data: additionalData,
        } = await this.getStages({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: stages?.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor || false,
          },
        };
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "open = Open, won = Won, lost = Lost, deleted = Deleted. If omitted, status will be set to open.",
      optional: true,
      options: constants.STATUS_OPTIONS,
    },
    projectStatus: {
      type: "string",
      label: "Status",
      description: "The status of the project. One of: open, completed, canceled, deleted.",
      options: constants.PROJECT_STATUS_OPTIONS,
      optional: true,
    },
    projectPhaseId: {
      type: "string",
      label: "Phase ID",
      description: "The ID of the project phase. Run **List Project Phases** first to obtain a valid phase ID.",
      optional: true,
    },
    projectBoardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of the project board. Run **List Project Boards** first to obtain a valid board ID.",
      optional: true,
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "The ID of the deal, e.g. `1024`. Use **List Deals** to find it (the `id` field).",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.cursor === false) {
          return [];
        }
        const {
          data: deals,
          additional_data: additionalData,
        } = await this.getDeals({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: deals?.map(({
            id, title,
          }) => ({
            label: title,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor,
          },
        };
      },
    },
    pipelineId: {
      type: "integer",
      label: "Pipeline ID",
      description: "The ID of the pipeline, e.g. `1`. Use **List Pipelines** to find it (the `id` field).",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.cursor === false) {
          return [];
        }
        const {
          data: pipelines,
          additional_data: additionalData,
        } = await this.getPipelines({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: pipelines?.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor || false,
          },
        };
      },
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The ID of the lead (a UUID), e.g. `adf21080-0e10-11eb-879b-05d71fb426ec`. Use **Search Leads** or **Get All Leads** to find it (the `id` field).",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.nextStart === false) {
          return [];
        }
        const {
          data: leads,
          additional_data: additionalData,
        } = await this.getLeads({
          start: prevContext.nextStart,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: leads?.map(({
            id, title,
          }) => ({
            label: title,
            value: id,
          })),
          context: {
            nextStart: additionalData.next_start || false,
          },
        };
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project, e.g. `5`. Use **List Projects** to find it (the `id` field).",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.nextStart === false) {
          return [];
        }
        const {
          data: projects,
          additional_data: additionalData,
        } = await this.getProjects({
          start: prevContext.nextStart,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: projects?.map(({
            id, title,
          }) => ({
            label: title,
            value: id,
          })),
          context: {
            nextStart: additionalData.next_start || false,
          },
        };
      },
    },
    leadLabelIds: {
      type: "string[]",
      label: "Lead Label IDs",
      description: "The IDs of lead labels (UUIDs), e.g. `[\"f08b42a0-4e75-11ea-9643-03698ef1cfd6\"]`. Use **List Lead Label IDs Options** to find them (the `value` field).",
      optional: true,
      async options() {
        const { data: leadLabels } = await this.getLeadLabels();

        return leadLabels?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    filterId: {
      type: "integer",
      label: "Lead Filter ID",
      description: "The ID of a filter to apply to leads",
      optional: true,
      async options({ filterType = "leads" }) {
        const { data: filters } = await this.getFilters({
          type: filterType,
        });

        return filters?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Email addresses (one or more) associated with the person, presented in the same manner as received by GET request of a person. **Example: {\"value\":\"email1@email.com\", \"primary\":true, \"label\":\"work\"}**",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "Phone numbers (one or more) associated with the person, presented in the same manner as received by GET request of a person. **Example: {\"value\":\"12345\", \"primary\":true, \"label\":\"work\"}**",
      optional: true,
    },
    isDeleted: {
      type: "boolean",
      label: "Is Deleted",
      description: "Whether the deal is deleted or not",
      optional: true,
    },
    isArchived: {
      type: "boolean",
      label: "Is Archived",
      description: "Whether the deal is archived or not",
      optional: true,
    },
    archiveTime: {
      type: "string",
      label: "Archive Time",
      description: "The optional date and time of archiving the deal in UTC. Format: `YYYY-MM-DD HH:MM:SS`. If omitted and **Is Archived** is `true`, it will be set to the current date and time.",
      optional: true,
    },
    closeTime: {
      type: "string",
      label: "Close Time",
      description: "The date and time of closing the deal. Can only be set if deal status is won or lost. Format: `YYYY-MM-DD HH:MM:SS`",
      optional: true,
    },
    wonTime: {
      type: "string",
      label: "Won Time",
      description: "The date and time of changing the deal status as won. Can only be set if deal status is won. Format: `YYYY-MM-DD HH:MM:SS`",
      optional: true,
    },
    lostTime: {
      type: "string",
      label: "Lost Time",
      description: "The date and time of changing the deal status as lost. Can only be set if deal status is lost. Format: `YYYY-MM-DD HH:MM:SS`",
      optional: true,
    },
    expectedCloseDate: {
      type: "string",
      label: "Expected Close Date",
      description: "The expected close date of the deal. Format: `YYYY-MM-DD`",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "An object where each key represents a custom field. All custom fields are referenced as randomly generated 40-character hashes",
      optional: true,
    },
    labelIds: {
      type: "integer[]",
      label: "Label IDs",
      description: "The IDs of deal labels, e.g. `[1, 4]`. Use **List Deal Label IDs Options** to find them (the `value` field).",
      optional: true,
      async options() {
        const { data } = await this.getDealCustomFields();
        const labelField = data.find(({ key }) => key === "label");
        return labelField?.options?.map(({
          id: value, label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    personLabelIds: {
      type: "integer[]",
      label: "Person Label IDs",
      description: "The IDs of person labels, e.g. `[5, 6]`. Use **List Person Label IDs Options** to find them (the `value` field).",
      async options() {
        const { data } = await this.getPersonCustomFields();
        const labelField = data.find(({ key }) => key === "label");
        return labelField?.options?.map(({
          id: value, label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    organizationLabelIds: {
      type: "integer[]",
      label: "Organization Label IDs",
      description: "The IDs of organization labels, e.g. `[2]`. Use **List Organization Label IDs Options** to find them (the `value` field).",
      async options() {
        const { data } = await this.getOrganizationCustomFields();
        const labelField = data.find(({ field_code: fieldCode }) => fieldCode === "label_ids");
        return labelField?.options?.map(({
          id: value, label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    includeAllCustomFields: {
      type: "boolean",
      label: "Include All Custom Fields",
      description: "When enabled, all custom fields will be included in the results",
      optional: true,
    },
    entityId: {
      type: "string",
      label: "Entity ID",
      description: "The ID of the record, matching `Entity Type`: a lead UUID (e.g. `adf21080-0e10-11eb-879b-05d71fb426ec`, from **Search Leads**), or a numeric person, deal or organization ID (e.g. `42`, from **Search persons**, **List Deals** or **List Organizations**).",
      async options({
        type, prevContext,
      }) {
        if (prevContext?.cursor === false || prevContext?.nextStart === false) {
          return [];
        }
        switch (type) {
        case "lead": {
          const {
            data: leads,
            additional_data: additionalData,
          } = await this.getLeads({
            start: prevContext?.nextStart,
            limit: constants.DEFAULT_PAGE_LIMIT,
          });
          return {
            options: leads?.map(({
              id, title,
            }) => ({
              label: title,
              value: id,
            })),
            context: {
              nextStart: additionalData?.next_start || false,
            },
          };
        }
        case "person": {
          const {
            data: persons,
            additional_data: additionalData,
          } = await this.getPersons({
            cursor: prevContext?.cursor,
            limit: constants.DEFAULT_PAGE_LIMIT,
          });
          return {
            options: persons?.map(({
              id, name,
            }) => ({
              label: name,
              value: id,
            })),
            context: {
              cursor: additionalData?.next_cursor || false,
            },
          };
        }
        case "deal": {
          const {
            data: deals,
            additional_data: additionalData,
          } = await this.getDeals({
            cursor: prevContext?.cursor,
            limit: constants.DEFAULT_PAGE_LIMIT,
          });
          return {
            options: deals?.map(({
              id, title,
            }) => ({
              label: title,
              value: id,
            })),
            context: {
              cursor: additionalData?.next_cursor || false,
            },
          };
        }
        case "organization": {
          const {
            data: organizations,
            additional_data: additionalData,
          } = await this.getOrganizations({
            cursor: prevContext?.cursor,
            limit: constants.DEFAULT_PAGE_LIMIT,
          });
          return {
            options: organizations?.map(({
              id, name,
            }) => ({
              label: name,
              value: id,
            })),
            context: {
              cursor: additionalData?.next_cursor || false,
            },
          };
        }
        default:
          return [];
        }
      },
    },
    entityLabelIds: {
      type: "string[]",
      label: "Label IDs",
      description: "The label IDs, matching `Entity Type`. Lead labels are UUIDs, e.g. `[\"f08b42a0-4e75-11ea-9643-03698ef1cfd6\"]`; person, deal and organization labels are numbers, e.g. `[\"5\", \"6\"]`. Use **List Lead Label IDs Options**, **List Person Label IDs Options**, **List Deal Label IDs Options** or **List Organization Label IDs Options** to find them (the `value` field).",
      async options({ type }) {
        switch (type) {
        case "lead": {
          const { data: leadLabels } = await this.getLeadLabels();
          return leadLabels?.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })) || [];
        }
        case "person": {
          const { data } = await this.getPersonCustomFields();
          const labelField = data.find(({ key }) => key === "label");
          return labelField?.options?.map(({
            id: value, label,
          }) => ({
            label,
            value,
          })) || [];
        }
        case "deal": {
          const { data } = await this.getDealCustomFields();
          const labelField = data.find(({ key }) => key === "label");
          return labelField?.options?.map(({
            id: value, label,
          }) => ({
            label,
            value,
          })) || [];
        }
        case "organization": {
          const { data } = await this.getOrganizationCustomFields();
          const labelField = data.find(({ field_code: fieldCode }) => fieldCode === "label_ids");
          return labelField?.options?.map(({
            id: value, label,
          }) => ({
            label,
            value,
          })) || [];
        }
        default:
          return [];
        }
      },
    },
  },
  methods: {
    api(model, version = "v1") {
      const config = new pd[version].Configuration({
        accessToken: this.$auth.oauth_access_token,
        basePath: `${this.$auth.api_domain}/api/${version}`,
      });
      return new pd[version][model](config);
    },
    getActivityTypes(opts) {
      const activityTypesApi = this.api("ActivityTypesApi");
      return activityTypesApi.getActivityTypes(opts);
    },
    getDeals(opts = {}) {
      const dealApi = this.api("DealsApi", "v2");
      return dealApi.getDeals(opts);
    },
    getPipelines(opts = {}) {
      const pipelineApi = this.api("PipelinesApi", "v2");
      return pipelineApi.getPipelines(opts);
    },
    getLeads(opts = {}) {
      const leadApi = this.api("LeadsApi");
      return leadApi.getLeads(opts);
    },
    getProjects(opts = {}) {
      const projectApi = this.api("ProjectsApi");
      return projectApi.getProjects(opts);
    },
    getOrganizations(opts = {}) {
      const organizationApi = this.api("OrganizationsApi", "v2");
      return organizationApi.getOrganizations(opts);
    },
    getPersons(opts = {}) {
      const personApi = this.api("PersonsApi", "v2");
      return personApi.getPersons(opts);
    },
    getUsers(opts) {
      const UsersApi = this.api("UsersApi");
      return UsersApi.getUsers(opts);
    },
    getStages(opts) {
      const stagesApi = this.api("StagesApi", "v2");
      return stagesApi.getStages(opts);
    },
    getLeadLabels(opts) {
      const leadLabelsApi = this.api("LeadLabelsApi");
      return leadLabelsApi.getLeadLabels(opts);
    },
    getFilters(opts = {}) {
      const filtersApi = this.api("FiltersApi");
      return filtersApi.getFilters(opts);
    },
    getNotes(opts = {}) {
      const notesApi = this.api("NotesApi");
      return notesApi.getNotes(opts);
    },
    getDealCustomFields(opts) {
      const dealCustomFieldsApi = this.api("DealFieldsApi");
      return dealCustomFieldsApi.getDealFields(opts);
    },
    getPersonCustomFields(opts) {
      const personCustomFieldsApi = this.api("PersonFieldsApi");
      return personCustomFieldsApi.getPersonFields(opts);
    },
    getOrganizationCustomFields(opts) {
      const organizationCustomFieldsApi = this.api("OrganizationFieldsApi", "v2");
      return organizationCustomFieldsApi.getOrganizationFields(opts);
    },
    addActivity(opts = {}) {
      const activityApi = this.api("ActivitiesApi", "v2");
      return activityApi.addActivity({
        AddActivityRequest: opts,
      });
    },
    addNote(opts = {}) {
      const noteApi = this.api("NotesApi");
      return noteApi.addNote({
        AddNoteRequest: opts,
      });
    },
    addDeal(opts = {}) {
      const dealsApi = this.api("DealsApi", "v2");
      return dealsApi.addDeal({
        AddDealRequest: opts,
      });
    },
    addOrganization(opts = {}) {
      const organizationApi = this.api("OrganizationsApi", "v2");
      return organizationApi.addOrganization({
        AddOrganizationRequest: opts,
      });
    },
    addPerson(opts = {}) {
      const personsApi = this.api("PersonsApi", "v2");
      return personsApi.addPerson({
        AddPersonRequest: opts,
      });
    },
    addLead(opts = {}) {
      const leadApi = this.api("LeadsApi");
      return leadApi.addLead({
        AddLeadRequest: opts,
      });
    },
    addWebhook(opts = {}) {
      const webhooksApi = this.api("WebhooksApi");
      return webhooksApi.addWebhook({
        AddWebhookRequest: opts,
      });
    },
    deleteWebhook(webhookId) {
      const webhooksApi = this.api("WebhooksApi");
      return webhooksApi.deleteWebhook({
        id: webhookId,
      });
    },
    searchPersons(opts = {}) {
      const personsApi = this.api("PersonsApi", "v2");
      return personsApi.searchPersons(opts);
    },
    updateDeal({
      dealId, ...opts
    }) {
      const dealsApi = this.api("DealsApi", "v2");
      return dealsApi.updateDeal({
        id: dealId,
        UpdateDealRequest: opts,
      });
    },
    updatePerson({
      personId, ...opts
    }) {
      const personsApi = this.api("PersonsApi", "v2");
      return personsApi.updatePerson({
        id: personId,
        UpdatePersonRequest: opts,
      });
    },
    updateLead({
      leadId, ...opts
    }) {
      const leadsApi = this.api("LeadsApi");
      return leadsApi.updateLead({
        id: leadId,
        UpdateLeadRequest: opts,
      });
    },
    updateOrganization({
      organizationId, ...opts
    }) {
      const organizationsApi = this.api("OrganizationsApi", "v2");
      return organizationsApi.updateOrganization({
        id: organizationId,
        UpdateOrganizationRequest: opts,
      });
    },
    getDeal(dealId) {
      const dealsApi = this.api("DealsApi", "v2");
      return dealsApi.getDeal({
        id: dealId,
      });
    },
    getOrganization(organizationId) {
      const organizationsApi = this.api("OrganizationsApi", "v2");
      return organizationsApi.getOrganization({
        id: organizationId,
      });
    },
    deleteNote(noteId) {
      const notesApi = this.api("NotesApi");
      return notesApi.deleteNote({
        id: noteId,
      });
    },
    // Projects, project boards + phases, and Tasks live on Pipedrive's
    // /api/v2/* REST endpoints but the JS SDK's v2 exports don't include
    // ProjectsApi, TasksApi, BoardsApi, or PhasesApi. Route through raw
    // axios with a small helper that stamps the auth header + baseURL.
    _v2Request({
      $, path, method = "GET", params, data,
    }) {
      return axios($, {
        method,
        url: `${this.$auth.api_domain}/api/v2${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        params,
        data,
      });
    },
    // The v2 REST API rejects string ids with "body/<field> must be integer".
    // Props (and propDefinitions with async options) surface ids as strings, and
    // *Ids props as string[], so coerce the known numeric fields to integers
    // before sending. Non-numeric or absent values are left untouched.
    _coerceV2Ids(data = {}) {
      const INT_FIELDS = [
        "board_id",
        "phase_id",
        "owner_id",
        "project_id",
        "parent_task_id",
        "priority",
        "stage_id",
      ];
      const INT_ARRAY_FIELDS = [
        "deal_ids",
        "person_ids",
        "org_ids",
        "label_ids",
        "assignee_ids",
      ];
      const toInt = (v) => {
        const n = Number(v);
        return Number.isNaN(n)
          ? v
          : n;
      };
      const out = {
        ...data,
      };
      for (const f of INT_FIELDS) {
        if (out[f] !== undefined && out[f] !== null && out[f] !== "") out[f] = toInt(out[f]);
      }
      for (const f of INT_ARRAY_FIELDS) {
        if (Array.isArray(out[f])) {
          out[f] = out[f]
            .filter((v) => v !== undefined && v !== null && v !== "")
            .map(toInt);
        }
      }
      return out;
    },
    listProjects({
      $, ...params
    } = {}) {
      return this._v2Request({
        $,
        path: "/projects",
        params,
      });
    },
    addProject({
      $, ...data
    } = {}) {
      return this._v2Request({
        $,
        method: "POST",
        path: "/projects",
        data: this._coerceV2Ids(data),
      });
    },
    getProject({
      $, projectId,
    }) {
      return this._v2Request({
        $,
        path: `/projects/${projectId}`,
      });
    },
    updateProject({
      $, projectId, ...data
    }) {
      return this._v2Request({
        $,
        method: "PATCH",
        path: `/projects/${projectId}`,
        data: this._coerceV2Ids(data),
      });
    },
    deleteProject({
      $, projectId,
    }) {
      return this._v2Request({
        $,
        method: "DELETE",
        path: `/projects/${projectId}`,
      });
    },
    getProjectBoards({ $ } = {}) {
      return this._v2Request({
        $,
        path: "/boards",
      });
    },
    getProjectPhases({
      $, boardId,
    }) {
      return this._v2Request({
        $,
        path: "/phases",
        params: {
          board_id: boardId,
        },
      });
    },
    listTasks({
      $, ...params
    } = {}) {
      return this._v2Request({
        $,
        path: "/tasks",
        params,
      });
    },
    addTask({
      $, ...data
    } = {}) {
      return this._v2Request({
        $,
        method: "POST",
        path: "/tasks",
        data: this._coerceV2Ids(data),
      });
    },
    getTask({
      $, taskId,
    }) {
      return this._v2Request({
        $,
        path: `/tasks/${taskId}`,
      });
    },
    updateTask({
      $, taskId, ...data
    }) {
      return this._v2Request({
        $,
        method: "PATCH",
        path: `/tasks/${taskId}`,
        data: this._coerceV2Ids(data),
      });
    },
    deleteTask({
      $, taskId,
    }) {
      return this._v2Request({
        $,
        method: "DELETE",
        path: `/tasks/${taskId}`,
      });
    },
    getPerson(personId) {
      const personsApi = this.api("PersonsApi", "v2");
      return personsApi.getPerson({
        id: personId,
      });
    },
    getLead(leadId) {
      const leadApi = this.api("LeadsApi");
      return leadApi.getLead({
        id: leadId,
      });
    },
    searchLeads(opts = {}) {
      const leadApi = this.api("LeadsApi", "v2");
      return leadApi.searchLeads(opts);
    },
    async *paginate({
      fn, params, max,
    }) {
      params = {
        ...params,
        start: 0,
        limit: 100,
      };
      let hasMore, count = 0;
      do {
        const {
          data, additional_data: additionalData,
        } = await fn(params);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        params.start += params.limit;
        hasMore = additionalData.pagination.more_items_in_collection;
      } while (hasMore);
    },
    async getPaginatedResources(opts) {
      const results = [];
      const resources = this.paginate(opts);
      for await (const resource of resources) {
        results.push(resource);
      }
      return results;
    },
  },
};
