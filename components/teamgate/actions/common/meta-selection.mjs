const baseMeta = (propName) => ({
  name: {
    type: "string",
    label: "Name",
    description: `The ${propName}'s name.`,
    optional: true,
  },
  status: {
    type: "string",
    label: "Status",
    description: `The ${propName}'s status.`,
    options: [
      "completed",
      "incomplete",
    ],
    optional: true,
  },
  ownerId: {
    type: "integer",
    label: "Owner Id",
    description: `The user id to which the ${propName} belongs.`,
    optional: true,
  },
  ownerUsername: {
    type: "string",
    label: "Owner Username",
    description: `The username to which the ${propName} belongs.`,
    optional: true,
  },
  ownerRandom: {
    type: "string",
    label: "Owner Random",
    description: "A list of users/user groups to select the random owner. Example 1: \"ownerRandom\": [\"5\", \"6\"], Example 2: \"ownerRandom\": {\"groups\":[\"1\"]}, Example 3: \"ownerRandom\": {\"0\":\"5\",\"1\":\"6\",\"groups\":[\"1\"]}",
    optional: true,
  },
  description: {
    type: "string",
    label: "Description",
    description: `The description for the ${propName}.`,
    optional: true,
  },
  start: {
    type: "string",
    label: "Start",
    description: "Start date time string e.g. `2017-03-05T11:45:59+02:00`",
    optional: true,
  },
  end: {
    type: "string",
    label: "End",
    description: "Due date time string e.g. `2017-03-05T11:45:59+02:00`",
    optional: true,
  },
  reminders: {
    type: "object",
    label: "Reminders",
    description: `Alerts to be reminded of the ${propName}. Keys must be only \`email\` or \`sms\`. Values represent how long you will be reminded before the ${propName} and must be a \`multiple of 60\``,
    optional: true,
  },
});

const TEAMGATE_META = {
  note: {
    value: {
      type: "string",
      label: "Value",
      description: "The activity information.",
    },
  },
  task: baseMeta("task"),
  call: {
    ...baseMeta("call"),
    resources: {
      type: "string",
      label: "Resources",
      description: "The call's resources.",
      optional: true,
    },
  },
};

export default TEAMGATE_META;
