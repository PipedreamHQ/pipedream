methods = """## Methods

The `methods` property contains helper methods. These methods can be called by other files.

A `_baseUrl` method is always required. It should return the base URL endpoint for the API.

A `async _makeRequest` method is always required. It contains the code that makes the API request. It takes one argument, a single object named `opts`. 

`opts` is an object that contains the parameters of the API request. When calling a component method with multiple parameters, you should pass them as a single object, using the Javascript spread syntax and destructuring when able to. 

The `opts` object may contain the following fields: `method`, `path`, `data`, `params`, and `headers`. It should be destructured with the following fields: `$ = this`, `method = "GET"`, `path = "/"`, and `headers`. 

There is no need to destructure `data` or `params`. Think about it: they will be passed to `axios` along with the other parameters.

`$` is the context passed by the Pipedream runtime. It should default to `this`. 
 
The `method` field is the HTTP method of the request. It should default to "GET". 
 
The `path` field is the path of the request. It should default to "/". 

The `data` field is the body of the request. 

The `params` field is the query parameters of the request. 

The `headers` field is the headers of the request. 

The `opts` object also contains any other fields that are passed to the `_makeRequest` method. 

The `_makeRequest` method returns a Promise that resolves to the HTTP response data. There is NO `data` property in the response that contains the data. The data from the HTTP response is returned directly in the response, not in the `data` property. Therefore do not destructure `data` from the response when calling `axios`.

The axios request uses the authentication method defined by the app. Different apps pass credentials in different places in the HTTP request, e.g. headers, url params, etc. See the Auth details section for more information.

An example `_makeRequest` method is shown below. It is a simple GET request that returns the data from the response.

```
async _makeRequest(opts = {}) {
  const { $ = this, method = "GET", path = "/", headers, ...otherOpts } = opts;
  return axios($, {
    ...otherOpts,
    method,
    url: this._baseUrl() + path,
    headers: {
      ...headers,
    },
  });
}
```

Auxiliary methods, usually for CRUD operations call `_makeRequest` with the appropriate parameters. Please add a few methods for common operations, e.g. get and list. You can also add other methods that you think are useful. Similar to the `_makeRequest` method, these auxiliary methods should have only one parameter, an object, `opts`. It should always destructure `...otherOpts`. Be sure to always add this parameter. `return` directly when calling the `_makeRequest` method. Here's an example:

```
async listObjects(opts = {}) {
  return this._makeRequest({
    path: "/objects",
    ...opts,
  });
}
```

### Pagination

For listing endpoints, verify how the pagination is done in the API docs. 

Add the pagination logic in a separate method. This method should be named `paginate`, with arguments :

- `fn`, the listing method that will be called
`...opts`, the parameters of the HTTP request. 

The method must define an empty array and call the listing method with the parameters. It should check the response and verify if there is more data. 

If we find more data, the method should call itself with the listing method and the parameters for fetching the next set of data. 

If we don't find more data, you should return the array of results."""
