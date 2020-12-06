# Ohys-API

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Ohys-API is a project to redistribute the anime metadata of Ohys-Raws.

## Table of Contents

- [TODO](#TODO)
- [Scripts](#scripts)
- [Development](#development)

----

# TODO

Refactoring the project...

## @NEXT

- [ ] Use or integrate GQL interface instead of old REST interface
- [ ] Use multiple worker process to speed up scraping

## @FIX

- [x] Fix duplicated entries in *animes* table
- [x] Fix `Error: Invalid data: Missing delimiter ":" [0x3a]` error of node-bencode module **(finding any resolutions)**
- [ ] Fix unexpected stop of torrent crawling worker

# Scripts

## `yarn start`

Start the application with logging only important messages.

## `yarn debug`

Start the application with logging all messages even from deps.

# Development

## Environment

Current application has been developed with Node.JS v14.5.0 and Yarnpkg v1.22.4.
