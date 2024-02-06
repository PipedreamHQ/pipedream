http = """## http prop

There is also another prop in webhook sources: `http`. 

The `http` prop is a prop of type `$.interface.http` that lets you receive and respond to HTTP requests. You should always include it.

The `http` prop has a field called `customResponse`, which is used when a signature validation is needed to be done before responding the request. If the `customResponse` is set to `true`, the `respond` method will be called with the response object as the argument. The response object has three fields: `status`, `headers` and `body`. The `status` field is the HTTP status code of the response, the `headers` is a key-value object of the response and the `body` field is the body of the response. The `respond` method should return a promise that resolves when the body is read or an immediate response is issued. If the `customResponse` is set to `false`, an immediate response will be transparently issued with a status code of 200 and a body of "OK".

Always add computing signature validation when the app supports it, and please use the the crypto package HMAC-SHA256 method unless specified otherwise."""
