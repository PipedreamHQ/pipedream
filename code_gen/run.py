import argparse
from code_gen.generate_component_code import main
from code_gen.transform_code import transform
from dotenv import load_dotenv
load_dotenv()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--app', '-a', help='the app_name_slug', required=True)
    parser.add_argument('--no-print', dest='noprint', help='do not print output to terminal', required=False, default=False, action='store_true')
    parser.add_argument('prompt', help='the prompt to send to gpt-4, in between quotes')
    args = parser.parse_args()

    code = main(args.app, args.prompt, verbose=True)
    result = transform(code)

    if (args.noprint is False):
        print(result)

    out = 'output.mjs'
    with open(out, 'w') as f:
        f.write(result)
        print("wrote output to `{out}` file")
