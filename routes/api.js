// itemRoutes.js
const express = require('express');
const app = express();
const apiRouter = express.Router();

// Require Item model in our routes module
const Restaurant = require('../model/Restaurants');

// Defined store route
apiRouter.route('/restaurants')
//retrieve all comments from the database
    .get(function(req, res) {
        //looks at our Comment Schema
        Restaurant.find(function(err, restaurants) {
            if (err)
                res.send(err);
            //responds with a json object of our database comments.
            res.json(restaurants);
        });
    })
    //post new comment to the database
    .post(function(req, res) {
        const restaurant = new Restaurant();
        //body parser lets us use the req.body
        restaurant.name = req.body.name;
        restaurant.place = req.body.place;
        restaurant.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'restaurant successfully added!' });
        });
    });

module.exports = apiRouter;