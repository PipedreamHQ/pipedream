remove packages 
igkore cuazom path

#### Output Dir

The default `output_dir` is where Pipedream components live in the repo: `pipedream/components`. The generated components
will override existing ones in their respective paths. To output someplace else, use the `--output_dir="./custom_output_path"`
flag.

#### Local Testing

You may test with a local file, e.g. `instructions.md`, without having to use GitHub:

```
poetry run python main.py --instructions instructions.md
```
