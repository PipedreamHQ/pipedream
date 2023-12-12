import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "meistertask",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      async options({ page }) {
        const projects = await this.listProjects({
          params: {
            page: page + 1,
          },
        });
        return projects?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    sectionId: {
      type: "string",
      label: "Section",
      description: "Identifier of a section",
      async options({
        page, projectId,
      }) {
        const params = {
          page: page + 1,
        };
        const projects = projectId
          ? await this.listProjectSections({
            projectId,
            params,
          })
          : await this.listSections({
            params,
          });
        return projects?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    taskId: {
      type: "string",
      label: "Task",
      description: "Identifier of a task",
      async options({
        page, sectionId, projectId,
      }) {
        const params = {
          page: page + 1,
        };
        const tasks = [];
        if (sectionId) {
          const sectionTasks = await this.listSectionTasks({
            sectionId,
            params,
          });
          tasks.push(...sectionTasks);
        } else if (projectId) {
          const projectTasks = await this.listProjectTasks({
            projectId,
            params,
          });
          tasks.push(...projectTasks);
        } else {
          const allTasks = await this.listTasks({
            params,
          });
          tasks.push(...allTasks);
        }
        return tasks?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    attachmentId: {
      type: "string",
      label: "Attachment",
      description: "Identifier of an attachment",
      async options({
        page, taskId,
      }) {
        const attachments = await this.listAttachments({
          taskId,
          params: {
            page: page + 1,
          },
        });
        return attachments?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    labelId: {
      type: "string",
      label: "Label",
      description: "Identifier of a label",
      async options({
        page, projectId, taskId,
      }) {
        const params = {
          page: page + 1,
        };
        const labels = taskId
          ? await this.listTaskLabels({
            taskId,
            params,
          })
          : await this.listProjectLabels({
            projectId,
            params,
          });
        return labels?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    personId: {
      type: "string",
      label: "Person",
      description: "Identifier of a person",
      async options({
        page, projectId,
      }) {
        const params = {
          page: page + 1,
        };
        const persons = projectId
          ? await this.listProjectPersons({
            projectId,
            params,
          })
          : await this.listPersons({
            params,
          });
        return persons?.map(({
          id, email,
        }) => ({
          label: email,
          value: id,
        })) || [];
      },
    },
    labelColor: {
      type: "string",
      label: "Label Color",
      description: "The color of the label",
      options: constants.LABEL_COLOR_OPTIONS,
    },
    taskStatus: {
      type: "string",
      label: "Task Status",
      description: "The status of the task",
      options: constants.TASK_STATUS_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.meistertask.com/api";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    getAttachment({
      attachmentId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/attachments/${attachmentId}`,
        ...args,
      });
    },
    getPerson({
      personId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/persons/${personId}`,
        ...args,
      });
    },
    getLabel({
      labelId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/labels/${labelId}`,
        ...args,
      });
    },
    getTask({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}`,
        ...args,
      });
    },
    listAttachments({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}/attachments`,
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    listProjectTasks({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks`,
        ...args,
      });
    },
    listSectionTasks({
      sectionId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/sections/${sectionId}/tasks`,
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    listSections(args = {}) {
      return this._makeRequest({
        path: "/sections",
        ...args,
      });
    },
    listProjectSections({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/sections`,
        ...args,
      });
    },
    listProjectChecklists({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/checklists`,
        ...args,
      });
    },
    listTaskChecklists({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}/checklists`,
        ...args,
      });
    },
    listPersons(args = {}) {
      return this._makeRequest({
        path: "/persons",
        ...args,
      });
    },
    listProjectPersons({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/persons`,
        ...args,
      });
    },
    listProjectLabels({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/labels`,
        ...args,
      });
    },
    listTaskLabels({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}/labels`,
        ...args,
      });
    },
    listComments({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}/comments`,
        ...args,
      });
    },
    createAttachment({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}/attachments`,
        method: "POST",
        ...args,
      });
    },
    createLabel({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/labels`,
        method: "POST",
        ...args,
      });
    },
    createTask({
      sectionId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/sections/${sectionId}/tasks`,
        method: "POST",
        ...args,
      });
    },
    addLabelToTask({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}/task_labels`,
        method: "POST",
        ...args,
      });
    },
    updateTask({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
