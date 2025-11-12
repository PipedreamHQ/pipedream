import acuityScheduling from "../../acuity_scheduling.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "acuity_scheduling-book-appointment",
  name: "Book Appointment",
  description: "Book an appointment. [See the documentation](https://developers.acuityscheduling.com/reference/post-appointments)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    acuityScheduling,
    datetime: {
      type: "string",
      label: "Datetime",
      description: "Date and time of the appointment. E.g. `2016-02-03T14:00:00-0800`",
    },
    appointmentTypeId: {
      propDefinition: [
        acuityScheduling,
        "appointmentTypeId",
      ],
      description: "The type of appointment to book",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the client",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the client",
    },
    isAdmin: {
      type: "boolean",
      label: "Is Admin",
      description: "By default appointments are created as if they are being booked by a client. Booking as an admin disables availability and attribute validations, and allows setting the notes attribute. This also requires a valid `calendarID` to be included in the request.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the client",
      optional: true,
    },
    calendarId: {
      propDefinition: [
        acuityScheduling,
        "calendarId",
      ],
      description: "The calendar to book the appointment on. If not provided we'll try to find an available calendar automatically.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the client",
      optional: true,
    },
    timezone: {
      propDefinition: [
        acuityScheduling,
        "timezone",
      ],
    },
    certificate: {
      propDefinition: [
        acuityScheduling,
        "certificate",
        (c) => ({
          appointmentTypeId: c.appointmentTypeId,
        }),
      ],
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes to be added to the appointment. Settable when booking as an admin.",
      optional: true,
    },
    labelId: {
      propDefinition: [
        acuityScheduling,
        "labelId",
      ],
      optional: true,
    },
    smsOptin: {
      type: "boolean",
      label: "SMS Opt-in",
      description: "Indicates whether the client has explicitly given their permission to receive SMS messages. This parameter is only applicable to Appointments with an Appointment Type that requires Opt In and can be omitted (and will be ignored) for all other Appointments. If omitted or set to false on an applicable Appointment, an SMS reminder will not be sent. For more information on SMS Opt In settings for Appointment Types, see the article in our [Knowledge Base](https://support.squarespace.com/hc/en-us/articles/360040093611).",
      optional: true,
    },
    formId: {
      propDefinition: [
        acuityScheduling,
        "formId",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.formId) {
      return props;
    }
    const forms = await this.acuityScheduling.listForms();
    const form = forms.find((f) => f.id === this.formId);
    const { fields } = form;
    for (const field of fields) {
      props[`${field.id}`] = {
        type: "string",
        label: field.name,
      };
      if (field.options) {
        props[`${field.id}`].options = field.options;
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      acuityScheduling,
      datetime,
      appointmentTypeId,
      firstName,
      lastName,
      isAdmin,
      email,
      calendarId,
      phone,
      timezone,
      certificate,
      notes,
      labelId,
      smsOptin,
      formId,
      ...fieldValues
    } = this;

    if (isAdmin && !calendarId) {
      throw new ConfigurationError("`calendarID` is required when booking as an admin");
    }

    if (!isAdmin && !email) {
      throw new ConfigurationError("`email` is required when booking as a client");
    }

    if (!isAdmin && notes) {
      throw new ConfigurationError("`notes` is only available when booking as an admin");
    }

    if (formId && !appointmentTypeId) {
      throw new ConfigurationError("`formId` is required when booking an appointment with a form");
    }

    const fields = [];
    if (Object.keys(fieldValues).length > 0) {
      for (const [
        fieldId,
        value,
      ] of Object.entries(fieldValues)) {
        fields.push({
          id: fieldId,
          value,
        });
      }
    }

    const response = await acuityScheduling.createAppointment({
      $,
      params: {
        admin: isAdmin,
      },
      data: {
        datetime,
        appointmentTypeID: appointmentTypeId,
        firstName,
        lastName,
        email,
        calendarID: calendarId,
        phone,
        timezone,
        certificate,
        notes,
        labels: labelId
          ? [
            {
              id: labelId,
            },
          ]
          : undefined,
        smsOptin,
        fields,
      },
    });
    $.export("$summary", `Successfully booked appointment with ID: ${response.id}`);
    return response;
  },
};
