import brevo from "../../brevo.app.mjs";

export default {
  key: "brevo-add-or-update-contact",
  name: "Add or Update a contact",
  description: "Add or Update a contact",
  version: "0.0.3",
  type: "action",
  props: {
    brevo,
    providedIdentifier: {
      type: "string",
      label: "Contact",
      description: "Email OR ID of the contact, if not present the contact will be inserted, it will be used to search the contact, if it can be found the contact will be updated else it will be inserted",
      optional: true,
      reloadProps: true,
      async options({ prevContext }) {
        return this.brevo.getContactsPaginated(prevContext, false);
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "To either be inserted or updated",
    },
  },
  async additionalProps() {
    const attributesList = await this.brevo.getContactAttributes(this);
    const attributesFields = attributesList.attributes
      .filter((attr) => attr.category === "normal")
      .reduce((acc, actual) => {
        acc[`attribute-${actual.name}`] = {
          type: "string",
          label: actual.name.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()),
          description: "To either be inserted or updated",
          optional: true,
        };
        return acc;
      }, {});
    const dynamicProps = {
      ...attributesFields,
      listIds: {
        type: "string[]",
        label: "Lists",
        description: "Array with ids of each list to be either inserted or updated,\n\n**On update the contact will be removed from previous lists**",
        options: async ({ prevContext }) => {
          return this.brevo.getListsPaginated(prevContext);
        },
      },
    };
    return dynamicProps;
  },
  async run({ $ }) {
    let identifier = this.providedIdentifier;
    const listIds = Object.keys(this.listIds).map((key) => parseInt(this.listIds[key], 10));
    let contact = null;
    if (identifier) {
      try {
        contact = await this.brevo.existingContactByIdentifier($,
          identifier);
      } catch (e) {
        contact = null;
      }
    }

    const attributes = {
      EMAIL: this.email,
    };
    for (let key of Object.keys(this).filter((k) => k.startsWith("attribute-"))) {
      const attribute = this[key];
      if (attribute) {
        attributes[key.replace("attribute-", "")] = attribute;
      }
    }
    $.export("Defined attributes", attributes);

    if (contact) {
      try {
        identifier = contact.id;
        const unlinkListIds = contact.listIds.filter((el) => !listIds.includes(el));
        await this.brevo.updateContact(
          $,
          identifier,
          attributes,
          listIds,
          unlinkListIds,
        );

        $.export("$summary", `Successfully updated contact "${identifier}"`);
      } catch ({ response: { data } }) {
        let errorMessage = data.message;
        if (data.message === "Contact already exist") {
          errorMessage = `A contact with email ${this.email} already exists!`;
        }
        throw new Error(errorMessage);
      }
    } else {
      const inserted = await this.brevo.addContact(
        $,
        attributes,
        listIds,
      );
      identifier = inserted.id;
      $.export("$summary", `Successfully inserted contact "${identifier}"`);
    }
    return this.brevo.existingContactByIdentifier(
      $,
      encodeURIComponent(identifier),
    );
  },
};
