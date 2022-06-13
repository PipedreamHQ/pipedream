import constants from "../constants.mjs";

export default {
  computePermissions(overwrites = []) {
    if (!overwrites.length) {
      return [];
    }
    return overwrites.reduce((reduction, overwrite) => {
      const overwriteInt = parseInt(overwrite, 10);
      return reduction
        ? (parseInt(reduction, 10) | overwriteInt)
        : overwriteInt;
    }, undefined);
  },
  getChannelOptions({
    channels, notAllowedChannels = [],
  }) {
    return channels.reduce((reduction, channel) => {
      return !notAllowedChannels.includes(channel.type)
        ? [
          ...reduction,
          {
            label: channel.name,
            value: channel.id,
          },
        ]
        : reduction;

    }, []);
  },
  getCategoryChannelOptions(channels) {
    return channels.reduce((reduction, channel) => {
      return channel.type === constants.CHANNEL_TYPES.GUILD_CATEGORY
        ? [
          ...reduction,
          {
            label: channel.name,
            value: channel.id,
          },
        ]
        : reduction;
    }, []);
  },
  getRolePermissionOptions(roles) {
    return roles.reduce((reduction, role) => {
      return !role.managed && !role.name.startsWith("@")
        ? [
          ...reduction,
          {
            label: role.name,
            value: JSON.stringify({
              id: role.id,
              type: constants.PERMISSION_TYPES.ROLE,
              allow: role.permissions,
            }),
          },
        ]
        : reduction;
    }, []);
  },
  getMemberPermissionOptions([
    guild,
    currentRoles,
    members,
  ]) {
    const { owner_id: ownerId } = guild;

    return members.reduce((reduction, member) => {
      // Filter out the bot app and user who owns the guild
      if (member.user.bot || ownerId === member.user.id) {
        return reduction;
      }

      const memberPermissions = member.roles.map((roleId) => {
        const role = currentRoles.find((role) => role.id === roleId);
        return role.permissions;
      });

      return [
        ...reduction,
        {
          label: member.user.username,
          value: JSON.stringify({
            id: member.user.id,
            type: constants.PERMISSION_TYPES.MEMBER,
            allow: this.computePermissions(memberPermissions),
          }),
        },
      ];
    }, []);
  },
  getMessageOptions(messages) {
    return messages.map((message) => ({
      label: message.id,
      value: message.id,
    }));
  },
  getLastValue(options = []) {
    const [
      lastOption,
    ] = options.slice(-1);

    const { value } = lastOption || {};

    return value;
  },
  getLastId(items = []) {
    const [
      lastItem,
    ] = items.slice(-1);

    const { id } = lastItem || {};

    return id;
  },
  emptyStrToUndefined(value) {
    return String(value).trim() === ""
      ? undefined
      : value;
  },
  parseObject(obj) {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  },
};
