import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import resourceNames from "./common/resource-names.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "procore",
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company ID",
      description: "Select the company to watch for changes in.",
      async options({ page }) {
        const results = await this.listCompanies({
          params: {
            per_page: constants.DEFAULT_LIMIT,
            page: page + 1,
          },
        });
        return results.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description:
        "Select the project to watch for changes in",
      optional: true,
      async options({
        companyId, page,
      }) {
        if (!companyId) {
          return [];
        }
        const results = await this.listProjects({
          companyId,
          params: {
            company_id: companyId,
            per_page: constants.DEFAULT_LIMIT,
            page: page + 1,
          },
        });
        return results.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    resourceName: {
      type: "string",
      label: "Resource",
      description: "The type of resource on which to trigger events.",
      options: Object.values(resourceNames),
    },
    eventTypes: {
      type: "string[]",
      label: "Event Type",
      description: "Only events of the selected event type will be emitted.",
      options: Object.values(constants.EVENT_TYPE),
    },
    locationId: {
      type: "integer",
      label: "Location ID",
      description: "The ID of the location",
      optional: true,
      async options({
        companyId, projectId, page,
      }) {
        if (!companyId || !projectId) {
          return [];
        }
        const results = await this.listLocations({
          companyId,
          projectId,
          params: {
            per_page: constants.DEFAULT_LIMIT,
            page: page + 1,
          },
        });
        return results.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user",
      optional: true,
      async options({
        companyId, page,
      }) {
        if (!companyId) {
          return [];
        }
        const results = await this.listUsers({
          companyId,
          params: {
            view: "normal",
            per_page: constants.DEFAULT_LIMIT,
            page: page + 1,
          },
        });
        return results.map(({
          id: value, first_name: firstName, last_name: lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value,
        }));
      },
    },
    rfiPotentialManagerId: {
      type: "integer",
      label: "RFI Potential Manager ID",
      description: "The ID of the potential RFI manager",
      async options({
        companyId, projectId, page,
      }) {
        const results = await this.listPotentialRfiManagers({
          companyId,
          projectId,
          params: {
            per_page: constants.DEFAULT_LIMIT,
            page: page + 1,
          },
        });
        return results.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    potentialAssigneeId: {
      type: "integer",
      label: "Potential Assignee ID",
      description: "The ID of the potential assignee",
      async options({
        companyId, projectId, page,
      }) {
        if (!companyId || !projectId) {
          return [];
        }
        const results = await this.listPotentialAssignees({
          companyId,
          projectId,
          params: {
            per_page: constants.DEFAULT_LIMIT,
            page: page + 1,
          },
        });
        return results.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getEnvironment() {
      return constants.ENVIRONMENT.PRODUCTION;
    },
    getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    getUrl(path, versionPath = constants.VERSION_PATH.DEFAULT) {
      const env = this.getEnvironment();
      const baseUrl = constants.BASE_URL
        .replace(
          constants.ENV_PLACEHOLDER,
          env,
        )
        .replace(
          constants.VERSION_PLACEHOLDER,
          versionPath,
        );
      return `${baseUrl}${path}`;
    },
    getHeaders(headers, companyId) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.getAccessToken()}`,
        ...(companyId && {
          "Procore-Company-Id": companyId,
        }),
      };
    },
    makeRequest({
      $ = this, path, headers, versionPath, companyId, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path, versionPath),
        headers: this.getHeaders(headers, companyId),
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this.makeRequest({
        path: "/companies",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this.makeRequest({
        versionPath: constants.VERSION_PATH.V1_1,
        path: "/projects",
        ...args,
      });
    },
    getBudgetViewSnapshot({
      budgetViewSnapshotId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/budget_view_snapshots/${budgetViewSnapshotId}/detail_rows`,
        ...args,
      });
    },
    getChangeEvent({
      changeEventId, ...args
    } = {}) {
      return this.makeRequest({
        versionPath: constants.VERSION_PATH.V1_1,
        path: `/change_events/${changeEventId}`,
        ...args,
      });
    },
    getChangeOrderPackage({
      changeOrderPackageId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/change_order_packages/${changeOrderPackageId}`,
        ...args,
      });
    },
    getPrimeContract({
      primeContractId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/prime_contract/${primeContractId}`,
        ...args,
      });
    },
    getPurchaseOrderContract({
      purchaseOrderContractId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/purchase_order_contracts/${purchaseOrderContractId}`,
        ...args,
      });
    },
    getRFI({
      projectId, rfiId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/projects/${projectId}/rfis/${rfiId}`,
        ...args,
      });
    },
    getSubmittal({
      projectId, submittalId, ...args
    } = {}) {
      return this.makeRequest({
        versionPath: constants.VERSION_PATH.V1_1,
        path: `/projects/${projectId}/submittals/${submittalId}`,
        ...args,
      });
    },
    getTimecardEntry({
      timecardEntryId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/timecard_entries/${timecardEntryId}`,
        ...args,
      });
    },
    listLocations({
      projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/projects/${projectId}/locations`,
        ...args,
      });
    },
    listUsers({
      companyId, ...args
    } = {}) {
      return this.makeRequest({
        companyId,
        versionPath: constants.VERSION_PATH.V1_3,
        path: `/companies/${companyId}/users`,
        ...args,
      });
    },
    listPotentialRfiManagers({
      projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/projects/${projectId}/rfis/potential_rfi_managers`,
        ...args,
      });
    },
    listPotentialAssignees({
      projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/projects/${projectId}/rfis/potential_assignees`,
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              page,
              per_page: constants.DEFAULT_LIMIT,
            },
          });

        const nextResources = resourceName
          ? utils.getNestedProperty(response, resourceName)
          : response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
