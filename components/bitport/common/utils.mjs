export const prepareList = ({
  items, parentName = "", filesOnly = false,
}) => {
  const itemsArray = [];
  for (const item of items) {
    const fullName = `${parentName}/${item.name}`;

    if (filesOnly) {
      itemsArray.push(
        ...item.files,
      );
    } else {
      itemsArray.push({
        fullName,
        ...item,
      });
    }

    itemsArray.push(...prepareList({
      items: item.folders,
      parentName: fullName,
      filesOnly,
    }));
  }

  return itemsArray;
};
