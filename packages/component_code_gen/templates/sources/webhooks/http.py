http = """<HTTPProp>

You'll need to add another prop to webhook sources: `http`.

The `http` prop is a prop of type `$.interface.http` that lets you receive and respond to HTTP requests. You should always include it:

```javascript
export default {
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true, // optional: defaults to false
    }
  },
  // the rest of your source component code ...
}
```

The `http` prop has a field called `customResponse`, which is used to issue a custom response to the caller when required.

For example, when an API requires signature validation, or expects a specific HTTP response, you'll need to issue a custom response. 

If `customResponse` is set to `true`, The HTTP interface exposes a `respond` method that lets your component issue HTTP responses to the client.

The response object has three fields: `status`, `headers` and `body`. The `status` field is the HTTP status code of the response, the `headers` is a key-value object of the response and the `body` field is the body of the response. The `respond` method should return a promise that resolves when the body is read or an immediate response is issued. If the `customResponse` is set to `false`, an immediate response will be transparently issued with a status code of 200 and a body of "OK".

For example:

```javascript
async run(event) {
  const secretKey = "your-secret-key"
  const computedSignature = crypto.createHmac("sha256", secretKey).update(event.rawBody).digest("base64")
  if (computedSignature !== webhookSignature) {
    this.http.respond({ status: 401, body: "Unauthorized" })
    return
  }
}
```

Always add computing signature validation when the app supports it, and use the built-in `crypto` package to compute the signature.

</HTTPProp>"""
