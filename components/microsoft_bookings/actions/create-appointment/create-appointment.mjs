import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-create-appointment",
  name: "Create Appointment",
  description: "Creates a new appointment in a Microsoft Bookings business. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingbusiness-post-appointments?view=graph-rest-1.0)",
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
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
        ({ businessId }) => ({
          businessId,
        }),
      ],
    },
    customerId: {
      propDefinition: [
        app,
        "staffMemberId",
        ({ businessId }) => ({
          businessId,
        }),
      ],
      label: "Customer ID",
      description: "Select an existing customer. **Important**: Customers must exist in the system before booking appointments.",
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer",
      optional: true,
    },
    customerEmailAddress: {
      type: "string",
      label: "Customer Email Address",
      description: "The SMTP address of the customer",
      optional: true,
    },
    customerTimeZone: {
      type: "string",
      label: "Customer Time Zone",
      description: "The customer's time zone (e.g., America/Chicago, UTC)",
      optional: true,
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "The date and time when the appointment begins in ISO 8601 format (e.g., 2024-05-01T12:00:00)",
    },
    endDateTime: {
      type: "string",
      label: "End Date Time",
      description: "The date and time when the appointment ends in ISO 8601 format (e.g., 2024-05-01T13:00:00)",
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time zone for the appointment (e.g., UTC, America/Chicago)",
    },
    customerPhone: {
      type: "string",
      label: "Customer Phone",
      description: "The phone number of the customer",
      optional: true,
    },
    customerNotes: {
      type: "string",
      label: "Customer Notes",
      description: "Notes from the customer associated with this appointment",
      optional: true,
    },
    isLocationOnline: {
      type: "boolean",
      label: "Is Location Online",
      description: "True indicates that the appointment will be held online",
      optional: true,
    },
    staffMemberIds: {
      type: "string[]",
      label: "Staff Member IDs",
      description: "The IDs of each staff member who is scheduled in this appointment",
      optional: true,
      propDefinition: [
        app,
        "staffMemberId",
        ({ businessId }) => ({
          businessId,
        }),
      ],
    },
    smsNotificationsEnabled: {
      type: "boolean",
      label: "SMS Notifications Enabled",
      description: "If SMS notifications will be sent to the customers for the appointment",
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "The regular price for the appointment",
      optional: true,
    },
    priceType: {
      type: "string",
      label: "Price Type",
      description: "The pricing structure for the appointment",
      optional: true,
      options: [
        "undefined",
        "fixedPrice",
        "startingAt",
        "hourly",
        "free",
        "priceVaries",
        "callUs",
        "notSet",
      ],
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "The length of the appointment in ISO 8601 format (e.g., PT1H for 1 hour, PT30M for 30 minutes). If not specified, calculated from start/end times.",
      optional: true,
    },
    maximumAttendeesCount: {
      type: "integer",
      label: "Maximum Attendees Count",
      description: "The maximum number of customers allowed in this appointment",
      optional: true,
    },
    preBuffer: {
      type: "string",
      label: "Pre-Buffer",
      description: "Time to reserve before the appointment in ISO 8601 format (e.g., PT15M for 15 minutes)",
      optional: true,
    },
    postBuffer: {
      type: "string",
      label: "Post-Buffer",
      description: "Time to reserve after the appointment in ISO 8601 format (e.g., PT15M for 15 minutes)",
      optional: true,
    },
    serviceNotes: {
      type: "string",
      label: "Service Notes",
      description: "Notes from the staff member about this appointment",
      optional: true,
    },
    additionalInformation: {
      type: "string",
      label: "Additional Information",
      description: "Additional information sent to the customer when the appointment is confirmed",
      optional: true,
    },
    isCustomerAllowedToManageBooking: {
      type: "boolean",
      label: "Customer Can Manage Booking",
      description: "Indicates that the customer can manage bookings created by the staff",
      optional: true,
    },
    optOutOfCustomerEmail: {
      type: "boolean",
      label: "Opt Out of Customer Email",
      description: "If true, the customer doesn't wish to receive a confirmation for this appointment",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      businessId,
      serviceId,
      customerId,
      customerName,
      customerEmailAddress,
      customerTimeZone,
      startDateTime,
      endDateTime,
      timeZone,
      customerPhone,
      customerNotes,
      isLocationOnline,
      staffMemberIds,
      smsNotificationsEnabled,
      price,
      priceType,
      duration,
      maximumAttendeesCount,
      preBuffer,
      postBuffer,
      serviceNotes,
      additionalInformation,
      isCustomerAllowedToManageBooking,
      optOutOfCustomerEmail,
    } = this;

    if (!customerId) {
      throw new Error("Customer ID is required. Please select an existing customer.");
    }

    const content = {
      "@odata.type": "#microsoft.graph.bookingAppointment",
      "serviceId": serviceId,
      "customerTimeZone": customerTimeZone || timeZone,
      "startDateTime": {
        "@odata.type": "#microsoft.graph.dateTimeTimeZone",
        "dateTime": startDateTime,
        "timeZone": timeZone,
      },
      "endDateTime": {
        "@odata.type": "#microsoft.graph.dateTimeTimeZone",
        "dateTime": endDateTime,
        "timeZone": timeZone,
      },
      "customers": [
        {
          "@odata.type": "#microsoft.graph.bookingCustomerInformation",
          "customerId": customerId,
          ...(customerName && {
            "name": customerName,
          }),
          ...(customerEmailAddress && {
            "emailAddress": customerEmailAddress,
          }),
          ...(customerPhone && {
            "phone": customerPhone,
          }),
          "timeZone": customerTimeZone || timeZone,
        },
      ],
    };

    if (customerNotes) content.customerNotes = customerNotes;
    if (isLocationOnline !== undefined) {
      content.isLocationOnline = isLocationOnline;
    }
    if (staffMemberIds?.length > 0) content.staffMemberIds = staffMemberIds;
    if (smsNotificationsEnabled !== undefined) {
      content.smsNotificationsEnabled = smsNotificationsEnabled;
    }
    if (price) content.price = parseFloat(price);
    if (priceType) content.priceType = priceType;
    if (duration) content.duration = duration;
    if (maximumAttendeesCount) content.maximumAttendeesCount = maximumAttendeesCount;
    if (preBuffer) content.preBuffer = preBuffer;
    if (postBuffer) content.postBuffer = postBuffer;
    if (serviceNotes) content.serviceNotes = serviceNotes;
    if (additionalInformation) content.additionalInformation = additionalInformation;
    if (isCustomerAllowedToManageBooking !== undefined) {
      content.isCustomerAllowedToManageBooking = isCustomerAllowedToManageBooking;
    }
    if (optOutOfCustomerEmail !== undefined) {
      content.optOutOfCustomerEmail = optOutOfCustomerEmail;
    }

    try {
      const response = await app.createAppointment({
        businessId,
        content,
      });

      $.export("$summary", `Successfully created appointment for ${customerName}`);

      return response;
    } catch (error) {
      console.error("Error creating appointment:", error);
      console.error("Request payload:", JSON.stringify(content, null, 2));
      throw new Error(`Failed to create appointment: ${error.message || error.toString()}`);
    }
  },
};
