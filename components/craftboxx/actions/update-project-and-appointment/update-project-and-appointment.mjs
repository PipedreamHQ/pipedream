import app from "../../craftboxx.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "craftboxx-update-project-and-appointment",
  name: "Update Project and Appointment",
  description: "Applies updates to a project and its corresponding appointment in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    projectTitle: {
      type: "string",
      label: "Project Title",
      description: "The title of the project",
    },
    projectNr: {
      type: "string",
      label: "Project Number",
      description: "The project number of the project",
    },
    appointmentId: {
      propDefinition: [
        app,
        "appointmentId",
      ],
    },
    title: {
      type: "string",
      label: "Appointment Title",
      description: "The title of the appointment",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the appointment",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the appointment",
      optional: true,
      options: constants.STATES,
    },
    start: {
      type: "string",
      label: "Start",
      description: "The start of the appointment. Eg. `2021-01-01T12:00:00+01:00`",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "The end of the appointment. Eg. `2021-01-01T12:30:00+01:00`",
      optional: true,
    },
  },
  methods: {
    updateProject({
      projectId, ...args
    } = {}) {
      return this.app.put({
        path: `/projects/${projectId}`,
        ...args,
      });
    },
    updateAppointment({
      appointmentId, ...args
    } = {}) {
      return this.app.put({
        path: `/assignments/${appointmentId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateProject,
      projectId,
      projectTitle,
      projectNr,
      updateAppointment,
      appointmentId,
      ...appointmentData
    } = this;

    const projectResponse = await updateProject({
      $,
      projectId,
      data: {
        title: projectTitle,
        project_nr: projectNr,
      },
    });

    const appointmentResponse = await updateAppointment({
      $,
      appointmentId,
      data: appointmentData,
    });

    $.export("$summary", `Successfully updated project with ID \`${projectResponse.data.id}\` and appointment with ID \`${appointmentResponse.data.id}\``);

    return {
      projectResponse,
      appointmentResponse,
    };
  },
};
