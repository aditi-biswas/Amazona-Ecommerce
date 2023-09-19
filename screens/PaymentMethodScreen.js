import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store.js'
import { useNavigate } from 'react-router-dom';

export default function PaymentMethodScreen() {
    const navigate=useNavigate();
    const {state, dispatch:ctxDispatch}=useContext(Store);
    
    const {
        cart: {shippingAddress, paymentMethod}
    }=state;

    const [paymentMethodName,setPaymentMethod]=useState(paymentMethod || 'PayPal');

    useEffect(()=>{
        if(!shippingAddress.address){
            navigate('/shipping');
        }
    },[shippingAddress, navigate]);

    const submitHandler=(e) => {
        e.preventDefault();
        ctxDispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName});
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/placeorder');
    }

  return (
    <div>
      <Helmet><title>Payment Method</title></Helmet>
      <h1>Payment Method</h1>
      <form onSubmit={submitHandler}>
        <label for="PayPal">PayPal</label>
        <input type="radio" id="PayPal" name='payment' value="PayPal" checked={paymentMethodName === 'PayPal'} onChange={(e)=>setPaymentMethod(e.target.value)}></input>
        {' '}
        <label for="Stripe">Stripe</label>
        <input type="radio" id="Stripe" name='payment' value="Stripe" checked={paymentMethodName === 'Stripe'} onChange={(e)=>setPaymentMethod(e.target.value)}></input>
        {' '}
        <button type='submit'>Continue</button>
      </form>
    </div>
  )
}
