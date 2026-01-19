import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "d2l_brightspace",
  propDefinitions: {
    orgUnitId: {
      type: "string",
      label: "Organizational Unit",
      description: "The organizational unit ID (course, department, etc.)",
      async options({
        prevContext, orgUnitType,
      }) {
        const params = {
          limit: constants.DEFAULT_LIMIT,
        };
        if (prevContext?.bookmark) {
          params.bookmark = prevContext.bookmark;
        }
        if (orgUnitType) {
          params.orgUnitType = orgUnitType;
        }
        const response = await this.listOrgUnits({
          params,
        });
        const orgUnits = response.Items || response || [];
        const options = orgUnits.map((orgUnit) => ({
          label: `${orgUnit.Name} (${orgUnit.Code || orgUnit.Type?.Name || ""})`,
          value: orgUnit.Identifier,
        }));
        return {
          options,
          context: {
            bookmark: response.PagingInfo?.Bookmark,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "The user ID",
      async options({ prevContext }) {
        const params = {
          limit: constants.DEFAULT_LIMIT,
        };
        if (prevContext?.bookmark) {
          params.bookmark = prevContext.bookmark;
        }
        const response = await this.listUsers({
          params,
        });
        const users = response.Items || response || [];
        const options = users.map((user) => ({
          label: `${user.FirstName} ${user.LastName} (${user.UserName})`,
          value: user.UserId || user.Identifier,
        }));
        return {
          options,
          context: {
            bookmark: response.PagingInfo?.Bookmark,
          },
        };
      },
    },
    roleId: {
      type: "string",
      label: "Role",
      description: "The enrollment role ID",
      async options() {
        const response = await this.listRoles();
        const roles = response.Items || response || [];
        return roles.map((role) => ({
          label: role.DisplayName || role.Name,
          value: role.RoleId || role.Identifier,
        }));
      },
    },
    gradeObjectId: {
      type: "string",
      label: "Grade Object",
      description: "The grade object (assessment) ID",
      async options({ orgUnitId }) {
        if (!orgUnitId) {
          return [];
        }
        const response = await this.listGrades({
          orgUnitId,
        });
        const grades = response || [];
        return grades.map((grade) => ({
          label: grade.Name,
          value: grade.Id,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL_TEMPLATE.replace(
        constants.DOMAIN_PLACEHOLDER,
        this.$auth.target_host,
      )}${path}`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this._headers(),
        ...opts,
      });
    },
    listOrgUnits(opts = {}) {
      return this._makeRequest({
        path: `/${constants.API_CONTEXTS.LP}/${constants.LP_VERSION}/orgstructure/`,
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: `/${constants.API_CONTEXTS.LP}/${constants.LP_VERSION}/users/`,
        ...opts,
      });
    },
    getUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/${constants.API_CONTEXTS.LP}/${constants.LP_VERSION}/users/${userId}`,
        ...opts,
      });
    },
    listRoles(opts = {}) {
      return this._makeRequest({
        path: `/${constants.API_CONTEXTS.LP}/${constants.LP_VERSION}/roles/`,
        ...opts,
      });
    },
    createEnrollment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/${constants.API_CONTEXTS.LP}/${constants.LP_VERSION}/enrollments/`,
        ...opts,
      });
    },
    listEnrollmentsByOrgUnit({
      orgUnitId, ...opts
    }) {
      return this._makeRequest({
        path: `/${constants.API_CONTEXTS.LP}/${constants.LP_VERSION}/enrollments/orgUnits/${orgUnitId}/users/`,
        ...opts,
      });
    },
    listGrades({
      orgUnitId, ...opts
    }) {
      return this._makeRequest({
        path: `/${constants.API_CONTEXTS.LE}/${constants.LE_VERSION}/${orgUnitId}/grades/`,
        ...opts,
      });
    },
    getGradeValue({
      orgUnitId, gradeObjectId, userId, ...opts
    }) {
      return this._makeRequest({
        path: `/${constants.API_CONTEXTS.LE}/${constants.LE_VERSION}/${orgUnitId}/grades/${gradeObjectId}/values/${userId}`,
        ...opts,
      });
    },
    listDropboxFolders({
      orgUnitId, ...opts
    }) {
      return this._makeRequest({
        path: `/${constants.API_CONTEXTS.LE}/${constants.LE_VERSION}/${orgUnitId}/dropbox/folders/`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let count = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await fn({
          params,
        });
        const items = response.Items || response.Objects || response;

        if (Array.isArray(items)) {
          for (const item of items) {
            yield item;
            if (maxResults && ++count === maxResults) {
              return;
            }
          }
        }

        if (response.PagingInfo) {
          params.bookmark = response.PagingInfo.Bookmark;
          hasMore = response.PagingInfo.HasMoreItems;
        } else {
          hasMore = false;
        }
      }
    },
  },
};
