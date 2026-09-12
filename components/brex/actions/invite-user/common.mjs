import { axios } from "@pipedream/platform";

export default {
  props: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "The user's first name, e.g. `Jane`.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name, e.g. `Doe`.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The work email address the invitation is sent to, e.g. `jane@acme.com`. Must be unique within the Brex account.",
    },
  },
  async run ({ $ }) {
    const {
      firstName,
      lastName,
      email,
      manager,
      department,
      location,
    } = this;

    const res = await axios($, this.brexApp._getAxiosParams({
      method: "POST",
      path: "/v2/users",
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        manager_id: manager,
        department_id: department,
        location_id: location,
      },
    }));

    $.export("$summary", `${firstName} ${lastName} <${email}> successfully invited.`);
    return res;
  },
};
