import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Axios from 'axios';
import { getError } from '../utils';

// const reducer = (state,action)=>{
//   switch(action.type){
//     case 'CREATE_REQUEST':
//       return {...state,loading: true};
//     case 'CREATE_SUCCESS':
//       return {...state, loading: false};
//     case 'CREATE_FAIL':
//       return {...state, loading: false};
//     default:
//       return state;
      
//   }
// }

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen(){
    const navigate = useNavigate();

    const [{loading}, dispatch] = useReducer(reducer, {
      loading: false,
      // error: ''
    });

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
  
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
    cart.itemsPrice = round2(
      cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    // const placeOrderHandler = async () => {
    //   try{
    //     dispatch({type: 'CREATE_REQUEST'});
    //     const {data} = await Axios.post(
    //       '/api/orders',
    //       {
    //         orderItems: cart.cartItems,
    //         shippingAddress: cart.shippingAddress,
    //         paymentMethod: cart.paymentMethod,
    //         itemsPrice: cart.itemsPrice,
    //         shippingPrice: cart.shippingPrice,
    //         taxPrice: cart.taxPrice,
    //         totalPrice: cart.totalPrice 
    //       },
    //       {
    //         headers: {
    //           authorization: `Bearer ${userInfo.token}`,
    //         } //to check if req is coming from some loggedin user or some hacker
    //       }
    //     );
    //     ctxDispatch({type: 'CART_CLEAR'});
    //     dispatch({type: 'CREATE_SUCCESS'});
    //     localStorage.removeItem('cartItems');
    //     navigate(`/order/${data.order._id}`);
    //   }
    //   catch(err){
    //     dispatch({type: 'CREATE_FAIL'});
    //     alert(getError(err));
    //   }
    // };

    const placeOrderHandler = async () => {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
  
        const { data } = await Axios.post(
          '/api/orders',
          {
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
          },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        ctxDispatch({ type: 'CART_CLEAR' });
        dispatch({ type: 'CREATE_SUCCESS' });
        localStorage.removeItem('cartItems');
        navigate(`/order/${data.order._id}`);
      } catch (err) {
        dispatch({ type: 'CREATE_FAIL' });
        // toast.error(getError(err));
        alert(getError(err));
      }
    };

    useEffect(()=>{
      if(!cart.paymentMethod){
        navigate('/payment');
      }
    }, [cart, navigate] );

    return (
        <div>
          <Helmet>
            <title>Preview Order</title>
          </Helmet>
          <h1 className="my-3">Preview Order</h1>
          <div className='col1'>
              <div>
                
                  <h3>Shipping</h3>
                    <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                    <strong>Address: </strong> {cart.shippingAddress.address},
                    {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                    {cart.shippingAddress.country}
                  
                  <Link to="/shipping">Edit</Link>
                
              </div>
    
              <div >
                
                  <h3>Payment</h3>
                  
                    <strong>Method:</strong> {cart.paymentMethod}
                  
                  <Link to="/payment">Edit</Link>
                
              </div>
    
              <div >
                
                  <h3>Items</h3>
                  {/* <ListGroup variant="flush"> */}
                    {cart.cartItems.map((item) => (
                      <div key={item._id}>
                        <div className="align-items-center">
                          <div md={6}>
                            <img src={item.image} alt={item.name}></img>{' '}
                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                          </div>
                          <div >
                            <span>{item.quantity}</span>
                          </div>
                          <div >${item.price}</div>
                        </div>
                      </div>
                    ))}
                  {/* </ListGroup> */}
                  <Link to="/cart">Edit</Link>
                
              </div>
            </div>
            <div className='col2'>
              <h3>Order Summary</h3>
                      <div>
                        <span>Items</span>
                        <span>${cart.itemsPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span>Shipping</span>
                        <span>${cart.shippingPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span>Tax</span>
                        <span>${cart.taxPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span>
                          <strong> Order Total </strong>
                        </span>
                        <span>
                          <strong>${cart.totalPrice.toFixed(2)}</strong>
                        </span>
                      </div>
                      <div >
                        <button
                          type="button"
                          onClick={placeOrderHandler}
                          // disabled={cart.cartItems.length === 0}
                        >
                          Place Order
                        </button>
                      </div>
                    {loading && <div>Loading...</div>}
              </div>
          </div>
      );

}