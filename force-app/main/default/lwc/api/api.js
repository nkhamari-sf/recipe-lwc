const apiBaseUrl = "https://api.spoonacular.com";
const apiKey = "044df4613f6c40ef9007157bf50e7e46";
// const apiKey = "09edb8717e1041589c154e4625a3d5ca";

const buildQSParams = (params) => {
  let qs = "";
  const qKeys = Object.keys(params);
  for (let qKey of qKeys) {
    qs += `&${qKey}=${params[qKey]}`;
  }

  return qs;
};

const fetchData = async (url, params) => {
  return fetch(
    `${apiBaseUrl}${url}?apiKey=${apiKey}${buildQSParams(params)}`
  ).then((response) => response.json());
  // .then((data) => data.results);
};

const searchRecipes = (params) => {
  return fetchData("/recipes/complexSearch", params);
};

const getRandomRecipe = (params) => {
  return fetchData("/recipes/random", params);
};

const recipeNutrientsById = (id) => {
  return fetch(
    `${apiBaseUrl}/recipes/${id}/nutritionWidget.png?apiKey=${apiKey}`
  ).then((response) => response.blob());
};

const recipeIngdrientsById = (id) => {
  return fetch(
    `${apiBaseUrl}/recipes/${id}/ingredientWidget.png?apiKey=${apiKey}`
  ).then((response) => response.blob());
};

export {
  searchRecipes,
  recipeNutrientsById,
  recipeIngdrientsById,
  getRandomRecipe
};
