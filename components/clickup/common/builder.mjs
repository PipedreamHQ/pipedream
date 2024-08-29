const buildListProps = ({
  listPropsOptional: optional = false,
  tailProps,
} = {}) => function additionalProps() {
  if (!this.listWithFolder) {
    return {
      listId: {
        type: "string",
        label: "List ID",
        description: "The id of a list",
        optional,
        options: async () => {
          const {
            app,
            clickup,
            spaceId,
          } = this;
          const lists = await (clickup || app).getFolderlessLists({
            spaceId,
          });
          return lists.map(({
            name: label, id: value,
          }) => ({
            label,
            value,
          }));
        },
      },
      ...tailProps,
    };
  }

  return {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The id of a folder",
      optional,
      options: async () => {
        const {
          app,
          clickup,
          spaceId,
        } = this;
        const folders = await (clickup || app).getFolders({
          spaceId,
        });
        return folders.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The id of a list",
      optional,
      options: async () => {
        const {
          app,
          clickup,
          folderId,
        } = this;
        const lists = await (clickup || app).getLists({
          folderId,
        });
        return lists.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    ...tailProps,
  };
};

export default {
  buildListProps,
};
