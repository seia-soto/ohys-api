# Ohys-API

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Ohys-API is a project to redistribute the anime metadata of Ohys-Raws.

## Table of Contents

- [TODO](#TODO)
- [Scripts](#scripts)
- [Development](#development)

----

# TODO

- Ohys-Raws
  - [x] Scrap its JSON api
  - [x] Parse filename and extract basic metadata
- AniList
  - [x] Get additional anime metadata from AniList
- Assets (files)
  - [x] Create data folder if not exists
- Database
  - [x] Initialize the database on launch
  - [x] Create tables if they don't exist
  - [x] Define schemas
- Worker
  - [x] Check if the environment of process is clustered
  - [x] Determine if current process is worker process
  - [x] Use PM2 as default process manager
  - [x] Find unsynced anime metadata from database
  - [x] Find unsynced episode metadata from database
  - [x] Update anime metadata automatically
- Torrent
  - [ ] Generate direct magnet link to the torrent
  - [ ] Parse additional torrent metadata
- Schedule
  - [ ] Get the file tree data from GitHub
  - [ ] Parse the schedule file data from GitHub (success)
- API
  - [ ] Add self health checking logic
  - [x] Split the route via version instead of using domain

## @NEXT

- [ ] Use or integrate GQL interface instead of old REST interface
- [ ] Use multiple worker process to speed up scraping

## @FIX

- [ ] Fix duplicated entries in *animes* table

# Scripts

## `yarn start`

Start the application with logging only important messages.

## `yarn debug`

Start the application with logging all messages even from deps.

# Development

## Environment

Current application has been developed with Node.JS v14.5.0 and Yarnpkg v1.22.4.
