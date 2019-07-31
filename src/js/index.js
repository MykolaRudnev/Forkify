import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {clearLoader, renderLoader, elements } from './views/base';

/** Global state of the app
 * -Search object
 * -Current recipe object
 * -Shopping list object 
 * -Liked recipes
 */

const state = {};

/** SEARCH CONTROLLER
 */



const controlSearch = async () => {
    //1) Get query from view 
    const query = searchView.getInput(); //todo
       
    if (query){
        //2) New search object and to state
        state.search = new Search(query);

        //3) Prepare UI for recipes
        searchView.clearInput();
        searchView.clearResults();

        renderLoader(elements.searchRes);
        clearLoader();
        try{
                //4) Search for recipes
                await state.search.getResults();

                // 5) render results on UI

                
                searchView.renderResults(state.search.result);
        }catch(err){
            alert('Something wrong with the search...');
            clearLoader();
        }
       
    }
}

elements.searchForm.addEventListener('submit', e => {
e.preventDefault();
controlSearch();
});


elements.searchResPaages.addEventListener('click', e=> {
    const btn =e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});



/** RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get id from URl
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id){
        //Prepere UI for changes 
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //Create new recipe object 
        state.recipe = new Recipe(id);
        
        try{
            //Get recipe data  and parse ingrediants 
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time 
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            
        }catch(err){
            console.log(err);
        }
      

    }

};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));