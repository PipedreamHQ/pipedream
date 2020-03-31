## Usage

Install dependencies:

```bash
npm i
```

Then supply your `PIPEDREAM_API_KEY` as an environment variable. This code assumes you have a `.env` file with that variable set, and are using a tool like [direnv](https://direnv.net/) to automatically load that variable into the environment.

Once done, run the code:

```bash
node deploy-cron-job.js
```
