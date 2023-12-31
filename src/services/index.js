import { fullfillRecipesIngredientsDoneProperty } from '../helpers/recipeHelpers';

export async function fetchMealsApi() {
  try {
    const data = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .catch((error) => console.log(error));
    return data.meals;
  } catch (err) {
    // console.error(err);
  }
}

export async function fetchDrinksApi() {
  try {
    const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .catch((error) => console.log(error));
    return data.drinks;
  } catch (err) {
    // console.error(err);
  }
}

export const fetchRecipeDetails = async (recipeId, route) => {
  // recipeId --> id da receita
  // route --> de qual página a chamada à função foi feita (página /meals ou /drinks)
  let endpoint = '';
  if (route.includes('/meals')) {
    endpoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;
  } else {
    endpoint = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${recipeId}`;
  }
  try {
    // fazer requisição à api
    const response = await fetch(endpoint);
    const data = await response.json();
    // quando nenhum item é encontrado na busca a api retorna null
    // a lógica abaixo é para, ao invés de retornar null, retornar um array vazio
    const dataKeys = Object.keys(data);
    if (data[dataKeys[0]] === null) {
      data[dataKeys[0]] = [];
    }
    // criar propriedade ingredients
    const recipe = data[dataKeys[0]][0];
    const recipeKeys = Object.keys(recipe);
    // array com os ingredientes da receita
    const recipeIngredients = [];
    recipeKeys.forEach((key) => {
      if (key.includes('strIngredient')) {
        const ingredientIndex = key.split('strIngredient')[1];
        const ingredientMeasureKey = `strMeasure${ingredientIndex}`;
        if (recipe[key]) {
          recipeIngredients.push({
            name: recipe[key],
            measure: recipe[ingredientMeasureKey],
          });
        }
      }
    });
    recipe.ingredients = fullfillRecipesIngredientsDoneProperty(
      recipeId,
      recipeIngredients,
    );
    // extrair apenas o id do vídeo no youtube
    const videoId = recipe.strYoutube?.split('https://www.youtube.com/watch?v=')[1];
    recipe.strYoutube = videoId;
    // retornar receita
    return recipe;
  } catch (err) {
    console.error(err);
  }
};

export const fetchRecomendations = async (route) => {
  let endpoint = '';
  if (route.includes('/meals')) {
    endpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
  } else {
    endpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  }
  try {
    const response = await fetch(endpoint);
    const data = response.json();
    // console.log(data.meals);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export async function fetchMealsCategories() {
  try {
    const data = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.meals;
  } catch (err) {
    // console.error(err);
  }
}

export async function fetchDrinksCategories() {
  try {
    const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.drinks;
  } catch (err) {
    // console.error(err);
  }
}
export async function fetchMealsByCategory(category) {
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.meals;
  } catch (err) {
    // console.error(err);
  }
}

export async function fetchDrinksByCategory(category) {
  try {
    const data = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return data.drinks;
  } catch (err) {
    // console.error(err);
  }
}
