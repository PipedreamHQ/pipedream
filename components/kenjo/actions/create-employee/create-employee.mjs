import kenjo from "../../kenjo.app.mjs";

export default {
  key: "kenjo-create-employee",
  name: "Create Employee",
  description: "Creates a new employee in Kenjo. [See the documentation](https://kenjo.readme.io/reference/post_employees)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kenjo,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the employee",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the employee",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the employee",
    },
    companyId: {
      propDefinition: [
        kenjo,
        "companyId",
      ],
    },
    weeklyHours: {
      type: "integer",
      label: "Weekly Hours",
      description: "The number of weekly hours that an employee works",
    },
    officeId: {
      propDefinition: [
        kenjo,
        "officeId",
        (c) => ({
          companyId: c.companyId,
        }),
      ],
    },
    departmentId: {
      propDefinition: [
        kenjo,
        "departmentId",
      ],
    },
    language: {
      type: "string",
      label: "Language",
      description: "The employee's language",
      options: [
        "en",
        "es",
        "de",
      ],
      optional: true,
    },
    birthdate: {
      type: "string",
      label: "Birthdate",
      description: "The birthdate of the employee. Format `YYYY-MM-DDThh:mm:ss.000Z`",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the employee",
      optional: true,
    },
    workPhone: {
      type: "string",
      label: "Work Phone",
      description: "The work phone number of the employee",
      optional: true,
    },
    personalPhone: {
      type: "string",
      label: "Personal Phone",
      description: "The personal phone number of the employee",
      optional: true,
    },
    workDays: {
      type: "string[]",
      label: "Work Days",
      description: "The days of the week that the employee works",
      options: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      optional: true,
    },
    trackAttendance: {
      type: "boolean",
      label: "Track Attendance",
      description: "Set to `true` to activate attendance tracking for the employee",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street address of the employee",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the employee",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the employee",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country code in ISO 3166-1 alpha-2. Example: `ES`",
      optional: true,
    },
  },
  async run({ $ }) {
    const workSchedule = {
      trackAttendance: this.trackAttendance,
    };
    if (this.workDays?.length) {
      for (const day of this.workDays) {
        workSchedule[`${day}WorkingDay`] = true;
      }
    }

    const response = await this.kenjo.createEmployee({
      $,
      data: {
        account: {
          email: this.email,
          language: this.language,
        },
        personal: {
          firstName: this.firstName,
          lastName: this.lastName,
          birthdate: this.birthdate,
        },
        work: {
          companyId: this.companyId,
          officeId: this.officeId,
          departmentId: this.departmentId,
          weeklyHours: this.weeklyHours,
          jobTitle: this.jobTitle,
          workPhone: this.workPhone,
        },
        workSchedule,
        address: (this.street || this.postalCode || this.city || this.country) && {
          street: this.street,
          postalCode: this.postalCode,
          city: this.city,
          country: this.country,
        },
        home: this.personalPhone && {
          personalPhone: this.personalPhone,
        },
      },
    });
    $.export("$summary", `Created employee with ID: ${response.account._id}`);
    return response;
  },
};
