public with sharing class RecipeService {
    @AuraEnabled(Cacheable=false)
    public static void addFavRecipe(String id, String title,Integer healthScore, 
    String usefulNutrients, String image, String summary,
    Integer readyInMinutes, String dishTypes, String diets, String cuisines,
    Boolean vegetarian, Boolean vegan, Boolean glutenFree, Boolean dairyFree, Boolean veryHealthy
    ){

        Favourite_Recipe__c newFavRecipe = new Favourite_Recipe__c();
        
        newFavRecipe.id__c=id;
        newFavRecipe.Name= title;
        newFavRecipe.image__c=image;
        newFavRecipe.usefulNutrients__c=usefulNutrients;
        newFavRecipe.health__c=healthScore;
        newFavRecipe.summary__c= summary;
        newFavRecipe.readyInMinutes__c= readyInMinutes;
        newFavRecipe.dishTypes__c= dishTypes;
        newFavRecipe.diets__c= diets;
        newFavRecipe.cuisines__c= cuisines;
        newFavRecipe.vegeterian__c= vegetarian;
        newFavRecipe.vegan__c= vegan;
        newFavRecipe.glutenFree__c= glutenFree;
        newFavRecipe.dairyFree__c= dairyFree;
        newFavRecipe.veryHealthy__c= veryHealthy;

        insert newFavRecipe;
    }

    @AuraEnabled(Cacheable=false)
    public static void removeFavRecipe(String id){

        Favourite_Recipe__c[] contactsDel = [SELECT Id FROM Favourite_Recipe__c WHERE id__c=:id]; 
        delete contactsDel;
    }

    @AuraEnabled(Cacheable=false)
    public static List<Favourite_Recipe__c> getFavRecipes(){

        return [
                SELECT id__c, Name, image__c, usefulNutrients__c, health__c, 
                summary__c, readyInMinutes__c,dishTypes__c, diets__c, 
                vegeterian__c, vegan__c, glutenFree__c, dairyFree__c, veryHealthy__c
                FROM Favourite_Recipe__c
                ORDER BY Name
            ];
    }
}