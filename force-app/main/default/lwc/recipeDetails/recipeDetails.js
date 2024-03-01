import { api } from "lwc";
import LightningModal from "lightning/modal";
import { recipeNutrientsById, recipeIngdrientsById } from "c/api";

export default class RecipeDetails extends LightningModal {
  @api recipedata = {};
  nutrientWidget = "";
  ingdrientWidget = "";

  connectedCallback() {
    recipeNutrientsById(this.recipedata.id).then((data) => {
      this.nutrientWidget = URL.createObjectURL(data);
    });

    recipeIngdrientsById(this.recipedata.id).then((data) => {
      this.ingdrientWidget = URL.createObjectURL(data);
    });
  }
}