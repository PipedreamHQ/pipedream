/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */

// Based on the Zoho CRM API docs for the /users endpoint:
// https://www.zoho.com/crm/developer/docs/api/v2/get-users.html
export default [
  {
    value: "AllUsers",
    label: "All users in your organization (both active and inactive users)",
  },
  {
    value: "ActiveUsers",
    label: "Active Users",
  },
  {
    value: "DeactiveUsers",
    label: "Users who were deactivated",
  },
  {
    value: "ConfirmedUsers",
    label: "Confirmed users",
  },
  {
    value: "NotConfirmedUsers",
    label: "Non-confirmed users",
  },
  {
    value: "DeletedUsers",
    label: "Deleted users",
  },
  {
    value: "ActiveConfirmedUsers",
    label: "Active users who are also confirmed",
  },
  {
    value: "AdminUsers",
    label: "Admin users",
  },
  {
    value: "ActiveConfirmedAdmins",
    label: "Active users with the administrative privileges and are also confirmed",
  },
  {
    value: "CurrentUser",
    label: "The current CRM user",
  },
];
