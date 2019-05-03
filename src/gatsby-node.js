const crypto = require(`crypto`);
const fetchData = require('./fetch');

exports.setFieldsOnGraphQLNodeType = require(`./extend-node-type`).extendNodeType;

exports.sourceNodes = async ({ actions }, options) => {
  const { createNode } = actions;

  // Fetch all resources in project
  const resources = await fetchData('resources', options);

  await Promise.all(
    resources.map(async resource => {
      options.resource = resource.slug;
      const uid = resource.name;
      // Fetch all translation to this resource
      const translation = await fetchData('translations', options);
      createNode({
        // Required fields.
        id: `transifex-${uid}`,
        parent: null, // or null if it's a source node without a parent
        children: [],
        internal: {
          type: `TransifexTranslationField`,
          contentDigest: crypto
            .createHash(`md5`)
            .update(translation.content)
            .digest(`hex`),
          mediaType: translation.mimetype,
          content: translation.content,
        },
      });
      return;
    })
  );

  console.log(` - Updated files `, resources.length);
  console.timeEnd(`Fetch Transifex data`);

  // We're done, return.
  return;
};
