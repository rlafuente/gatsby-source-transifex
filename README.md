# gatsby-source-transifex

## Install

`npm install --save gatsby-source-transifex`

## How to use

First, you need a way to pass environment variables to the build process, so secrets and other secured data aren't committed to source control. We recommend using [`dotenv`][dotenv] which will then expose environment variables. [Read more about dotenv and using environment variables here][envvars]. Then we can _use_ these environment variables and configure our plugin.

Here's an example `.env.production` file for dotenv:

```
TRANSIFEX_USER=api
TRANSIFEX_TOKEN=1234567890
```

Remember to use the `api` username and not your Transifex handle. Also remember to create an identical `.env.development` file so that dotenv is not confused.

### Using Delivery API

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-transifex`,
      options: {
        organization: `your_organization`,
        project: `your_project`,
        source_lang_code: `en`, // default lang
        locales: [`de`,`sv`], // array of all translated lang
        auth: `${process.env.TRANSIFEX_USER}:${process.env.TRANSIFEX_TOKEN}`,
      },
    },
  ],
}
```

### Query for all nodes

You might query for **all** of resources:

```graphql
{
  allTransifexTranslationField {
    nodes {
      id
    }
  }
  allTransifexResourceField {
    nodes {
      id
    }
  }
}
```

### Translation as JSON

```graphql
{
  transifexTranslationField(id: {eq: "transifex-{insert-your-resource-id}-{insert-locale}"}) {
    id
    json
  }
}

```

### Resource as JSON

```graphql
{
  transifexResourceField(id: {eq: "transifex-{insert-your-resource-id}"}) {
    id
    json
  }
}

```

### All Translations from locale

```graphql
{
  allTransifexTranslationField(filter: { node_locale: { eq: "de" } }) {
    nodes {
      id
    }
  }
}

```
