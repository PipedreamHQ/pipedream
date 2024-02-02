export default {
  Alias: {
    type: "string",
    label: "Alias",
    description: "Required. Alias of the user. The alias can contain only underscores and alphanumeric characters. It must be unique in your org, not include spaces, not end with a hyphen, and not contain two consecutive hyphens.",
  },
  Email: {
    type: "string",
    label: "Email",
    description: "Required. The email address of the user.",
  },
  EmailEncodingKey: {
    type: "string",
    label: "Email Encoding Key",
    description: "Required. The key used to encode the user's email.",
  },
  LanguageLocaleKey: {
    type: "string",
    label: "Language Locale Key",
    description: "Required. The user's language locale key.",
  },
  LastName: {
    type: "string",
    label: "Last Name",
    description: "Required. The user's last name.",
  },
  LocaleSidKey: {
    type: "string",
    label: "Locale Sid Key",
    description: "Required. The user's locale sid key.",
  },
  ProfileId: {
    type: "string",
    label: "Profile ID",
    description: "Required. The ID of the user's profile.",
  },
  TimeZoneSidKey: {
    type: "string",
    label: "Time Zone Sid Key",
    description: "Required. The user's time zone sid key.",
  },
  UserName: {
    type: "string",
    label: "User Name",
    description: "Required. The user's username.",
  },
  FirstName: {
    type: "string",
    label: "First Name",
    description: "The user's first name.",
  },
  Title: {
    type: "string",
    label: "Title",
    description: "The user's title.",
  },
  Department: {
    type: "string",
    label: "Department",
    description: "The department the user belongs to.",
  },
  Division: {
    type: "string",
    label: "Division",
    description: "The division the user belongs to.",
  },
  Phone: {
    type: "string",
    label: "Phone",
    description: "The user's phone number.",
  },
  MobilePhone: {
    type: "string",
    label: "Mobile Phone",
    description: "The user's mobile phone number.",
  },
  Street: {
    type: "string",
    label: "Street",
    description: "The user's street address.",
  },
  City: {
    type: "string",
    label: "City",
    description: "The user's city.",
  },
  State: {
    type: "string",
    label: "State",
    description: "The user's state.",
  },
  PostalCode: {
    type: "string",
    label: "Postal Code",
    description: "The user's postal code.",
  },
  Country: {
    type: "string",
    label: "Country",
    description: "The user's country.",
  },
  UserRoleId: {
    type: "string",
    label: "User Role ID",
    description: "The ID of the user's role.",
  },
  IsActive: {
    type: "boolean",
    label: "Is Active",
    description: "Whether the user is active.",
  },
};