import { useContext } from "react";
import { Store } from "../Store.js";
import { Link, useNavigate } from "react-router-dom";
import {Helmet} from 'react-helmet-async';
import axios from 'axios';

function CartScreen(){
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart: {cartItems}} = state;

    const updateCartHandler = async (item, quantity) => {
        const {data} = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }   
        ctxDispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity}});
    }

    const removeItemHandler = (item) => {
        ctxDispatch({type: 'CART_REMOVE_ITEM', payload: item});
    }

    const navigate =useNavigate();
    const checkoutHandler = () => {
        navigate ('/signin?redirect=/shipping');
        /* We check user-authentication and if user is authenticated we will redirect user to shipping pg otherwise we will redirect user to authentication pg*/
    }

    return (
        <div>
            <Helmet><title>Shopping Cart</title></Helmet>
            <h1>Shopping Cart</h1>
            <div className="cartcol1">
                {
                    cartItems.length ===0?(
                        <div>Cart is empty. <Link to="/">Go Shopping</Link></div>
                    )
                    :(
                        <div>
                            {cartItems.map((item) => (
                                <div className="cartrow">
                                    <span className="cartcol3">
                                        <img src={item.image} alt={item.name} className="img-thumbnail"></img>
                                        {' '}
                                        <Link to= {`/product/${item.slug}`}>{item.name}</Link>
                                    </span>
                                    <span className="cartcol3">
                                        {/* { item.quantity>1 && */}
                                            <button  disabled={item.quantity === 1} onClick={()=>updateCartHandler(item, item.quantity-1)}>
                                                <i className="fas fa-minus-circle"></i>
                                            </button>
                                        {/* } */}
                                        {' '}
                                        <span>{item.quantity}</span>
                                        {' '}
                                        {/* {item.quantity< item.countInStock && */}
                                            <button disabled={item.quantity === item.countInStock} onClick={()=>updateCartHandler(item, item.quantity+1)}>
                                                <i className="fas fa-plus-circle"></i>
                                            </button>
                                        {/* } */}
                                    </span>
                                    <span className="cartcol3">
                                        ${item.price}
                                    </span>
                                    <span>
                                        <button onClick={() => removeItemHandler(item)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
            <div className="cartcol2">
                <h3>
                    Subtotal  ({cartItems.reduce((a,c) => a+c.quantity,0)}  items)
                        : $ {cartItems.reduce((a,c) => a + c.price*c.quantity, 0)}
                </h3>
                { cartItems.length>0 &&
                    <button class="checkout" onClick={checkoutHandler}>Proceed to Checkout</button>
                }
                
            </div>
        </div>
    )
} 

export default CartScreen;