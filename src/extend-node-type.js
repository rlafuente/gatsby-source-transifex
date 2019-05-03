const { GraphQLJSON } = require(`gatsby/graphql`);

exports.extendNodeType = ({ type, store }) => {
  return {
    json: {
      type: GraphQLJSON,
      resolve: (source, fieldArgs) => {
        const contentJSON = JSON.parse(source.internal.content);
        return contentJSON;
      },
    },
  };
};
