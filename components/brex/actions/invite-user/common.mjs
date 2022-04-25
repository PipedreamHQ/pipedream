import { axios } from "@pipedream/platform";

export default {
  props: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "User first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "User last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "User email",
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
