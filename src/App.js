import React, { Component } from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';

import './App.css';

import Layout from './components/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';

/*
const Checkout = asyncComponent(()=>{
  return import('./containers/Checkout/Checkout');
});
*/
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
            <Switch>
              <Route path='/checkout'  component={Checkout} />
              <Route path='/'   component={BurgerBuilder} />
            </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}
//<Route render={()=> <h1>Page not found!</h1>} />
export default App;
