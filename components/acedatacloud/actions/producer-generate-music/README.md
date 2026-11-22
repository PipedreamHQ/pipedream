# Generate Producer Music

This is a Producer action through Ace Data Cloud. After official App registration, connect the `api_key` from your **General application** and ensure it can call this service.

Choose a current Producer model. Enter Music Idea (up to 200 characters), or enable Use Custom Lyrics and supply Lyrics. Song Title and Instrumental are available as native fields. The declared audio API is Production. Its complete request model enum drives Model options.

The action makes one asynchronous request and returns the original `task_id` with `state: submitted`. Save that same task ID and inspect its outcome in your approved Ace task history. Submission is not completed media. This action does not retry, substitute models, or provide an unverified task lookup.

Official Pipedream App registration and component review are still pending. The implementation and schema checks do not claim a connected Pipedream run or successful paid generation.
