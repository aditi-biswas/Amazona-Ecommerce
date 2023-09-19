import {Link} from 'react-router-dom';
// import data from '../data.js'; 
// import { useState } from 'react';
import { useEffect, useReducer} from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Rating from '../components/Rating.js';
import {Helmet} from 'react-helmet-async';
import { useContext } from 'react';
import { Store } from '../Store.js';

const reducer = (state, action) =>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state,loading: true};
        case 'FETCH_SUCCESS':
            return {...state, products: action.payload, loading:false};
        case 'FETCH_FAIL':
            return {...state,loading: false, error: action.payload};
        default:
            return state;
    }
}


function HomeScreen() {
    // const [products,setProducts] = useState([]);
    const [{loading, error, products},dispatch] = useReducer(logger(reducer),{
        products: [], //default value of products
        loading: true, //since we will be fetching data from backend
        error: '' //since there is no error in the 1st place
    });
    // useEffect(()=>{
    //     const fetchData=async() => {
    //         try{
    //             const result = await axios.get('/api/products');
    //             setProducts(result.data);
    //         }
    //         catch(error){
    //             console.log(error);
    //         }
    //     };
    //     fetchData();
    // }, []);
    useEffect(()=>{
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try{
                const result = await axios.get('/api/products');
                dispatch({type: 'FETCH_SUCCESS',payload:result.data});
            }
            catch(err){
                dispatch({type: 'FETCH_FAIL', payload: err.message});
            }
    
            // setProducts(result.data);    //result.data is the product in backend
        };
        fetchData();
    }, []);

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart: {cartItems}} = state;

    const addToCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === item._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }   
        ctxDispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity}});
    }

    return (
        <div> 
            <Helmet><title>amazona</title></Helmet>
            <h1>Featured Products</h1>
            <div className="products">
            {
                loading? (<div>Loading...</div>):
                error? (<div>{error}</div>):
                (
                    products.map((product) => (
                    <div className="product" key={product.slug}>
                        <Link to={`/product/${product.slug}`}> 
                            {/* We are routing to product desc page */}
                            <img src={product.image} alt={product.name} ></img>
                        </Link>
                        <div className="product-info">
                            <Link to={`/product/${product.slug}`}><p>{product.name}</p></Link>
                            <Rating rating={product.rating} numReviews={product.numReviews}/>
                            <p><strong>${product.price}</strong></p>
                            {product.countInStock ===0? <button disabled>Out of Stock</button>
                             :<button onClick={() => addToCartHandler(product)}>Add to Cart</button>
                            }
                        </div>
                    </div>))
                )
            }
            </div>
        </div>
    );
}

export default HomeScreen;