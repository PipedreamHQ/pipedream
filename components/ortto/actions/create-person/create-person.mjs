import { clearObj } from "../../common/utils.mjs";
import ortto from "../../ortto.app.mjs";

export default {
  key: "ortto-create-person",
  name: "Create or Update a Person",
  description: "Create or update a preexisting person in the Ortto account. [See the documentation](https://help.ortto.com/a-250-api-reference)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ortto,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The person's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The person's phone number.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The person's email address.",
    },
    city: {
      type: "string",
      label: "City",
      description: "The person's address city.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The person's address country.",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region",
      description: "The person's address region.",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "The person's birth date.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      ortto,
      ...props
    } = this;

    const birthday = {};
    if (props.birthday) {
      const date = new Date(props.birthday);
      birthday.day = date.getDate();
      birthday.month = date.getMonth() + 1;
      birthday.year = date.getFullYear();
    }

    const response = await ortto.createPerson({
      data: {
        people: [
          {
            fields: clearObj({
              "str::first": props.firstName,
              "str::last": props.lastName,
              "phn::phone": {
                "phone": props.phone,
                "parse_with_country_code": true,
              },
              "str::email": props.email,
              "geo::city": {
                name: props.city,
              },
              "geo::country": {
                name: props.country,
              },
              "geo::region": {
                name: props.region,
              },
              "dtz::b": birthday,
            }),
          },
        ],
        async: false,
        merge_by: [
          "str::email",
        ],
        find_strategy: 0,
      },
    });
    $.export("$summary", "Person successfully initialized or updated!");
    return response;
  },
};
