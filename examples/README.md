# Salesforce Actions Demo (examples)

This folder contains a small, framework-free HTML page that demonstrates four Salesforce REST API actions aligned with the issue request:

- Get record by Id
- Update record by Id
- Upsert record by External Id
- List custom fields for an object (Describe)

File: `salesforce-ui.html`

## Reference docs (Salesforce REST API)
- Get: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_retrieve_get
- Update: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/using_resources_working_with_records.htm
- Upsert: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_upsert.htm
- Describe: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_describe.htm

## How it works (high level)
The page calls the project's internal backend endpoints (under `/api/sf/...`) instead of calling Salesforce directly. This avoids CORS issues and keeps OAuth tokens on the server.

Endpoints expected by the UI:
- `GET    /api/sf/{object}/{id}` → retrieve a record by Id
- `PATCH  /api/sf/{object}/{id}` → update a record by Id (PATCH preferred)
- `PUT    /api/sf/{object}/external/{field}/{value}` → upsert by external Id
- `GET    /api/sf/{object}/describe` → describe metadata (fields, etc.)

Notes:
- If PATCH/PUT are not allowed by your proxy, consider `POST` with `X-HTTP-Method-Override`.
- The backend must add authentication/authorization and call Salesforce API securely.

## Using the demo
1. Ensure the backend exposes the endpoints above and is running.
2. Open `examples/salesforce-ui.html` in a browser.
3. Try the actions:
   - Get: fill Object (e.g., `Account`) and a valid record Id.
   - Update: fill Object, Record Id and a valid JSON payload (e.g., `{ "Name": "New Name" }`).
   - Upsert: fill Object, External Id Field (e.g., `External_Id__c`), External Id Value, and payload JSON.
   - Describe: fill Object (e.g., `Account`) to list custom fields (`__c`).

## Validation and error handling
- Client-side JSON payload is validated before requests.
- Responses are parsed as JSON when available; falls back to text otherwise.
- HTTP status and status text are shown in the output area.
- Network/server errors show a generic message in the UI and are logged to the console.
- Required fields are validated on the client to reduce 400/404 responses.

## Accessibility
- Labels use `for` attributes pointing to the corresponding `id`.
- Output containers use `aria-live="polite"`.

## Limitations
- This is a minimal demo UI; it does not include routing, auth, or storage.
- All credentials remain server-side; none are exposed in the browser.

## Contributing
- Keep the demo self-contained and framework-free.
- If you change endpoints, update both the UI code (`API` constants) and this README.
- Prefer small, focused improvements (validation, accessibility, error clarity).
