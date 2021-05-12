module.exports = {
  type: 'app',
  app: 'http',
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
    },
    method: {
      type: "string",
      options: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'HEAD',
        'OPTIONS',
      ]
    },
    body: { 
      type: "string",
      description: "Enter a static value or reference prior step exports via the `steps` object (e.g., `{{steps.foo.$return_value}}`).",
      optional: true,
    },
    params: {
      type: "object",
      description: "Add individual query parameters as key-value pairs or disable structured mode to pass multiple key-value pairs as an object.",
      optional: true,
    },
    headers: {
      type: "object",
      description: "Add individual headers as key-value pairs or disable structured mode to pass multiple key-value pairs as an object.",
      optional: true,
    },
    auth: {
      type: "string",
      label: "Basic Auth",
      description: "To use HTTP basic authentication, enter a username and password separated by `|` (e.g., `myUsername|myPassword`).",
      optional: true,
    },
    responseType: {
      type: "string",
      options: [
        'json',
        'arraybuffer',
        'document',
        'text',
        'stream'
      ],
      optional: true,
    }
  },
  methods: {
    parseAuth(authString) {
      const authArray = authString.split("|")
      return {
        username: authArray[0],
        password: authArray[1]
      }
    }
  }
}