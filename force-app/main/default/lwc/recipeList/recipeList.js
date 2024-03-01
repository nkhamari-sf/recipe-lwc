import { LightningElement, wire, track } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import Id from "@salesforce/user/Id";
import NAME_FIELD from "@salesforce/schema/User.Name";
import getFavRecipes from "@salesforce/apex/RecipeService.getFavRecipes";

import api from "c/api";

const fields = [NAME_FIELD];

export default class RecipeList extends LightningElement {
  userId = Id;
  searchText;
  @track recipesList;
  @track favRecipes;
  isLoading = false;
  infoMessage = "";
  loadMoreInfoMessage = "";
  error;
  currentPage = 0;
  totalResults;
  disableLoadMore;
  showLoadMore;

  @wire(getRecord, { recordId: "$userId", fields }) user;
  get salutation() {
    return `Hello ${getFieldValue(this.user.data, NAME_FIELD)}`;
  }

  async fetchRecipes() {
    let data;
    try {
      data = await api.searchRecipes({
        query: this.searchText || "",
        number: 10,
        offset: 10 * this.currentPage,
        addRecipeNutrition: true,
        sort: "popularity"
      });
    } catch (err) {
      this.error = err.message;
    }
    return data;
  }

  async fetchFavRecipes() {
    const data = await getFavRecipes();
    this.favRecipes = data.map((r) => ({
      id: r.id__c,
      title: r.Name,
      healthScore: r.health__c,
      image: r.image__c,
      usefulNutrients: r.usefulNutrients__c
        ? JSON.parse(r.usefulNutrients__c)
        : "NA",
      summary: r.summary__c,
      readyInMinutes: r.readyInMinutes__c,
      dishTypes: r.dishTypes__c ? JSON.parse(r.dishTypes__c) : "NA",
      diets: r.diets__c ? JSON.parse(r.diets__c) : "NA",
      cuisines: r.cuisines__c ? JSON.parse(r.cuisines__c) : "NA",
      vegetarian: r.vegeterian__c,
      vegan: r.vegan__c,
      glutenFree: r.glutenFree__c,
      dairyFree: r.dairyFree__c,
      veryHealthy: r.veryHealthy__c
    }));
  }

  mapFavouritesToRecipes() {
    this.recipesList = this.recipesList.map((r) => {
      const isFavourite =
        this.favRecipes.findIndex((fr) => parseInt(fr.id, 10) === r.id) > -1;
      return {
        ...r,
        isFavourite: isFavourite
      };
    });
  }

  // HTML Handlers
  handlePressEnter(e) {
    const isEnterKey = e.keyCode === 13;
    if (isEnterKey) {
      this.handleSearchRecipes(e);
    }
  }
  handleUpdateSearchText(e) {
    this.searchText = e.target.value;
  }

  async handleSearchRecipes(e) {
    this.showLoadMore = true;
    this.error = null;
    this.isLoading = true;
    this.currentPage = 0;
    const data = await this.fetchRecipes();
    if (data && data.results && data.results.length > 0) {
      this.recipesList = data.results;
      this.infoMessage = `Search results (${this.recipesList.length}/${data.totalResults})`;
      if (e) {
        this.mapFavouritesToRecipes();
      }
      if (this.recipesList.length >= data.totalResults) {
        this.showLoadMore = false;
      }
    } else {
      this.error = "No data found.";
    }
    this.isLoading = false;
  }

  handleToggleFavourite(event) {
    const foundRecipe = this.recipesList.find((r) => r.id === event.detail);
    foundRecipe.isFavourite = !foundRecipe.isFavourite;
  }

  async handleShowFavourites() {
    this.showLoadMore = false;
    await this.fetchFavRecipes();
    this.recipesList = this.favRecipes.map((fr) => ({
      ...fr,
      isFavourite: true
    }));
    this.infoMessage = "Showing Favourites.";
    if (!this.favRecipes || (this.favRecipes && this.favRecipes.length <= 0)) {
      this.error = "No favourites.";
    }
  }

  async handleLoadMoreRecipes() {
    this.disableLoadMore = true;
    this.currentPage += 1;
    const data = await this.fetchRecipes();
    if (data && data.results && data.results.length > 0) {
      this.recipesList.push(...data.results);
      this.infoMessage = `Search results (${this.recipesList.length}/${data.totalResults})`;
      this.mapFavouritesToRecipes();
      if (this.recipesList.length >= data.totalResults) {
        this.showLoadMore = false;
      }
    } else {
      this.showLoadMore = false;
      this.loadMoreInfoMessage = "No more results.";
    }
    this.disableLoadMore = false;
  }

  // Onload
  async connectedCallback() {
    this.handleShowFavourites();
  }
}
