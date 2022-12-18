Scripts to generate data for a fine-tuned OpenAI model that generates Pipedream components.

## Prerequisites

If you're on a Mac, you'll need to install GNU `find`, which installs as `gfind`:

```
brew install findutils
```

## Usage

To generate the prompt / completion pairs required to train the model, run:

```bash
./generate_component_openai_fine_tuned_model.sh
```

To train the model:

```bash
pip install --upgrade openai
export OPENAI_API_KEY="<OpenAI API key>"
openai tools fine_tunes.prepare_data -f training_data.txt
openai api fine_tunes.create -t "training_data_prepared.jsonl" -m davinci
```

In initial tests, it took $78 to train this model. The cost of training will increase as we increase the number of training prompts.
