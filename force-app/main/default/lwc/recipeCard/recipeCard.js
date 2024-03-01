import { LightningElement, api } from "lwc";
import RecipeDetails from "c/recipeDetails";
import addFavRecipe from "@salesforce/apex/RecipeService.addFavRecipe";
import removeFavRecipe from "@salesforce/apex/RecipeService.removeFavRecipe";

export default class RecipeCard extends LightningElement {
  @api recipedata;

  get usefulNutrients() {
    if (this.recipedata) {
      if (this.recipedata.usefulNutrients) {
        return this.recipedata.usefulNutrients;
      }
      return this.recipedata.nutrition.nutrients.reduce((nutList, nutrient) => {
        if (nutrient && nutrient.name === "Calories") {
          nutList.push(`CAL: ${nutrient.amount} ${nutrient.unit}`);
        }
        if (nutrient && nutrient.name === "Fat") {
          nutList.push(`FAT: ${nutrient.amount} ${nutrient.unit}`);
        }
        if (nutrient && nutrient.name === "Protein") {
          nutList.push(`PRO: ${nutrient.amount} ${nutrient.unit}`);
        }

        return nutList;
      }, []);
    }
    return [];
  }

  openRecipeFullDetails() {
    RecipeDetails.open({
      // maps to developer-created `@api options`
      label: this.recipedata.title,
      recipedata: this.recipedata
    }).then((result) => {
      console.log(result);
    });
  }

  async handleToggleFavRecipe() {
    try {
      if (this.recipedata.isFavourite) {
        await removeFavRecipe({
          id: this.recipedata.id
        });
      } else {
        await addFavRecipe({
          id: this.recipedata.id,
          title: this.recipedata.title,
          healthScore: this.recipedata.healthScore,
          usefulNutrients: JSON.stringify(this.usefulNutrients),
          image: this.recipedata.image,
          summary: this.recipedata.summary,
          readyInMinuites: this.recipedata.readyInMinuites,
          dishTypes: JSON.stringify(this.recipedata.dishTypes),
          diets: JSON.stringify(this.recipedata.diets),
          cuisines: JSON.stringify(this.recipedata.cuisines),
          vegetarian: this.recipedata.vegetarian,
          vegan: this.recipedata.vegan,
          glutenFree: this.recipedata.glutenFree,
          dairyFree: this.recipedata.dairyFree,
          veryHealthy: this.recipedata.veryHealthy
        });
      }

      this.dispatchEvent(
        new CustomEvent("togglefav", { detail: this.recipedata.id })
      );
    } catch (e) {
      console.log(e);
    }
  }
}
