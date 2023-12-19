# AI Code Gen for Pipedream Components

Generate components using OpenAI GPT.

### Installation

1. Install [gh cli](https://github.com/cli/cli#installation)

2. Install [asdf package manager](https://asdf-vm.com/guide/getting-started.html#getting-started).

3. Run `cd packages/component_code_gen`

4. Run `asdf install`

5. Run `poetry install`

### Setup

#### Create a `.env` file

`cp .env.example .env`

#### Modify the `.env` file to use your own keys:

1. Add these API Keys to your new `.env` file:

   - BROWSERLESS_API_KEY=api_key # required when parsing URL links
   - SUPABASE_URL=https://your-project-url.supabase.co # get this from Supabase Project Settings -> API
   - SUPABASE_API_KEY=service_role_key # get this from Supabase Project Settings -> API

2. Add Azure OpenAI API keys (gpt-4-32k)

   - OPENAI_API_TYPE=azure
   - OPENAI_DEPLOYMENT_NAME=deployment-name
   - OPENAI_EMBEDDINGS_DEPLOYMENT_NAME=embeddings-deployment-name
   - OPENAI_API_VERSION=2023-05-15
   - OPENAI_API_BASE=https://resource-name.openai.azure.com
   - OPENAI_API_KEY=azure-api-key
   - OPENAI_MODEL=gpt-4-32k

### Running

#### GitHub Issues

The command below will parse through GitHub issue description and generate code for the list of components.

```
poetry run python main.py --issue issue_number
```

#### Draft PRs

The default behaviour is to automatically create a branch and submit a Draft PR. The command above is equivalent to:

```
poetry run python main.py --issue issue_number --skip-pr=False
```

If you don't want to submit a Draft PR and keep the changes local, pass in `--skip-pr` (which sets it to `True`).

#### Output Dir

The default `output_dir` is where Pipedream components live in the repo: `pipedream/components`. The generated components
will override existing ones in their respective paths. To output someplace else, use the `--output_dir="./custom_output_path"`
flag.

#### Local Testing

You may test with a local file, e.g. `instructions.md`, without having to use GitHub:

```
poetry run python main.py --instructions instructions.md
```
