import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store.js';

export default function ShippingAddressScreen() {
  
    const navigate=useNavigate();
    const {state, dispatch: ctxDispatch}=useContext(Store);
    const {userInfo, cart: {shippingAddress}}=state;
    
    const [fullName, setFullName]= useState(shippingAddress.fullName || '');
    const [address, setAddress]= useState(shippingAddress.address || '');
    const [city, setCity]= useState(shippingAddress.city || '');
    const [postalCode, setPostalCode]= useState(shippingAddress.postalCode || '');
    const [country, setCountry]= useState(shippingAddress.country || '');

    useEffect(()=>{
        if(!userInfo){
            navigate('/signin?redirect=/shipping');
        }
    }, [userInfo, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                postalCode,
                country
            }
        });
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                address,
                city,
                postalCode,
                country
            })
        );
        navigate('/payment');
    }

    return (
    <div>
        <Helmet><title>Shipping Address</title></Helmet>
        <h1>Shipping Address</h1>
        <form onSubmit={submitHandler}>
        <div>
            <label for="name">Full Name </label>
            <input type="text" name="name" id="name" placeholder="name" value={fullName} required onChange={(e)=> setFullName(e.target.value)}></input>
        </div>
        <div>
            <label for="address">Address </label>
            <input type="text" name="address" id="address" placeholder="address" value={address} required onChange={(e)=>setAddress(e.target.value)}></input>
        </div>
        <div>
            <label for="city">City </label>
            <input type="text" name="city" id="city" placeholder="city" value={city}  required onChange={(e)=>setCity(e.target.value)}></input>
        </div>
        <div>
            <label for="postalCode">PostalCode </label>
            <input type="text" name="postalCode" id="postalCode" placeholder="postalCode" value={postalCode} required onChange={(e)=>setPostalCode(e.target.value)}></input>
        </div>
        <div>
            <label for="country">Country </label>
            <input type="text" name="country" id="country" placeholder="country" value={country} required onChange={(e)=>setCountry(e.target.value)}></input>
        </div>
        <div><button type="submit">Continue</button></div>
      </form>
    </div>
  )
}
