import klaviyo from "../../klaviyo.app.mjs";

export default {
  key: "klaviyo-add-member-to-list",
  name: "Add Member To List",
  description: "Add member to a specific list. [See the docs here](https://developers.klaviyo.com/en/v1-2/reference/add-members)",
  version: "0.0.1",
  type: "action",
  props: {
    klaviyo,
    list: {
      propDefinition: [
        klaviyo,
        "list",
      ],
    },
    email: {
      propDefinition: [
        klaviyo,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        klaviyo,
        "phone",
      ],
      optional: true,
    },
    externalId: {
      propDefinition: [
        klaviyo,
        "externalId",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        klaviyo,
        "title",
      ],
      optional: true,
    },
    organization: {
      propDefinition: [
        klaviyo,
        "organization",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        klaviyo,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        klaviyo,
        "lastName",
      ],
      optional: true,
    },
    image: {
      propDefinition: [
        klaviyo,
        "image",
      ],
      optional: true,
    },
    address1: {
      propDefinition: [
        klaviyo,
        "address1",
      ],
      optional: true,
    },
    address2: {
      propDefinition: [
        klaviyo,
        "address2",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        klaviyo,
        "city",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        klaviyo,
        "country",
      ],
      optional: true,
    },
    latitude: {
      propDefinition: [
        klaviyo,
        "latitude",
      ],
      optional: true,
    },
    longitude: {
      propDefinition: [
        klaviyo,
        "longitude",
      ],
      optional: true,
    },
    region: {
      propDefinition: [
        klaviyo,
        "region",
      ],
      optional: true,
    },
    zip: {
      propDefinition: [
        klaviyo,
        "zip",
      ],
      optional: true,
    },
    timezone: {
      propDefinition: [
        klaviyo,
        "timezone",
      ],
      optional: true,
    },
  },
  methods: {
    getSummary() {
      return `${this.email || this.phone
       || this.externalId} successfully added to "${this.list.label}"!`;
    },
  },
  async run({ $ }) {
    const {
      list,
      email,
      phone,
      externalId,
      title,
      organization,
      firstName,
      lastName,
      image,
      address1,
      address2,
      city,
      country,
      latitude,
      longitude,
      region,
      zip,
      timezone,
    } = this;

    const opts = {
      email,
      id: externalId,
      title,
      organization,
      first_name: firstName,
      last_name: lastName,
      image,
      location: {
        address1,
        address2,
        city,
        country,
        latitude,
        longitude,
        region,
        zip,
        timezone,
      },
    };

    if (phone) opts.phone_number = phone;

    const [
      response,
    ] = await this.klaviyo.addMemberToList(list.value, {
      body: {
        profiles: [
          opts,
        ],
      },
    });

    $.export("$summary", response || this.getSummary(response));
    return response;
  },
};
