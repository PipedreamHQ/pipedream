import setmore from "../../setmoreappointments.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "setmoreappointments-create-appointment",
  name: "Create Appointment",
  description: "Create a new appointment in Setmore Appointments. [See the documentation](https://setmore.docs.apiary.io/#introduction/appointments/create-an-appointment)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    setmore,
    staffKey: {
      propDefinition: [
        setmore,
        "staffKey",
      ],
    },
    serviceKey: {
      propDefinition: [
        setmore,
        "serviceKey",
      ],
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "Email address of the customer",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Appointment start time. Format `yyyy-MM-ddTHH:mm`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "Appointment end time. Format `yyyy-MM-ddTHH:mm`",
    },
  },
  async run({ $ }) {
    const { data: { customer } } = await this.setmore.getCustomer({
      params: {
        email: this.customerEmail,
      },
    });
    if (!customer?.length) {
      throw new ConfigurationError(`Customer with email ${this.customerEmail} not found.`);
    }
    const customerKey = customer[0].key;

    const {
      data, msg,
    } = await this.setmore.createAppointment({
      data: {
        staff_key: this.staffKey,
        service_key: this.serviceKey,
        customer_key: customerKey,
        start_time: this.startTime,
        end_time: this.endTime,
      },
      $,
    });

    if (data) {
      $.export("$summary", `Successfully created appointment with key ${data.appointment.key}.`);
    } else {
      throw new Error(`${msg}`);
    }

    return data.appointment;
  },
};
