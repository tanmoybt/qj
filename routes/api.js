const express = require('express');
const app = express();
const apiRouter = express.Router();

const Restaurant = require('../model/Restaurants');
const Food = require('../model/Foods');

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
        restaurant.cuisine= req.body.cuisine;
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
            
                })
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
        food.food_type = req.body.food_type;
        food.food_size= req.body.food_size;
        food.price= req.body.price;
        food.cuisine= req.body.cuisine;
        food.rating= req.body.rating;

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



module.exports = apiRouter;