async function additionalFolderProps() {
  const props = {};
  const rootFolderId = this.folderId || this.parentId;
  if (!rootFolderId) {
    return props;
  }

  const { data: rootSubfolders } = await this.app.listFiles({
    folderId: rootFolderId,
  });

  if (!rootSubfolders.length) {
    return props;
  }

  props["folderId1"] = {
    type: "string",
    label: "Folder 2 ID",
    description: "The unique ID of the subfolder. Select a folder to view its subfolders.",
    options: rootSubfolders.map(({
      id, attributes: { name },
    }) => ({
      value: id,
      label: name,
    })),
    optional: true,
    reloadProps: true,
  };

  const num = findMaxFolderId(this);

  if (num < 1) {
    return props;
  }

  for (let i = 2; i <= num + 1; i++) {
    const { data: subfolders } = await this.app.listFiles({
      folderId: this[`folderId${i - 1}`],
    });

    if (!subfolders.length) {
      return props;
    }

    props[`folderId${i}`] = {
      type: "string",
      label: `Folder ${i + 1} ID`,
      description: `The unique ID of the subfolder ${i + 1}. Select a folder to view its subfolders.`,
      options: subfolders.map(({
        id, attributes: { name },
      }) => ({
        value: id,
        label: name,
      })),
      optional: true,
      reloadProps: true,
    };
  }

  return props;
}

function findMaxFolderId(obj) {
  let maxNum = -Infinity;

  Object.keys(obj).forEach((key) => {
    const match = key.match(/^(folderId(\d*)|parentId)$/);
    if (match) {
      const num = match[2] === undefined || match[2] === ""
        ? 0
        : parseInt(match[2], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  });

  return maxNum;
}

export {
  additionalFolderProps,
  findMaxFolderId,
};
