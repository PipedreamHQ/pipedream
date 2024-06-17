import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Creates a new contact or updates an existing contact based on email address. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=POST-/crm/v3/objects/contacts)",
  version: "0.0.9",
  type: "action",
  async additionalProps() {
    const schema = await this.hubspot.getSchema({
      objectType: this.getObjectType(),
    });
    const { results: properties } = await this.hubspot.getProperties({
      objectType: this.getObjectType(),
    });
    const props = properties
      .filter(this.isRelevantProperty)
      .map((property) => this.makePropDefinition(property, schema.requiredProperties))
      .reduce((p, {
        name, ...definition
      }) => {
        p[name] = definition;
        return p;
      }, {});
    const {
      email, ...otherProps
    } = props;
    return email
      ? {
        email,
        ...otherProps,
      }
      : props;
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.CONTACT;
    },
    async getContact(email, $) {
      if (!email) {
        return;
      }
      const data = {
        filters: [
          {
            propertyName: "email",
            operator: "EQ",
            value: email,
          },
        ],
      };
      return this.hubspot.searchCRM({
        object: "contacts",
        data,
        $,
      });
    },
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      propertyGroups,
      $db,
      ...properties
    } = this;
    const objectType = this.getObjectType();

    // checkbox (string[]) props must be semicolon separated strings
    Object.keys(properties)
      .forEach((key) => {
        let value = properties[key];
        if (Array.isArray(value)) {
          properties[key] = value.join(";");
        }
      });

    // search for the contact with the email provided
    const {
      total, results,
    } = await this.getContact(this.email, $) || {};

    // if contact is found, update it. if not, create new contact.
    const response = total > 0
      ? await hubspot.updateObject({
        $,
        objectType,
        objectId: results[0].id,
        data: {
          properties,
        },
      })
      : await hubspot.createObject({
        $,
        objectType,
        data: {
          properties,
        },
      });

    const objectName = hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully ${total > 0
      ? "updated"
      : "created"} ${objectName}`);

    return response;
  },
};
