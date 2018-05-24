import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Restaurants from './Components/Restaurants';
import About from './Components/About/index';
import NotFound from './Components/NotFound/index';
import Notification from './Components/Notification/notification';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Restaurants}/>
      <Route path='/about' component={About}/>
      <Route path="/not" component={Notification}/>
      <Route path='*' component={NotFound}/>

    </Switch>
  </main>
)

export default Main