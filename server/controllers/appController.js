const db = require('../models/database');
const { get } = require('../routes/routes');

function getDrinkIcon(glass, rocks, ingredients) {
    // Logic to pick the right drink icon from the glass and rocks fields in the recipe
    
    // Look through the ingredients to see if there is a cherry or a peel or maybe something else we might be interested in at some point
    var peel = "no-peel";
    var cherry = "no-cherry";
    var olive = "no-olive";
    ingredients.forEach(element => {
        if (element.units == "peel" || element.units == "twist") {
            peel = "peel";
        }
        if (element.units == "piece" && element.ingredient.toLowerCase().includes("cherry")) {
            cherry = "cherry";
        }
        if (element.units == "piece" && element.ingredient.toLowerCase().includes("olive")) {
            olive = "olive";
        }
    });
    
    // combine to a single string to use in the switch statement
    var idString = glass + "|" + rocks + "|" + peel + "|" + cherry + "|" + olive;
    switch(idString.toLowerCase()) {
        case "rocks|largerock|no-peel|no-cherry|no-olive":
        case "rocks|largerock|no-peel|no-cherry|olive":
            return "icon-tumbler_cube";
        
        case "rocks|largerock|peel|no-cherry|no-olive":
        case "rocks|largerock|peel|no-cherry|olive":
            return "icon-tumbler_cube_peel";
        
        case "rocks|largerock|peel|cherry|no-olive":
        case "rocks|largerock|peel|cherry|olive":
            return "icon-tumbler_cube_cherry_peel";

        case "rocks|largerock|no-peel|cherry|no-olive":
        case "rocks|largerock|no-peel|cherry|olive":
            return "icon-tumbler_cube_cherry";

        case "rocks|rocks|no-peel|no-cherry|no-olive":
        case "rocks|rocks|no-peel|no-cherry|olive":
        case "rocks|rocks|no-peel|cherry|no-olive":
        case "rocks|rocks|no-peel|cherry|olive":
        case "rocks|rocks|peel|no-cherry|no-olive":
        case "rocks|rocks|peel|no-cherry|olive":
        case "rocks|rocks|peel|cherry|no-olive":
        case "rocks|rocks|peel|cherry|olive":
            return "icon-tumbler_rocks";

        case "cocktail|neat|no-peel|no-cherry|no-olive":
            return "icon-cocktail";
        
        case "cocktail|neat|no-peel|no-cherry|olive":
        case "cocktail|neat|no-peel|cherry|no-olive":
        case "cocktail|neat|no-peel|cherry|olive":
            return "icon-cocktail_olive";
        
        case "cocktail|neat|peel|no-cherry|no-olive":
        case "cocktail|neat|peel|no-cherry|olive":
            return "icon-cocktail_twist";
        
        case "coupe|neat|no-peel|no-cherry|no-olive":
            return "icon-coupe";
        
        case "coupe|neat|peel|no-cherry|no-olive":
        case "coupe|neat|peel|no-cherry|olive":
            return "icon-coupe_peel";

        case "coupe|neat|peel|cherry|no-olive":
        case "coupe|neat|peel|cherry|olive":
            return "icon-coupe_cherry_peel";    
        
        case "coupe|neat|no-peel|cherry|no-olive":
        case "coupe|neat|no-peel|cherry|olive":
        case "coupe|neat|no-peel|no-cherry|olive":
            return "icon-coupe_cherry"; 

        case "highball|rocks|no-peel|no-cherry|no-olive":
        case "highball|rocks|no-peel|no-cherry|olive":
        case "highball|rocks|no-peel|cherry|no-olive":
        case "highball|rocks|no-peel|cherry|olive":
        case "highball|rocks|peel|no-cherry|no-olive":
        case "highball|rocks|peel|no-cherry|olive":
        case "highball|rocks|peel|cherry|no-olive":
        case "highball|rocks|peel|cherry|olive":
            return "icon-tumbler_rocks";

        default:
            return "icon-highball_rocks_straw"
    }
}

// HOME
exports.homepage = async(req, res) => {
    try {
        const recipes = await db.getRecipes(10);
        res.render("index", { title: 'Home Bar' , recipes});
    }
    catch (e) {
        res.status(500).send({message: e.message || "Error Occured"});
    }
} 

// RECIPES, /recipes
exports.recipes = async(req, res) => {
    try {
        // Get the recipes list from the database
        var recipes = await db.getRecipes(100);

        // Loop over the recipes and get the glassware Icon to use and add it to the object
        for (var i = 0; i < recipes.length; i++) {
            const glassIcon = getDrinkIcon(recipes[i].glassware, recipes[i].rocks, recipes[i].ingredients);
            recipes[i].glassIcon = glassIcon;
            console.log(recipes[i]);
        }

        // Send the response
        res.render("recipes", { title: 'Recipes' , recipes});
    }
    catch (e) {
        res.status(500).send({message: e.message || "Error Occured"});
    }
} 

// RECIPE DETAILS, /recipe-details
exports.recipeDetails = async(req, res) => {
    try {
        const item = await db.getRecipeById(req.query.id);
        const drinkIcon = getDrinkIcon(item.glassware, item.rocks, item.ingredients);
        res.render("recipe-details", { title: 'Recipe' , item, drinkIcon});
    }
    catch (e) {
        res.status(500).send({message: e.message || "Error Occured"});
    }
} 

// SUBMIT RECIPE, /submit-recipe
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render("submit-recipe", { title: 'Submit Recipe', infoErrorsObj, infoSubmitObj });
}

// SUBMIT RECIPE POST, /submit-recipe
exports.submitRecipeOnPost = async(req, res) => {
    try {

        // If the frmIngredients is a string, it means it was only a single item.  Otherwise, it is a list of multiple items
        if (typeof(req.body.frmIngredient) === "string") {
            var ingredients = [{ingredient: req.body.frmIngredient,
                                quantity: req.body.frmIngredientQty,
                                units: req.body.frmIngredientUnit}];
        }
        else {
            // Build ingredients list
            var ingredients = [];
            for (let i = 0; i < req.body.frmIngredient.length; i++) {
                ingredients.push({  ingredient: req.body.frmIngredient[i],
                                    quantity: req.body.frmIngredientQty[i],
                                    units: req.body.frmIngredientUnit[i]});
            }
        }

        // Build current date string
        var currentdate = new Date();
        var datetime = currentdate.getFullYear() + "-"
                        + (currentdate.getMonth()+1) + "-"
                        + currentdate.getDate() + "T"
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":"
                        + currentdate.getSeconds();


         const newRecipe = {
            name: req.body.frmName,
            ingredients: ingredients,
            instructions: req.body.frmInstructions,
            notes: req.body.frmNotes,
            glassware: req.body.frmGlassware,
            rocks: req.body.frmRocks,
            tags: req.body.frmTags,
            date_submitted: datetime,
            date_modified: datetime,
            
        };
        
        db.addRecipe(newRecipe); 

        req.flash('infoSubmit', 'Item has been added.');
        res.redirect("/submit-recipe");
    }
    catch (e) {
        console.log("ERROR ERROR ERROR");
        console.log(e);
        res.json(e);
        req.flash('infoErrors', e);
        res.redirect("/submit-recipe");
    }
    
}