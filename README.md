# gatsby-source-transifex

## Install

`npm install --save gatsby-source-transifex`

## How to use

First, you need a way to pass environment variables to the build process, so secrets and other secured data aren't committed to source control. We recommend using [`dotenv`][dotenv] which will then expose environment variables. [Read more about dotenv and using environment variables here][envvars]. Then we can _use_ these environment variables and configure our plugin.

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
        lang_code: `en`,
        auth: `${process.env.TRANSIFEX_USER}:${process.env.TRANSIFEX_TOKEN}`,
      },
    },
  ],
}
```