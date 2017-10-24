const express = require('express');
const app = express();
const apiRouter = express.Router();

const Restaurant = require('../model/Restaurants');

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
            res.json({ message: 'restaurant has been deleted' })
        })
    });

module.exports = apiRouter;