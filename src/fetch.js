const fetch = require('node-fetch');

const fetchTransifex = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

module.exports = async (type, options) => {
  console.time(`Fetch Transifex data`);

  const { organization, project, resource, auth, lang_code } = options;

  const authHeader = 'Basic ' + new Buffer.from(auth).toString('base64');

  const BASE_URL = 'https://www.transifex.com/api/2';
  const PROJECT_URL = `${BASE_URL}/projects/`;
  const RESOURCE_URL = `https://api.transifex.com/organizations/${organization}/projects/${project}/resources/`;
  const TRANSLATION_URL = `${BASE_URL}/project/${project}/resource/${resource}/translation/${lang_code}/`;
  const CONTENT_URL = `${BASE_URL}/project/${project}/resource/${resource}/content/`;

  const url_options = {
    method: 'GET',
    headers: {
      Authorization: authHeader,
    },
  };
  let url;
  switch (type) {
    case 'projects':
      url = PROJECT_URL;
      break;
    case 'resources':
      url = RESOURCE_URL;
      break;
    case 'translations':
      url = TRANSLATION_URL;
      break;
    case 'content':
      url = CONTENT_URL;
      break;
  }
  if (!url) return;
  let response = await fetchTransifex(url, url_options);
  // If no case type found return
  return response;
};
