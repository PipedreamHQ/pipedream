export default {
  type: "app",
  app: "http",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL you'd like to send the HTTP request to",
    },
    method: {
      type: "string",
      label: "Method",
      description: "[The HTTP method](https://requestbin.com/blog/working-with-webhooks/#http-methods-get-and-post) (for example, `GET` or `POST`)",
      options: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "HEAD",
        "OPTIONS",
      ],
    },
    body: {
      type: "string",
      label: "HTTP Body / Payload",
      description: "[The body of the HTTP request](https://requestbin.com/blog/working-with-webhooks/#http-payload-body). Enter a static value or reference prior step exports via the `steps` object (e.g., `{{steps.foo.$return_value}}`).",
      optional: true,
    },
    params: {
      type: "object",
      label: "Query Parameters",
      description: "Add individual [query parameters](https://requestbin.com/blog/working-with-webhooks/#query-string-parameters-url) as key-value pairs or disable structured mode to pass multiple key-value pairs as an object.",
      optional: true,
    },
    headers: {
      type: "object",
      label: "HTTP Headers",
      description: "Add individual [HTTP headers](https://requestbin.com/blog/working-with-webhooks/#http-header) as key-value pairs or disable structured mode to pass multiple key-value pairs as an object.",
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
      label: "Response Type",
      description: "The type of data that the server will respond with",
      options: [
        "json",
        "arraybuffer",
        "document",
        "text",
        "stream",
      ],
      optional: true,
    },
  },
  methods: {
    parseAuth(authString) {
      const authArray = authString.split("|");
      return {
        username: authArray[0],
        password: authArray[1],
      };
    },
  },
}
;
