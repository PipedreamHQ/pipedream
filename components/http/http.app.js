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
      description: "Enter a string or add an expression in curly brackets `{{...}}`. To reference data from an earlier step, enter it in curly brackets (e.g., `{{steps.foo.$return_value}}`).",
      optional: true,
    },
    params: {
      type: "object",
      description: "Add query parameters as key-value pairs. Disable structured mode to pass an object or reference to prior step exports in `{{...}}`.",
      optional: true,
    },
    headers: {
      type: "object",
      description: "Add headers as key-value pairs.  Disable structured mode to pass an object or reference to prior step exports in `{{...}}`.",
      optional: true,
    },
    auth: {
      type: "string",
      label: "Basic Auth",
      description: "To use HTTP basic authentication, add a username and password separated by `|` (e.g., `yourUsername|yourPassword123`).",
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