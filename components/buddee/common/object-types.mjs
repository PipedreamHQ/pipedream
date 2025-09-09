export const EMPLOYEE_OBJECT_TYPE = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "Unique identifier for the employee",
    },
    first_name: {
      type: "string",
      description: "Employee's first name",
    },
    last_name: {
      type: "string",
      description: "Employee's last name",
    },
    email: {
      type: "string",
      description: "Employee's email address",
    },
    phone: {
      type: "string",
      description: "Employee's phone number",
    },
    date_of_birth: {
      type: "string",
      description: "Employee's date of birth",
    },
    address: {
      type: "string",
      description: "Employee's address",
    },
    city: {
      type: "string",
      description: "Employee's city",
    },
    postal_code: {
      type: "string",
      description: "Employee's postal code",
    },
    country: {
      type: "string",
      description: "Employee's country",
    },
    created_at: {
      type: "string",
      description: "Date when the employee was created",
    },
    updated_at: {
      type: "string",
      description: "Date when the employee was last updated",
    },
  },
};

export const LEAVE_REQUEST_OBJECT_TYPE = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "Unique identifier for the leave request",
    },
    employee_id: {
      type: "integer",
      description: "ID of the employee requesting leave",
    },
    leave_type_id: {
      type: "integer",
      description: "ID of the leave type",
    },
    start_date: {
      type: "string",
      description: "Start date of the leave request",
    },
    end_date: {
      type: "string",
      description: "End date of the leave request",
    },
    reason: {
      type: "string",
      description: "Reason for the leave request",
    },
    status: {
      type: "string",
      description: "Status of the leave request",
    },
    half_day: {
      type: "boolean",
      description: "Whether this is a half-day leave request",
    },
    morning_half_day: {
      type: "boolean",
      description: "If half day, whether it's morning or afternoon",
    },
    created_at: {
      type: "string",
      description: "Date when the leave request was created",
    },
    updated_at: {
      type: "string",
      description: "Date when the leave request was last updated",
    },
  },
};

export const TIME_REGISTRATION_OBJECT_TYPE = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      description: "Unique identifier for the time registration",
    },
    employee_id: {
      type: "integer",
      description: "ID of the employee",
    },
    date: {
      type: "string",
      description: "Date of the time registration",
    },
    start_time: {
      type: "string",
      description: "Start time of work",
    },
    end_time: {
      type: "string",
      description: "End time of work",
    },
    break_duration: {
      type: "integer",
      description: "Break duration in minutes",
    },
    total_hours: {
      type: "number",
      description: "Total hours worked",
    },
    description: {
      type: "string",
      description: "Description of work performed",
    },
    created_at: {
      type: "string",
      description: "Date when the time registration was created",
    },
    updated_at: {
      type: "string",
      description: "Date when the time registration was last updated",
    },
  },
};
