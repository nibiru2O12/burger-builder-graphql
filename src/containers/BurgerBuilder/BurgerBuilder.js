import React, { Component } from 'react';
import {connect} from 'react-redux';

import classes from './BurgerBuilder.css';
import WithErrorHandler from '../../UI/withErrorHandler/withErrorHandler'; 
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls//BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../UI/Modal/Modal'
import ModalAsk from '../../UI/Modal/ModalAsk/ModalAsk';
import Spinner from '../../UI/Spinner/Spinner';
import axiosOrder from '../../axios-instances/axios-order';
import * as actions from '../../actions';

const INGREDIENTS_PRICE={
    Meat:2,Cheese:2,Salad:3,Bacon:5
}

class BurgerBuilder extends Component {

    state={
      ingredients:null,
      totalPrice:0,
      purchasable:false,
      checkout:false,
      reset:false,
      isLoading:false
    }

    componentDidMount(){
        this.handleFetchIngredients();
    }

    handleFetchIngredients(){
        this.setState({isLoading:true});
        axiosOrder.get('/ingredients.json')
        .then(response => {
            this.setState({
                ingredients:response.data
            });
        })
        .then(res => this.setState({isLoading:false}))
        .catch(err => this.setState({isLoading:false}));
    }

    handleProceedOrder = () => {
        this.setState({isLoading:true});
        
        this.props.addNewOrder({
            ingredients : this.state.ingredients,
            price : this.state.totalPrice
        })

        this.props.history.push({
            pathname:'/checkout'
            //state:{ingredients:this.state.ingredients}
        });
    }

    handleCancelOrder = () => {
        alert('you have cancelled your order');
        this.handleCloseModal();
    }

    handleCheckout = () => {
        this.setState({checkout:true});
    }

    handleCloseModal = () => {
        this.setState({checkout:false});
    }

    updatePurchasableState () {

        const ing = {...this.state.ingredients};

        const sum = Object.keys(ing).map(key=>{
              return ing[key]
        }).reduce( (a,b) => a + b);

        this.setState({
            purchasable: (sum > 0) ? true : false
        });

    }

    handleToggleReset = () => {
        this.setState(prev => {
            return {reset:!prev.reset}
        });
    }

    handleResetAction = () => {
        
        this.handleFetchIngredients();

        this.setState({
            totalPrice:0,purchasable:false
        });

        this.handleToggleReset();
    }

    handleIncrementIngredient  = (type) =>{
        let ingredients = Object.assign(this.state.ingredients);
        ingredients[type]=ingredients[type] + 1;

        this.setState(prev=>{
            return {
                ingredients:ingredients,    
                totalPrice: prev.totalPrice + INGREDIENTS_PRICE[type]
            }
        });

        this.updatePurchasableState();
    }

    handleDecrementIngredient  = (type) =>{

        let ingredients = Object.assign(this.state.ingredients);

        if (ingredients[type]===0) return false ;

        ingredients[type]=ingredients[type] - 1;

        this.setState(prev=>{
            return {
                ingredients,
                totalPrice: prev.totalPrice - INGREDIENTS_PRICE[type]
            }
        });

        this.updatePurchasableState();
    }
    
    render(){
        
        let  orderElement = '';
        
        if(this.state.isLoading){
            orderElement=(<Spinner />);
        }else{
            orderElement=(
                <OrderSummary 
                        show={this.state.checkout}
                        ingredients={this.state.ingredients}
                        price = {this.state.totalPrice}
                        proceedOrder={this.handleProceedOrder}
                        cancelOrder={this.handleCancelOrder} />
            );
        }

        let burgerComponent = (<Spinner />);

        if(!this.state.isLoading){
            burgerComponent = <Burger ingredients={this.state.ingredients} />
        }
        
        return (

            
            <Aux>
                <Modal show={this.state.checkout} close={this.handleCloseModal}>
                    {orderElement}
                </Modal>
                
                <ModalAsk show ={this.state.reset} 
                          close ={this.handleToggleReset} 
                          no = {this.handleCloseModal} 
                          yes = {this.handleResetAction} >
                    Reset your burger ingredient?
                </ModalAsk>
                <div className={classes.BurgerBuilder}>
                    <div className={classes.Burger}>
                        {burgerComponent}
                    </div>
                    <div className={classes.BurgerControls}>
                        <BuildControls 
                            price={this.state.totalPrice}
                            ingredients={this.state.ingredients}
                            addIngredient={this.handleIncrementIngredient}
                            decIngredient={this.handleDecrementIngredient}
                            purchasable={this.state.purchasable}
                            checkout={this.handleCheckout}
                            reset = {this.handleToggleReset} />
                    </div>
                </div>

            </Aux>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        order : state.burger.order
    }
}

const mapDispatchToProps = dispatch => {
    return{
        addNewOrder : (order) => dispatch(actions.addNewOrder(order))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(WithErrorHandler(BurgerBuilder,axiosOrder));