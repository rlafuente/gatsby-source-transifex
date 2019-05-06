const crypto = require(`crypto`);
const fetchData = require('./fetch');

exports.setFieldsOnGraphQLNodeType = require(`./extend-node-type`).extendNodeType;

exports.sourceNodes = async ({ actions }, options) => {
  const { createNode } = actions;
  const { locales, source_lang_code } = options;

  // Fetch all resources in project
  const resources = await fetchData('resources', options);
  const translations = {};
  let translationsLocales = [];

  await Promise.all(
    resources.map(async resource => {
      options.resource = resource.slug;
      const uid = resource.name;
      // Fetch the default values for this resource
      const defaultContent = await fetchData('content', options);
      // Fetch all translation for this resource
      translations[source_lang_code] = defaultContent;
      if (locales) {
        await Promise.all(
          locales.map(async locale => {
            options.lang_code = locale;
            const translation = await fetchData('translations', options);
            translations[locale] = translation;
          })
        );
      }
      createNode({
        // Required fields.
        id: `transifex-${uid}`,
        parent: null, // or null if it's a source node without a parent
        children: [],
        internal: {
          type: `TransifexResourceField`,
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify(resource))
            .digest(`hex`),
          content: JSON.stringify(resource),
        },
      });
      translationsLocales = Object.keys(translations);
      await Promise.all(
        translationsLocales.map(locale => {
          const contentJSON = JSON.parse(translations[locale].content);
          const nodeContent = { ...contentJSON, node_locale: locale };
          createNode({
            // Required fields.
            id: `transifex-${uid}-${locale}`,
            parent: null, // or null if it's a source node without a parent
            children: [],
            internal: {
              type: `TransifexTranslationField`,
              contentDigest: crypto
                .createHash(`md5`)
                .update(JSON.stringify(nodeContent))
                .digest(`hex`),
              mediaType: translations[locale].mimetype,
              content: translations[locale].content,
            },
            node_locale: locale,
          });
        })
      );
      return;
    })
  );

  console.log(`\n - Updated files `, resources.length);
  console.log(` - Updated translations `, translationsLocales.length);
  console.timeEnd(`Fetch Transifex data`);

  // We're done, return.
  return;
};
