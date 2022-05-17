// legacy_hash_id: a_B0immB
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-create-contacts",
  name: "Create Contact",
  description: "Creates a new contact.",
  version: "0.1.2",
  type: "action",
  props: {
    mautic: {
      type: "app",
      app: "mautic",
    },
    title: {
      type: "string",
      optional: true,
    },
    firstname: {
      type: "string",
      optional: true,
    },
    lastname: {
      type: "string",
      optional: true,
    },
    company: {
      type: "string",
      optional: true,
    },
    position: {
      type: "string",
      optional: true,
    },
    email: {
      type: "string",
      optional: true,
    },
    mobile: {
      type: "string",
      optional: true,
    },
    phone: {
      type: "string",
      optional: true,
    },
    points: {
      type: "string",
      optional: true,
    },
    fax: {
      type: "string",
      optional: true,
    },
    address1: {
      type: "string",
      optional: true,
    },
    address2: {
      type: "string",
      optional: true,
    },
    city: {
      type: "string",
      optional: true,
    },
    state: {
      type: "string",
      optional: true,
    },
    zipcode: {
      type: "string",
      optional: true,
    },
    country: {
      type: "string",
      optional: true,
    },
    preferred_locale: {
      type: "string",
      optional: true,
    },
    timezone: {
      type: "string",
      optional: true,
    },
    last_active: {
      type: "string",
      optional: true,
    },
    attribution_date: {
      type: "string",
      optional: true,
    },
    attribution: {
      type: "string",
      optional: true,
    },
    website: {
      type: "string",
      optional: true,
    },
    crm_id: {
      type: "string",
      optional: true,
    },
    haspurchased: {
      type: "string",
      optional: true,
    },
    b2b_or_b2c: {
      type: "string",
      optional: true,
    },
    products: {
      type: "string",
      optional: true,
    },
    subscription_status: {
      type: "string",
      optional: true,
    },
    datetime: {
      type: "string",
      optional: true,
    },
    prospect_or_customer: {
      type: "string",
      optional: true,
    },
    car_or_truck: {
      type: "string",
      optional: true,
    },
    company_size: {
      type: "string",
      optional: true,
    },
    sandbox: {
      type: "string",
      optional: true,
    },
    cart_status: {
      type: "string",
      optional: true,
    },
    nps__recommend: {
      type: "string",
      optional: true,
    },
    role: {
      type: "string",
      optional: true,
    },
    facebook: {
      type: "string",
      optional: true,
    },
    foursquare: {
      type: "string",
      optional: true,
    },
    instagram: {
      type: "string",
      optional: true,
    },
    linkedin: {
      type: "string",
      optional: true,
    },
    skype: {
      type: "string",
      optional: true,
    },
    twitter: {
      type: "string",
      optional: true,
    },
    ipAddress: {
      type: "string",
      description: "IP address to associate with the contact",
      optional: true,
    },
    lastActive: {
      type: "string",
      description: "Date/time in UTC; preferablly in the format of Y-m-d H:m:i but if that format fails, the string will be sent through PHP's strtotime then formatted.",
      optional: true,
    },
    owner: {
      type: "string",
      description: "ID of a Mautic user to assign this contact to.",
      optional: true,
    },
    overwriteWithBlank: {
      type: "boolean",
      description: "If true, then empty values are set to fields. Otherwise empty values are skipped",
      optional: true,
    },
    tags: {
      type: "string[]",
      description: "Tags that will be assigned to new contact.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs at: https://developer.mautic.org/#create-contact

    return await axios($, {
      method: "post",
      url: `${this.mautic.$auth.mautic_url}/api/contacts/new`,
      headers: {
        Authorization: `Bearer ${this.mautic.$auth.oauth_access_token}`,
      },
      data: {
        title: this.title,
        firstname: this.firstname,
        lastname: this.lastname,
        company: this.company,
        position: this.position,
        email: this.email,
        mobile: this.mobile,
        phone: this.phone,
        points: this.points,
        fax: this.fax,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        state: this.state,
        zipcode: this.zipcode,
        country: this.country,
        preferred_locale: this.preferred_locale,
        timezone: this.timezone,
        last_active: this.last_active,
        attribution_date: this.attribution_date,
        attribution: this.attribution,
        website: this.website,
        crm_id: this.crm_id,
        haspurchased: this.haspurchased,
        b2b_or_b2c: this.b2b_or_b2c,
        products: this.products,
        subscription_status: this.subscription_status,
        datetime: this.datetime,
        prospect_or_customer: this.prospect_or_customer,
        car_or_truck: this.car_or_truck,
        company_size: this.company_size,
        sandbox: this.sandbox,
        cart_status: this.cart_status,
        nps__recommend: this.nps__recommend,
        role: this.role,
        facebook: this.facebook,
        foursquare: this.foursquare,
        instagram: this.instagram,
        linkedin: this.linkedin,
        skype: this.skype,
        twitter: this.twitter,
        ipAddress: this.ipAddress,
        lastActive: this.lastActive,
        owner: this.owner,
        overwriteWithBlank: this.overwriteWithBlank,
        tags: this.tags,
      },
    });
  },
};
