export default {
  type: "app",
  app: "discord",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message AA",
      description: "Enter a simple message up to 2000 characters. This is the most commonly used field. However, it's optional if you pass embed content.",
    },
    includeSentViaPipedream: {
      type: "boolean",
      optional: true,
      default: true,
      label: "Include link to workflow",
      description: "Defaults to `true`, includes a link to this workflow at the end of your Discord message.",
    },
    embeds: {
      type: "any",
      label: "Embeds",
      description: "Optionally pass an [array of embed objects](https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html). E.g., ``{{ [{\"description\":\"Use markdown including *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`\"}] }}``. To pass data from another step, enter a reference using double curly brackets (e.g., `{{steps.mydata.$return_value}}`).\nTip: Construct the `embeds` array in a Node.js code step, return it, and then pass the return value to this step.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Overrides the current username of the webhook",
      optional: true,
    },
    avatarURL: {
      type: "string",
      label: "Avatar URL",
      description: "If used, it overrides the default avatar of the webhook. Note: Consecutive posts by the same username within 10 minutes of each other will not display updated avatar.",
      optional: true,
    },
    threadID: {
      type: "string",
      label: "Thread ID",
      description: "If provided, the message will be posted to this thread",
      optional: true,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to attach. Must specify either **File URL** or **File Path**.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file, e.g. `/tmp/myFile.csv`. Must specify either **File URL** or **File Path**.",
      optional: true,
    },
  },
};
