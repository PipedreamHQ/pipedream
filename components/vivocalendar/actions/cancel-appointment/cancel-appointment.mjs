import app from "../../vivocalendar.app.mjs";

export default {
  key: "vivocalendar-cancel-appointment",
  name: "Cancel Appointment",
  description: "Cancels an appointment. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    user: {
      propDefinition: [
        app,
        "staffUserId",
        () => ({
          mapper: ({
            id, email, name: label,
          }) => ({
            label,
            value: `${id}:${email}`,
          }),
        }),
      ],
    },
    appointmentId: {
      propDefinition: [
        app,
        "appointmentId",
        ({ user }) => {
          const email = user.split(":")[1];
          return {
            email,
          };
        },
      ],
    },
  },
  methods: {
    cancelAppointment({
      appointmentId, ...args
    } = {}) {
      return this.app.delete({
        path: `/appointments/${appointmentId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      cancelAppointment,
      user,
      appointmentId,
    } = this;

    const userId = user.split(":")[0];

    const response = await cancelAppointment({
      $,
      appointmentId,
      data: {
        appointment: {
          user_id: userId,
        },
      },
    });

    $.export("$summary", "Successfully cancelled appointment");
    return response;
  },
};
