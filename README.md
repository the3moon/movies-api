# Movies-api

## Description

Api used to store movies in a file and querry from it based on genres and duration

## Instalation

```bash
yarn install
```

## Build

```bash
yarn build
```

## Development

```bash
yarn start
```

## Test

```bash
yarn test
```

## Endpoints

### Store Movies

```
POST api/movies
```

Body params:

- a list of genres (only predefined ones from db file) (required, array of predefined strings)
- title (required, string, max 255 characters)
- year (required, number)
- runtime (required, number)
- director (required, string, max 255 characters)
- actors (optional, string)
- plot (optional, string)
- posterUrl (optional, string)

---

### Query movies

```
GET api/movies
```

This is used to query movies from file

Query Params:

- duration (optional, number)
- a list of genres (only predefined ones from db file) (optional, array of predefined strings)

## Info

`db.json` file is located in _data_ folder
