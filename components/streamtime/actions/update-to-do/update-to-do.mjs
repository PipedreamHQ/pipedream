import streamtime from "../../streamtime.app.mjs";

export default {
  key: "streamtime-update-to-do",
  name: "Update To-Do",
  description: "Update an existing To Do in Streamtime. [See the documentation](https://documenter.getpostman.com/view/802974/RWgtSwbn?version=latest#5fb593b9-a83c-4e01-8206-5a56f005825a).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streamtime,
    toDoId: {
      propDefinition: [
        streamtime,
        "toDoId",
      ],
    },
    userId: {
      propDefinition: [
        streamtime,
        "userId",
      ],
    },
    statusId: {
      propDefinition: [
        streamtime,
        "statusId",
      ],
    },
    jobId: {
      propDefinition: [
        streamtime,
        "jobId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date of the To Do in `YYYY-MM-DD` format",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the to do",
      optional: true,
    },
    private: {
      type: "boolean",
      label: "Private",
      description: "Set to `true` to set the to do as private",
      default: false,
      optional: true,
    },
    minutes: {
      type: "integer",
      label: "Minutes",
      description: "Minutes for the To Do",
      optional: true,
    },
  },
  async run({ $ }) {
    const toDo = await this.streamtime.getToDo({
      toDoId: this.toDoId,
      $,
    });

    const data = {
      id: this.toDoId,
      userId: this.userId || toDo.userId,
      date: this.date || toDo.date,
      loggedTimeStatus: this.statusId || toDo.loggedTimeStatus
        ? {
          id: this.statusId || toDo.loggedTimeStatus.id,
        }
        : null,
      job: this.jobId || toDo.job
        ? {
          id: this.jobId || toDo.job.id,
        }
        : null,
      jobItemUser: toDo.jobItemUser
        ? {
          id: toDo.jobItemUser.id,
        }
        : null,
      notes: this.notes || toDo.notes,
      private: this.private || toDo.private,
      minutes: this.minutes || toDo.minutes,
    };

    const response = await this.streamtime.updateToDo({
      toDoId: this.toDoId,
      data,
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully updated To Do with ID ${response.id}.`);
    }

    return response;
  },
};
