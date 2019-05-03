const fetch = require('node-fetch');

const getProjects = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

const getResources = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

const getTranslations = async (url, options) => {
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

  const { organization, project, resource, lang_code, auth } = options;

  const authHeader = 'Basic ' + new Buffer.from(auth).toString('base64');
  const BASE_URL = 'https://www.transifex.com/api/2';
  const PROJECT_URL = `${BASE_URL}/projects/`;
  const RESOURCE_URL = `https://api.transifex.com/organizations/${organization}/projects/${project}/resources/`;
  const TRANSLATION_URL = `${BASE_URL}/project/${project}/resource/${resource}/translation/${lang_code}/`;

  const url_options = {
    method: 'GET',
    headers: {
      Authorization: authHeader,
    },
  };
  let response;
  switch (type) {
    case 'projects':
      response = await getProjects(PROJECT_URL, url_options);
      break;
    case 'resources':
      response = await getResources(RESOURCE_URL, url_options);
      break;
    case 'translations':
      response = await getTranslations(TRANSLATION_URL, url_options);
      break;
  }
  // If no case type found return
  return response;
};
