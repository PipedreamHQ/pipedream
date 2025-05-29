"""
Setup script for Pipedream Python SDK.
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="pipedream-sdk",
    version="1.0.0",
    author="Pipedream",
    author_email="support@pipedream.com",
    description="Python SDK for the Pipedream Connect API",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/PipedreamHQ/pipedream",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.8",
    install_requires=[
        # No external dependencies - using only standard library
    ],
    extras_require={
        "dev": [
            "pytest>=6.0",
            "pytest-cov>=2.0",
            "black>=21.0",
            "flake8>=3.8",
            "mypy>=0.910",
        ],
    },
    project_urls={
        "Bug Reports": "https://github.com/PipedreamHQ/pipedream/issues",
        "Documentation": "https://pipedream.com/docs/connect",
        "Source": "https://github.com/PipedreamHQ/pipedream",
    },
) 