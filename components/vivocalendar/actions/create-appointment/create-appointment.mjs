import app from "../../vivocalendar.app.mjs";

export default {
  key: "vivocalendar-create-appointment",
  name: "Create Appointment",
  description: "Creates a new appointment. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "staffUserId",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    startTime: {
      propDefinition: [
        app,
        "appointmentStartTime",
      ],
    },
    date: {
      propDefinition: [
        app,
        "appointmentDate",
      ],
    },
    endTime: {
      propDefinition: [
        app,
        "appointmentEndTime",
      ],
    },
    title: {
      type: "string",
      label: "Appointment Title",
      description: "The title of the appointment",
      optional: true,
    },
    price: {
      type: "integer",
      label: "Appointment Price",
      description: "The price of the appointment",
      optional: true,
      default: 0,
    },
    duration: {
      type: "integer",
      label: "Appointment Duration",
      description: "The duration of the appointment in minutes",
    },
    description: {
      type: "string",
      label: "Appointment Description",
      description: "The description of the appointment",
      optional: true,
    },
    customerName: {
      propDefinition: [
        app,
        "customerName",
      ],
    },
    customerEmail: {
      propDefinition: [
        app,
        "customerEmail",
      ],
    },
  },
  methods: {
    createAppointment(args = {}) {
      return this.app.post({
        path: "/appointments",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createAppointment,
      userId,
      serviceId,
      startTime,
      date,
      endTime,
      title,
      description,
      price,
      duration,
      customerName,
      customerEmail,
    } = this;

    const response = await createAppointment({
      $,
      params: {
        "appointment[user_id]": userId,
        "appointment[service_id]": serviceId,
        "appointment[appointment_start_time]": startTime,
        "appointment[appointment_date]": date,
        "appointment[appointment_end_time]": endTime,
        "appointment[price]": price,
        "appointment[title]": title,
        "appointment[duration]": duration,
        "appointment[description]": description,
        "customer[name]": customerName,
        "customer[email]": customerEmail,
      },
    });

    $.export("$summary", `Successfully created appointment with ID \`${response?.response?.appointment?.id}\``);
    return response;
  },
};
