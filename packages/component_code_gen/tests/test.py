import argparse
import importlib
import os
import sys
sys.path.append("..") # go back to root - hack to allow importing main
from main import main


def run():
    cwd = os.listdir('./tests')
    available_tests = list(filter(lambda x: x != '__pycache__' and x != 'test.py', cwd))

    parser = argparse.ArgumentParser()
    parser.add_argument('--type', type=str, choices=available_tests, required=True)
    args = parser.parse_args()

    test_type = args.type

    output_folder = f'./tests/{test_type}/output'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    apps = importlib.import_module(f'tests.{test_type}.apps')

    for app in apps.apps:
        print(f"testing {app['app']}...")

        result = main(test_type[:-1], app['app'], app['instructions'], tries=1, verbose=True)
        with open(f'{output_folder}/{app["key"]}.mjs', 'w') as f:
            f.write(result)


if __name__ == '__main__':
    run()
