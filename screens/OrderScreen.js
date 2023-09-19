import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return {...state, loadingPay:true};
    case 'PAY_SUCCESS':
      return {...state, loadingPay: false, successPay: true};
    case 'PAY_FAIL':
      return {...state, loadingPay: false};
    case 'PAY_RESET':
      return {...state, loadingPay: false, successPay: false}
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order, successPay, loadingPay }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false, 
    loadingPay: false 
  });

  const [{isPending}, paypalDispatch]= usePayPalScriptReducer();

  function createOrder(data, actions){
    return actions.order
    .create({
      purchase_units: [
        {
          amount: {value: order.totalPrice}
        }
      ]
    })
    .then((orderId)=>{
      return orderId;
    })
  }

  function onApprove(data, actions){
    return actions.order.capture().then(async function(details){
      try{
        dispatch({type: 'PAY_REQUEST'});
        const {data}= await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: {authorization: `Bearer ${userInfo.token}`},
          }
        );
        dispatch({type: 'PAY_SUCCESS', payload: data});
        alert('Order is paid');
      }catch(err){
        dispatch({type: 'PAY_FAIL', payload: getError(err)});
        alert(getError(err));
      }
    })
  }

  function onError(err){
    alert(getError(err));
  }

  useEffect(() => { //We defined fetchOrder() inside which we sent an ajax request to get order information from  backend 
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/signin');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if(successPay){
        dispatch({type: 'PAY_RESET'});
      }
    }else{
      const loadPaypalScript = async()=>{
        const {data: clientId}= await axios.get('/api/keys/paypal', {
          headers: {authorization: `Bearer ${userInfo.token}`},
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD'
          }
        });
        paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
      }
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate,successPay, paypalDispatch]);
  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1>Order {orderId}</h1>
      <div className='col1'>
          <div className="mb-3">
            
              <h4>Shipping</h4>
              
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              
              {order.isDelivered ? (
                <div>
                  Delivered at {order.deliveredAt}
                </div>
              ) : (
                <div>Not Delivered</div>
              )}
            
          </div>
          <div className="mb-3">
            
              <h4>Payment</h4>
              
                <strong>Method:</strong> {order.paymentMethod}
              
              {order.isPaid ? (
                <div variant="success">
                  Paid at {order.paidAt}
                </div>
              ) : (
                <div variant="danger">Not Paid</div>
              )}
            
          </div>

          <div className="mb-3">
            
              <h4>Items</h4>
              <div>
                {order.orderItems.map((item) => (
                  <div key={item._id}>
                    <div className="align-items-center">
                      <div md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </div>
                      <div md={3}>
                        <span>{item.quantity}</span>
                      </div>
                      <div md={3}>${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            
          </div>
        </div>
        <div className='col2'>
            
              <h4>Order Summary</h4>
              <div>
                <div>
                  <div>
                    <div>Items</div>
                    <div>${order.itemsPrice.toFixed(2)}</div>
                    </div>
                </div>
                <div>
                  <div>
                    <div>Shipping</div>
                    <div>${order.shippingPrice.toFixed(2)}</div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>Tax</div>
                    <div>${order.taxPrice.toFixed(2)}</div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <strong> Order Total</strong>
                    </div>
                    <div>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
                {!order.isPaid && (
                  <div>
                    {isPending ? (
                      <div>Loading...</div>
                    )
                    :(
                      <div>
                        <PayPalButtons 
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}>

                        </PayPalButtons>
                      </div>
                    )
                    }
                    {loadingPay && <div>Loading...</div>}
                  </div>
                )}
              </div>
            
          </div>
        </div>
  );
}
