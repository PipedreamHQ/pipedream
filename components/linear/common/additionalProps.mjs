export default async function additionalProps() {
  let newProps = {};

  if (this.createAsUser === false) {
    newProps = {
      username: {
        type: "string",
        label: "Username",
        description: "The user that is performing this action.",
      },
      displayIconUrl: {
        type: "string",
        label: "Display Icon URL",
        description: "The URL of the avatar for the user performing this action.",
      },
    };
  }

  return newProps;
}
