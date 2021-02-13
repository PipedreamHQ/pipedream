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
        'HEAD',
        'OPTIONS'
      ]
    },
    body: { 
      type: "string",
      description: "Enter a string or add an expression in curly brackets `{{...}}`. To reference data from an earlier step, enter it in curly brackets (e.g., `{{steps.foo.$return_value}}`).",
      optional: true,
    },
    params: {
      type: "object",
      description: "Add query parameters as key-value pairs",
      optional: true,
    },
    headers: {
      type: "object",
      description: "Add headers as key-value pairs",
      optional: true,
    },
    auth: {
      type: "object",
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
  }
}