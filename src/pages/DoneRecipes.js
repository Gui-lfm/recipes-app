import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import Footer from '../components/Footer';
import '../styles/DoneRecipes.css';

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const storedDoneRecipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    setDoneRecipes(storedDoneRecipes);
  }, []);

  useEffect(() => {
    setRecipes(doneRecipes);
  }, [doneRecipes]);

  const filterTypes = {
    all: () => setRecipes(doneRecipes),
    meal: () => setRecipes(doneRecipes
      .filter((targetRecipe) => targetRecipe.type === 'meal')),
    drink: () => setRecipes(doneRecipes
      .filter((targetRecipe) => targetRecipe.type === 'drink')),
  };

  const handleFilterTypes = ({ target }) => {
    const clickedTarget = target.name;
    setSelectedCategory(clickedTarget);
    filterTypes[clickedTarget]();
  };

  const generalHandler = () => {
    setSelectedCategory('all');
    setRecipes(doneRecipes);
  };

  return (
    <div>
      <Header
        title="Done Recipes"
      />
      <main className="favorite-recipes">
        <div className="categories">
          <button
            className={ `
              btn-category ${selectedCategory === 'all' ? 'selected' : ''}
            `.trim() }
            data-testid="filter-by-all-btn"
            name="all"
            type="button"
            onClick={ generalHandler }
          >
            All
          </button>

          <button
            className={ `
              btn-category ${selectedCategory === 'meal' ? 'selected' : ''}
            `.trim() }
            data-testid="filter-by-meal-btn"
            name="meal"
            type="button"
            onClick={ (e) => handleFilterTypes(e) }
          >
            Meals
          </button>

          <button
            className={ `
              btn-category ${selectedCategory === 'drink' ? 'selected' : ''}
            `.trim() }
            data-testid="filter-by-drink-btn"
            name="drink"
            type="button"
            onClick={ (e) => handleFilterTypes(e) }
          >
            Drinks
          </button>
        </div>

        {recipes.length === 0 && (
          <div className="message">
            <h2>
              No recipes found
            </h2>
          </div>
        )}

        <section className="done-recipes">
          { recipes.map((recipe, index) => (
            <div
              className="done-recipe-card"
              key={ index }
            >
              <Link
                className="recipe-image"
                to={ `${recipe.type}s/${recipe.id}` }
              >
                <img
                  alt={ recipe.name }
                  data-testid={ `${index}-horizontal-image` }
                  src={ recipe.image }
                />
              </Link>

              {/* nome da receita */}
              <h4
                className="recipe-name"
                data-testid={ `${index}-horizontal-name` }
              >
                { recipe.name }
              </h4>

              {recipe.type === 'meal' ? (
                <>
                  <span
                    className="recipe-category"
                    data-testid={ `${index}-horizontal-top-text` }
                  >
                    {`${recipe.nationality} - ${recipe.category}`}
                  </span>
                  <span
                    className="recipe-tag-0"
                    data-testid={ `${index}-${recipe.tags[0]}-horizontal-tag` }
                  >
                    { recipe.tags[0] }
                  </span>
                  <span
                    className="recipe-tag-1"
                    data-testid={ `${index}-${recipe.tags[1]}-horizontal-tag` }
                  >
                    { recipe.tags[1] }
                  </span>
                </>
              ) : (
                <span
                  className="recipe-category"
                  data-testid={ `${index}-horizontal-top-text` }
                >
                  {recipe.alcoholicOrNot}
                </span>
              )}

              {/* data de conclusão da receita */}
              <span
                className="recipe-done-date"
                data-testid={ `${index}-horizontal-done-date` }
              >
                Done in:
                {' '}
                { formatDate(recipe.doneDate) }
              </span>

              <div className="buttons-share-and-favorite">
                <button
                  type="button"
                  onClick={ () => {
                    clipboardCopy(`http://localhost:3000/${recipe.type}s/${recipe.id}`);
                    toast.success('Link copied!');
                  } }
                >
                  <img
                    src={ shareIcon }
                    alt="Share Icon"
                    data-testid={ `${index}-horizontal-share-btn` }
                  />
                </button>
              </div>
            </div>
          )) }
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default DoneRecipes;
