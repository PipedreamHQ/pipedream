export default async function additionalProps() {
  const props = {
    createAsUser: {
      type: "string",
      label: "Username",
      description: "The user that is performing this action.",
    },
    displayIconUrl: {
      type: "string",
      label: "Display Icon URL",
      description:
        "The URL of the avatar for the user performing this action.",
    },
  };

  return this.useOwnUser === false
    ? props
    : {};
}
