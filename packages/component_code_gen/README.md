# AI Code Gen for Pipedream Components

Generate components using OpenAI GPT.


### Installation

```
asdf plugin-add poetry
asdf install
cd packages/component_code_gen
poetry install
```

### Setup

#### Create a `.env` file

```
cd packages/component_code_gen
cp .env.example .env
```

#### Modify the `.env` file to use your own keys:

1. Add these API Keys to your new `.env` file:

    - BROWSERLESS_API_KEY=api_key # not required
    - SUPABASE_URL=https://your-project-url.supabase.co # get this from Supabase Project Settings -> API
    - SUPABASE_API_KEY=service_role_key # get this from Supabase Project Settings -> API

2. Add OpenAI keys

    - OPENAI_API_TYPE=openai
    - OPENAI_API_KEY=your-openai-api-key
    - OPENAI_MODEL=gpt-4

3. Or use a Azure OpenAI deployment (gpt-4-32k)

    - OPENAI_API_TYPE=azure
    - OPENAI_DEPLOYMENT_NAME=deployment-name
    - OPENAI_API_VERSION=2023-05-15
    - OPENAI_API_BASE=https://resource-name.openai.azure.com
    - OPENAI_API_KEY=azure-api-key
    - OPENAI_MODEL=gpt-4-32k

5. Create a file named `instructions.md` with the same structure as the `instructions.md.example` file:

```
## Prompt

... your prompt here ...

## API docs

... copy and paste relevant parts of the api docs here ...
```


### Run

```
poetry run python main.py --type action --app slack --instructions instructions.md --verbose
```


### Add multiple API docs URLs

You can pass a list of space-separated URLs of specific links for the API docs that will be scraped and added to the prompt

```
poetry run python main.py --type action --app slack --instructions instructions.md --verbose --urls https://url1.com https://url2.com
```

### GitHub Issues

The command below will parse through GitHub issue description and generate code for the list of components.
All the code will be written to a folder named `output`.

```
poetry run python main.py --issue issue_number
```

### Tests

To run a suite of tests (e.g. webhook_sources):

```
poetry run python -m tests.test --type webhook_sources
```

This script will generate code for some selected apps/components for comparison with registry components
Compare `./tests/webhook_sources/output/*` with `./tests/webhook_sources/reference/*`
