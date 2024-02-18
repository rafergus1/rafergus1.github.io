require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// cluster name: dsdbc0
// StandardUser
// YgMU3eH3yLbKSgBO

async function addRecipe(newItem) {
    try {
        await client.connect();
        const result = await client.db("home_bar").collection("recipes").insertOne(newItem);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

async function getRecipe(query) {
    var result = null;
    try {
        await client.connect();
        var result = await client.db("home_bar").collection("recipes").findOne(query);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
        return result;
    }
}

async function getRecipes(maxCount) {
    var result = null;
    try {
        await client.connect();
        const cursor = await client.db("home_bar").collection("recipes").find({}).sort({name: 1}).limit(maxCount);
        result = await cursor.toArray();
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
        return result;
    }
}

async function getRecipeById(id) {
    try {
        var o_id = new ObjectId(id);  // Build the ID object from the id string
        var query = {"_id": o_id};
        var recipe =  await getRecipe(query);
        return recipe;
    }
    catch (e) {
        recipe = null;
    }
    finally {
        return recipe
    }
}

module.exports.addRecipe = addRecipe;
module.exports.getRecipe = getRecipe;
module.exports.getRecipes = getRecipes;
module.exports.getRecipeById = getRecipeById;