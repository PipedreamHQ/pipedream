auth = """## Authentication

Within the `run` method, `this` exposes the user's app credentials in the object `this.the_app_name_slug.$auth`. For integrations where users provide static API keys / tokens, the `$auth` object contains properties for each key / token the user enters. For OAuth integrations, `this` object exposes the OAuth access token in the `oauth_access_token` property of the `$auth` object.

The app can be a key-based app. For integrations where users provide static API keys / tokens, `this.the_app_name_slug.$auth` contains properties for each key / token the user enters. Users are asked to enter custom fields. They are each exposed as properties in the object `this.the_app_name_slug.$auth`. When you make the API request, use the format from the app docs. Different apps pass credentials in different places in the HTTP request, e.g. headers, url params, etc.

The app can also be an OAuth app. For OAuth integrations, `this` object exposes the OAuth access token in the variable `this.the_app_name_slug.$auth.oauth_access_token`. When you make the API request, make sure to use the format from the app docs, e.g. you may need to pass the OAuth access token as a Bearer token in the Authorization header."""
