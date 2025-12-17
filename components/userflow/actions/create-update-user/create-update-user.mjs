import app from "../../userflow.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "userflow-create-update-user",
  name: "Create or Update User",
  description: "Creates or updates a user in Userflow. If the user does not already exist in Userflow, it will be created. If it already exists, the given attributes will be merged into the existing user's attributes. [See the documentation](https://docs.userflow.com/api/users/create-or-update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    numberOfGroups: {
      type: "integer",
      label: "Number Of Groups",
      description: "The number of groups to create/update for the user.",
      reloadProps: true,
      optional: true,
    },
    numberOfMemberships: {
      type: "integer",
      label: "Number Of Memberships",
      description: "The number of memberships to create/update for the user.",
      reloadProps: true,
      optional: true,
    },
  },
  async additionalProps() {
    const {
      app,
      numberOfGroups = 0,
      numberOfMemberships = 0,
    } = this;
    let groups = [];

    const { data: userAttributes } = await app.listAttributeDefinitions({
      params: {
        scope: constants.SCOPE.USER,
        limit: 10,
      },
    });

    const { data: groupAttributes } = await app.listAttributeDefinitions({
      params: {
        scope: constants.SCOPE.GROUP,
        limit: 10,
      },
    });

    const { data: membershipAttributes } = await app.listAttributeDefinitions({
      params: {
        scope: constants.SCOPE.GROUP_MEMBERSHIP,
        limit: 10,
      },
    });

    if (numberOfGroups || numberOfMemberships) {
      ({ data: groups } = await app.listGroups({
        params: {
          limit: 100,
        },
      }));
    }

    const userAttributesProps = userAttributes.reduce((props, {
      name, display_name: label, data_type: dataType, description,
    }) => ({
      ...props,
      [`${constants.KEYATTR.USER}${name}`]: {
        type: constants.DATA_TYPE_TO_PROP_TYPE[dataType] || "string",
        label,
        description: description || label,
        optional: true,
      },
    }), {});

    const groupAttributesProps =
      Array.from({
        length: numberOfGroups || 0,
      }).reduce((props, _, index) => ({
        ...props,
        [`${constants.KEYATTR.GROUP}${index + 1}${constants.SEP}id`]: {
          type: "string",
          label: `Group ${index + 1} - ID`,
          description: "The unique identifier for the group.",
          optional: true,
          options: groups.map(({
            id: value, attributes: { name: label },
          }) => ({
            value,
            label: label || value,
          })),
        },
        ...Object.fromEntries(
          Object.entries(groupAttributes)
            .map(([
              ,
              {
                name,
                display_name: label,
                data_type: dataType,
                description,
              },
            ]) => [
              `${constants.KEYATTR.GROUP}${index + 1}${constants.SEP}${name}`,
              {
                type: constants.DATA_TYPE_TO_PROP_TYPE[dataType] || "string",
                label: `Group ${index + 1} - ${label}`,
                description: description || label,
                optional: true,
              },
            ]),
        ),
      }), {});

    const membershipAttributesProps =
      Array.from({
        length: numberOfMemberships || 0,
      }).reduce((props, _, index) => ({
        ...props,
        ...Object.fromEntries(
          Object.entries(membershipAttributes)
            .map(([
              ,
              {
                name,
                display_name: label,
                data_type: dataType,
                description,
              },
            ]) => [
              `${constants.KEYATTR.MEMBERSHIP}${index + 1}${constants.SEP}${name}`,
              {
                type: constants.DATA_TYPE_TO_PROP_TYPE[dataType] || "string",
                label: `Membership ${index + 1} - ${label}`,
                description: description || label,
                optional: true,
              },
            ]),
        ),
        [`${constants.KEYATTR.MEMBERSHIP}${index + 1}${constants.SEP}groupId`]: {
          type: "string",
          label: `Membership ${index + 1} - Group ID`,
          description: "The unique identifier for the group.",
          optional: true,
          options: groups.map(({
            id: value, attributes: { name: label },
          }) => ({
            value,
            label: label || value,
          })),
        },
        [`${constants.KEYATTR.MEMBERSHIP}${index + 1}${constants.SEP}groupAttributes`]: {
          type: "object",
          label: `Membership ${index + 1} - Group Attributes`,
          description: "A map of group attributes to set for the group.",
          optional: true,
        },
      }), {});

    return {
      ...userAttributesProps,
      ...groupAttributesProps,
      ...membershipAttributesProps,
    };
  },
  methods: {
    createUpdateUser(args = {}) {
      return this.app.post({
        path: "/users",
        ...args,
      });
    },
    getUserAttributes(data) {
      if (!data) {
        return;
      }
      return Object.fromEntries(
        Object.entries(data)
          .filter(([
            key,
          ]) => key.startsWith(constants.KEYATTR.USER))
          .map(([
            key,
            value,
          ]) => [
            key.replace(constants.KEYATTR.USER, ""),
            value,
          ]),
      );
    },
    getGroupAttributes(data, length = 0) {
      if (!data) {
        return;
      }
      const groups = Array.from({
        length,
      }).reduce((acc, _, index) => {
        const searchString = `${constants.KEYATTR.GROUP}${index + 1}${constants.SEP}`;
        const id = data[`${searchString}id`];
        const attributes = Object.fromEntries(
          Object.entries(data)
            .filter(([
              key,
            ]) => key.startsWith(searchString) && key !== `${searchString}id`)
            .map(([
              key,
              value,
            ]) => [
              key.replace(searchString, ""),
              value,
            ]),
        );
        const group = {
          id,
          attributes,
        };
        return [
          ...acc,
          group,
        ];
      }, []);

      if (!groups?.length) {
        return;
      }

      return groups;
    },
    getMembershipAttributes(data, length = 0) {
      if (!data) {
        return;
      }
      const memberships = Array.from({
        length,
      }).reduce((acc, _, index) => {
        const searchString = `${constants.KEYATTR.MEMBERSHIP}${index + 1}${constants.SEP}`;
        const groupId = data[`${searchString}groupId`];
        const groupAttributes = data[`${searchString}groupAttributes`];
        const attributes = Object.fromEntries(
          Object.entries(data)
            .filter(([
              key,
            ]) => key.startsWith(searchString) && key !== `${searchString}groupId` && key !== `${searchString}groupAttributes`)
            .map(([
              key,
              value,
            ]) => [
              key.replace(searchString, ""),
              value,
            ]),
        );
        const membership = {
          attributes,
          group: {
            id: groupId,
            attributes: groupAttributes,
          },
        };
        return [
          ...acc,
          membership,
        ];
      }, []);

      if (!memberships?.length) {
        return;
      }

      return memberships;
    },
  },
  async run({ $ }) {
    const {
      getUserAttributes,
      getGroupAttributes,
      getMembershipAttributes,
      numberOfGroups,
      numberOfMemberships,
      createUpdateUser,
      userId,
      ...data
    } = this;

    const response = await createUpdateUser({
      $,
      data: {
        id: userId,
        attributes: getUserAttributes(data),
        groups: getGroupAttributes(data, numberOfGroups),
        memberships: getMembershipAttributes(data, numberOfMemberships),
      },
    });

    $.export("$summary", `Successfully created or updated user with ID \`${response.id}\``);
    return response;
  },
};
