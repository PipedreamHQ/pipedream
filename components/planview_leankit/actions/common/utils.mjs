export const prepareData = (data) => {
  const returnArray = [];
  Object.entries(data).map(([
    label,
    value,
  ]) => {
    if (label != "$emit" && label != "planningSeriesId") {
      const optionFunc = options[label];
      if (!optionFunc) {
        return baseOption({
          returnArray,
          label,
          value,
        });
      }
      return optionFunc({
        returnArray,
        label,
        value,
      });
    }
  });
  return returnArray;
};

const baseOption = ({
  op = "replace", label, value, returnArray,
}) => {
  returnArray.push({
    "op": op,
    "path": `/${label}`,
    "value": value,
  });
};
const arrayOption = ({
  returnArray, label, value,
}) => {
  for (const [
    i,
    v,
  ] of value.entries()) {
    returnArray.push( {
      "op": "add",
      "path": `/${label}/${i}`,
      "value": v,
    });
  }
};

const options = {
  assignedUserIds: (opts) => {
    return arrayOption(opts);
  },
  blockReason: ({
    returnArray, ...opts
  }) => {
    returnArray.push(baseOption({
      op: "add",
      ...opts,
    }));
  },
  customFields: ({
    returnArray, value,
  }) => {
    return Object.entries(value).map((key2, i) => {
      returnArray.push({
        "op": "add",
        "path": `/customFields/${i}`,
        "value": {
          field: key2[0],
          value: key2[1],
        },
      });
    });
  },
  planningIncrementIds: (opts) => {
    return arrayOption(opts);
  },
  tags: (opts) => {
    return arrayOption(opts);
  },
};

export const prepareDuplicateCardData = ({
  type,
  assignedUsers,
  description,
  size,
  lane,
  parentCards,
  customId,
  externalLink,
  plannedStart,
  plannedFinish,
  planningIncrements,
  priority,
  tags,
}) => {
  return {
    assignedUserIds: assignedUsers && assignedUsers.map((user) => user.id),
    cardId: "newCard",
    typeId: type && type.id,
    customId: customId && customId.value,
    description,
    externalLink,
    laneId: lane && lane.id,
    connections: parentCards && {
      parents: parentCards.map((card) => card.cardId),
    },
    plannedStart,
    plannedFinish,
    planningIncrementIds: planningIncrements.map((planning) => planning.id),
    priority,
    size,
    tags,
    laneType: lane && lane.laneType,
  };
};

export const customFieldOptions = [
  "dropdown",
  "multi-select",
];
