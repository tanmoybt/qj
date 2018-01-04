const express = require('express');
const app = express();
const apiRouter = express.Router();

const Restaurant = require('../model/Restaurants');
const Food = require('../model/Foods');

const Cuisine = require('../model/Cuisines');
const FoodTag = require('../model/Food_Tags');
const IngredientTag = require('../model/Ingredients_Tags');
const Regions = require('../model/Regions');

apiRouter.route('/restaurants')
    .get(function(req, res) {
        Restaurant.find(function(err, restaurants) {
            if (err)
                res.send(err);
            res.json(restaurants);
        });
    })
    .post(function(req, res) {
        const restaurant = new Restaurant();
        restaurant.name = req.body.name;
        restaurant.location = req.body.location;
        restaurant.region= req.body.region;
        restaurant.zip_code= req.body.zip;
        restaurant.cuisine= req.body.cuisine.split(",");
        restaurant.rating= req.body.rating;

        console.log(restaurant);

        restaurant.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'restaurant successfully added!' });
        });
    });

apiRouter.route('/restaurants/region/:region_name')
    .get(function(req, res) {
        Restaurant.find({region: req.params.region_name}, function(err, restaurants) {
            if (err)
                res.send(err);
            res.json(restaurants);
        });
    });

apiRouter.route('/restaurants/zip/:zip')
    .get(function(req, res) {
        Restaurant.find({zip_code: req.params.zip}, function(err, restaurants) {
            if (err)
                res.send(err);
            res.json(restaurants);
        });
    });

apiRouter.route('/restaurants/cuisine/:cuisine')
    .get(function(req, res) {
        Restaurant.find({cuisine: req.params.cuisine}, function(err, restaurants) {
            if (err)
                res.send(err);
            res.json(restaurants);
        });
    });



apiRouter.route('/restaurants/:restaurant_id')

    .put(function(req, res) {
        Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {
            if (err) res.send(err);

            (req.body.author) ? restaurant.author = req.body.author : null;
            (req.body.text) ? restaurant.text = req.body.text : null;

            restaurant.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Restaurant has been updated' });
            });
        });
    })

    .delete(function(req, res) {
        Restaurant.remove({ _id: req.params.restaurant_id }, function(err, restaurant) {
            if (err)
                res.send(err);
            else {
                Food.remove({ res_id: req.params.restaurant_id }, function(err, restaurant) {
                    if (err)
                    res.send(err);
                    else {
                
                        res.json({ message: 'foods has been deleted' })
                    }
            
                });
                res.json({ message: 'restaurant has been deleted' })
            }
            
        })
    });



apiRouter.route('/foods/:restaurant_id')
    .get(function(req, res) {
        Food.find({ res_id: req.params.restaurant_id }, function(err, foods) {
            if (err)
                res.send(err);
            res.json(foods);
        });
    });

apiRouter.route('/foods')
    .post(function(req, res) {
        const food = new Food();
        food.res_id = req.body.res_id;
        food.food_name = req.body.food_name;
        food.food_tags = req.body.food_tags;
        food.ingredient_tags = req.body.ingredient_tags;
        food.food_size= req.body.food_size;
        food.cuisine= req.body.cuisine;
        food.rating= req.body.rating;
        food.image= req.body.image;

        console.log(food.res_id);

        console.log(food);

        food.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'food successfully added!' });
        });
    });


apiRouter.route('/foods/:food_id')

    .delete(function(req, res) {
        Food.remove({ _id: req.params.food_id }, function(err, food) {
            if (err)
                res.send(err);
            res.json({ message: 'food has been deleted' })
        })
    });

apiRouter.route('/cuisines')
    .get(function(req, res) {
        Cuisine.find(function(err, cuisines) {
            if (err)
                res.send(err);
            res.json(cuisines);
        });
    })
    .post(function(req, res) {
        const cuisine = new Cuisine();
        cuisine.cuisine = req.body.cuisine;

        //console.log(Cuisine);

        cuisine.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'cuisine successfully added!' });
        });
    });

apiRouter.route('/foodtags')
    .get(function(req, res) {
        FoodTag.find(function(err, foodtags) {
            if (err)
                res.send(err);
            res.json(foodtags);
        });
    })
    .post(function(req, res) {
        const food_tag = new FoodTag();
        food_tag.tag = req.body.tag;

        //console.log(food_tag);

        food_tag.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'food tag successfully added!' });
        });
    });

apiRouter.route('/regions')
    .get(function(req, res) {
        Regions.find(function(err, regions) {
            if (err)
                res.send(err);
            res.json(regions);
        });
    })
    .post(function(req, res) {
        const region = new Regions();
        region.name = req.body.name;
        region.zip_code = req.body.zip_code;
        let zips= req.body.zip_codes;
        region.sub_zip_codes = zips.split(",");
        let regions = req.body.sub_reg;
        //console.log(req.body.sub_regions);
        region.sub_regions = regions.split(",");

        //console.log(food_tag);

        region.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'region successfully added!' });
        });
    });

apiRouter.route('/ingredienttags')
    .get(function(req, res) {
        IngredientTag.find(function(err, ingredienttags) {
            if (err)
                res.send(err);
            res.json(ingredienttags);
        });
    })
    .post(function(req, res) {
        const ingredient_tag = new IngredientTag();
        ingredient_tag.tag = req.body.tag;

        //console.log(ingredient_tag);

        ingredient_tag.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'ingredient successfully added!' });
        });
    });


apiRouter.route('/gendata')
    .get(function(req, res) {
        Restaurant.find(function(err, restaurants) {
            if (err)
                res.send(err);
            else {
                Regions.find(function (err, regions) {
                    if (err)
                        res.send(err);
                    else {
                        Cuisine.find(function (err, cuisines) {
                            if (err)
                                res.send(err);
                            else {
                                FoodTag.find(function (err, foodTags) {
                                    if (err)
                                        res.send(err);
                                    else {
                                        IngredientTag.find(function (err, ingTags) {
                                            if (err)
                                                res.send(err);
                                            else {
                                                let data = {
                                                    res: restaurants,
                                                    reg: regions,
                                                    cui: cuisines,
                                                    foodTags: foodTags,
                                                    ingTags: ingTags
                                                };
                                                res.json(data);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
    });

module.exports = apiRouter;