# Ohys-API

The backend server for [Ohys-FE](https://ohys.seia.io).

## Table of Contents

- [Installation](#installation)
- [Scripts (commands)](#scripts)

----

# Installation

This project was initialized and developed with Yarn package manager and Node v13. Please, make sure your environment use Node v8 at least. I won't do any kind of support if you use Node v7 or lower. If you used Node v7 or lower, the application could get fatal error.

## Requirements

1. Yarn package manager
2. PM2 (optional, but highly recommanded for production)
3. Nginx (optional, but highly recommanded for production)

## Step by step

1. Get the latest branch or release(you can do it with tag).

```sh
git clone <repository url>
```

2. Install dependencies via package manager.

- NPM

```sh
npm i
```

- Yarn

```sh
yarn
```

# Scripts

Scripts are specified in [package.json file](/package.json).

- start

Update the database and start server.

```sh
yarn start
```

- debug

Update the database and start server with full logs.

```sh
yarn debug
```

- silent

Update the database and start server without any logs.

```sh
yarn silent
```

- makecopy

Download and insert all current file info into database.

```sh
yarn makecopy
```

- makecopy-debug

Download and insert all current file info into database with full logs.

```sh
yarn makecopy-debug
```

- resetsql **(linux only)**

Recreate the SQLite database file with `rm` and `touch` command.

The default path of SQLite database file is `./resources/main.sqlite3`. If you want to use this command, you should create one by using `touch ./resources/main.sqlite3`.

```sh
yarn resetsql
```
