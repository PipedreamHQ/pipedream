import { ConfigurationError } from "@pipedream/platform";

export default {
  viewId: {
    type: "string",
    label: "View Id",
    description: "The id of a view",
    options: async () => {
      const {
        app,
        clickup,
        workspaceId,
        spaceId,
        folderId,
        listId,
      } = this;

      let views = [];
      if (workspaceId) {
        views = views.concat(await (clickup || app).getTeamViews({
          workspaceId,
        }));
      }
      if (spaceId) {
        views = views.concat(await (clickup || app).getSpaceViews({
          spaceId,
        }));
      }
      if (folderId) {
        views = views.concat(await (clickup || app).getFolderViews({
          folderId,
        }));
      }
      if (listId) {
        views = views.concat(await (clickup || app).getListViews({
          listId,
        }));
      }
      return views.map((view) => ({
        label: view.name,
        value: view.id,
      }));
    },
  },
  taskId: {
    type: "string",
    label: "Task",
    description: "The id of a task",
    options: async ({ page }) => {
      const {
        app,
        clickup,
        listId,
        useCustomTaskIds,
      } = this;

      const tasks = await (clickup || app).getTasks({
        listId,
        params: {
          page,
        },
      });

      const tasksHasCustomId = tasks.some((task) => task.custom_id);
      if (useCustomTaskIds && !tasksHasCustomId) {
        throw new ConfigurationError("Custom task id is a ClickApp, and it must to be enabled on ClickUp settings.");
      }

      return tasks.map((task) => ({
        label: task.name,
        value: useCustomTaskIds ?
          task.custom_id :
          task.id,
      }));
    },
  },
  status: {
    type: "string",
    label: "Status",
    description: "Select a status",
    optional: true,
    options: async () => {
      const {
        app,
        clickup,
        listId,
      } = this;

      const { statuses } = await (clickup || app).getList({
        listId,
      });
      return statuses.map(({ status }) => status);
    },
  },
  checklistId: {
    type: "string",
    label: "Checklist",
    description: "To show options please select a **Task** first",
    options: async () => {
      const {
        app,
        clickup,
        taskId,
        useCustomTaskIds,
        authorizedTeamId,
      } = this;

      if (!taskId) {
        return [];
      }

      const params =
        (clickup || app).getParamsForCustomTaskIdCall(useCustomTaskIds, authorizedTeamId);

      const checklists = await (clickup || app).getChecklists({
        taskId,
        params,
      });

      return checklists.map((checklist) => ({
        label: checklist.name,
        value: checklist.id,
      }));
    },
  },
  checklistItemId: {
    type: "string",
    label: "Checklist Item",
    description: "To show options please select a **Task and Checklist** first",
    options: async () => {
      const {
        app,
        clickup,
        taskId,
        checklistId,
        useCustomTaskIds,
        authorizedTeamId,
      } = this;

      if (!taskId || !checklistId) {
        return [];
      }

      const params =
        (clickup || app).getParamsForCustomTaskIdCall(useCustomTaskIds, authorizedTeamId);

      const items = await (clickup || app).getChecklistItems({
        taskId,
        checklistId,
        params,
      });

      return items.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    },
  },
  customFieldId: {
    type: "string",
    label: "Custom Field",
    description: "Select a custom field",
    options: async () => {
      const {
        app,
        clickup,
        listId,
      } = this;
      if (!listId) {
        return [];
      }
      const fields = await (clickup || app).getCustomFields({
        listId,
      });

      return fields.map((field) => ({
        label: field.name,
        value: field.id,
      }));
    },
  },
  commentId: {
    type: "string",
    label: "Comment",
    description: "The id of a comment",
    options: async () => {
      const {
        app,
        clickup,
        taskId,
        listId,
        viewId,
      } = this;

      if (!taskId && !listId && !viewId) {
        throw new ConfigurationError("Please enter the List, View, or Task to retrieve Comments from");
      }
      let comments = [];

      if (taskId) {
        comments = comments.concat(await (clickup || app).getTaskComments({
          taskId,
          params: {},
        }));
      }
      if (listId) {
        comments = comments.concat(await (clickup || app).getListComments({
          listId,
        }));
      }
      if (viewId) {
        comments = comments.concat(await (clickup || app).getViewComments({
          viewId,
        }));
      }

      return comments.map((comment) => ({
        label: comment.comment_text,
        value: comment.id,
      }));
    },
  },
};
