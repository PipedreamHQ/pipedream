import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-create-staff-member",
  name: "Create Staff Member",
  description: "Creates a new staff member in a Microsoft Bookings business. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingbusiness-post-staffmembers?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name of the staff member, as displayed to customers",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the staff member",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the staff member in the business",
      options: [
        {
          label: "Guest",
          value: "guest",
        },
        {
          label: "Administrator",
          value: "administrator",
        },
        {
          label: "Viewer",
          value: "viewer",
        },
        {
          label: "External Guest",
          value: "externalGuest",
        },
        {
          label: "Scheduler",
          value: "scheduler",
        },
        {
          label: "Team Member",
          value: "teamMember",
        },
      ],
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time zone of the staff member (e.g., America/Chicago)",
      optional: true,
    },
    useBusinessHours: {
      type: "boolean",
      label: "Use Business Hours",
      description: "True means the staff member's availability is as specified in the businessHours property of the business. False means the availability is determined by the staff member's workingHours property setting",
      optional: true,
    },
    isEmailNotificationEnabled: {
      type: "boolean",
      label: "Email Notifications Enabled",
      description: "Whether to send email notifications to the staff member",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      businessId,
      displayName,
      emailAddress,
      role,
      timeZone,
      useBusinessHours,
      isEmailNotificationEnabled,
    } = this;

    const content = {
      "@odata.type": "#microsoft.graph.bookingStaffMember",
      displayName,
      emailAddress,
      role,
    };

    if (timeZone) content.timeZone = timeZone;
    if (useBusinessHours !== undefined) {
      content.useBusinessHours = useBusinessHours;
    }
    if (isEmailNotificationEnabled !== undefined) {
      content.isEmailNotificationEnabled = isEmailNotificationEnabled;
    }

    const response = await app.createStaffMember({
      businessId,
      content,
    });

    $.export("$summary", `Successfully created staff member: ${displayName}`);

    return response;
  },
};
