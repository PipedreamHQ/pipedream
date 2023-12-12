import { axios } from "@pipedream/platform";
import { range } from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_bugtracker",
  propDefinitions: {
    assignee: {
      type: "string",
      label: "Assignee",
      description: "Assignee for the bug.",
      async options({
        page, portalId, projectId,
      }) {
        const { users } = await this.listUsers({
          portalId,
          projectId,
          params: {
            index: page * range + 1,
          },
        });

        return users
          ? users.map(({
            id: value, name, email,
          }) => ({
            label: `${name} ${email}`,
            value,
          }))
          : [];
      },
    },
    bugFollowers: {
      type: "string",
      label: "Bug Followers",
      description: "Follower ID of the user.",
      async options({
        page, portalId, projectId,
      }) {
        const { users } = await this.listUsers({
          portalId,
          projectId,
          params: {
            index: page * range + 1,
          },
        });

        return users
          ? users.map(({
            id: value, name, email,
          }) => ({
            label: `${name} ${email}`,
            value,
          }))
          : [];
      },
    },
    bugId: {
      type: "string",
      label: "Bug Id",
      description: "The Id of the bug.",
      async options({
        page, portalId, projectId,
      }) {
        const { bugs } = await this.listBugs({
          portalId,
          projectId,
          params: {
            index: page * range + 1,
          },
        });

        return bugs
          ? bugs.map(({
            id_string: value, title: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    classificationId: {
      type: "string",
      label: "Classification Id",
      description: "Classification ID of the project.",
      async options({
        portalId, projectId,
      }) {
        const {
          defaultfields:
          { classification_details: classifications },
        } = await this.getDefaultFields({
          portalId,
          projectId,
        });
        return classifications.map(({
          classification_id: value, classification_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the bug.",
    },
    flag: {
      type: "string",
      label: "Flag",
      description: "Flag of the bug.",
      options: [
        "Internal",
        "External",
      ],
    },
    milestoneId: {
      type: "string",
      label: "Milestone Id",
      description: "Milestone ID of the project.",
      async options({
        page, portalId, projectId,
      }) {
        const { milestones } = await this.listMilestones({
          portalId,
          projectId,
          params: {
            index: page * range + 1,
          },
        });

        return milestones
          ? milestones.map(({
            id_string: value, name: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    moduleId: {
      type: "string",
      label: "Module Id",
      description: "Module ID of the project.",
      async options({
        portalId, projectId,
      }) {
        const {
          defaultfields:
          { module_details: modules },
        } = await this.getDefaultFields({
          portalId,
          projectId,
        });
        return modules.map(({
          module_id: value, module_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    portalId: {
      type: "string",
      label: "Portal Id",
      description: "The Id of the portal.",
      async options() {
        const { portals } = await this.listPortals();

        return portals.map(({
          id_string: value, name: label,
        }) => ({
          label,
          value: value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project Id",
      description: "project.",
      async options({
        page, portalId,
      }) {
        const { projects } = await this.listProjects({
          portalId,
          params: {
            index: page * range + 1,
          },
        });

        return projects
          ? projects.map(({
            id_string: value, name: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    severityId: {
      type: "string",
      label: "Severity Id",
      description: "Severity ID of the project.",
      async options({
        portalId, projectId,
      }) {
        const {
          defaultfields:
          { severity_details: severities },
        } = await this.getDefaultFields({
          portalId,
          projectId,
        });
        return severities.map(({
          severity_id: value, severity_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    statusId: {
      type: "string",
      label: "Status Id",
      description: "Status ID of the project.",
      async options({
        portalId, projectId,
      }) {
        const {
          defaultfields:
          { status_details: statuses },
        } = await this.getDefaultFields({
          portalId,
          projectId,
        });
        return statuses.map(({
          status_id: value, status_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    reproducibleId: {
      type: "string",
      label: "Reproducible Id",
      description: "Reproducible ID of the project.",
      async options({
        portalId, projectId,
      }) {
        const {
          defaultfields:
          { priority_details: priorities },
        } = await this.getDefaultFields({
          portalId,
          projectId,
        });
        return priorities.map(({
          priority_id: value, priority_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Name of the bug",
    },
    uploaddoc: {
      type: "string",
      label: "Upload Doc",
      description: "Please configure [Zoho Drive integration](https://help.zoho.com/portal/en/kb/projects/integration/zoho-apps/articles/zoho-workdrive-integration) to enable attachment for your Zoho BugTracker. The maximum size to upload a file is 128 MB. The path to the image file saved to the `/tmp` directory (e.g. `/tmp/image.png`). [see docs here](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
  },
  methods: {
    _apiUrl() {
      return `https://bugtracker.${this.$auth.base_api_uri}/restapi`;
    },
    _getHeaders(headers) {
      return {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      };
      return axios($, config);
    },
    createBug({
      portalId, projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `portal/${portalId}/projects/${projectId}/bugs/`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...args,
      });
    },
    getBug({
      portalId, projectId, bugId, ...args
    }) {
      return this._makeRequest({
        path: `portal/${portalId}/projects/${projectId}/bugs/${bugId}/`,
        ...args,
      });
    },
    getDefaultFields({
      portalId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `portal/${portalId}/projects/${projectId}/bugs/defaultfields/`,
        ...args,
      });
    },
    listBugs({
      portalId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `portal/${portalId}/projects/${projectId}/bugs/`,
        ...args,
      });
    },
    listMilestones({
      portalId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `portal/${portalId}/projects/${projectId}/milestones/`,
        ...args,
      });
    },
    listPortals(args = {}) {
      return this._makeRequest({
        path: "portals/",
        ...args,
      });
    },
    listProjects({
      portalId, ...args
    }) {
      return this._makeRequest({
        path: `portal/${portalId}/projects/`,
        ...args,
      });
    },
    listUsers({
      portalId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `portal/${portalId}/projects/${projectId}/users/`,
        ...args,
      });
    },
    updateBug({
      portalId, projectId, bugId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `portal/${portalId}/projects/${projectId}/bugs/${bugId}/`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        params.index = (page * range) + 1;
        page++;
        const { bugs: data } = await fn({
          params,
          ...args,
        });

        if (!data) return false;

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = data.length;

      } while (lastPage);
    },
  },
};
