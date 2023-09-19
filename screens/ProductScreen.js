import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useReducer} from 'react';
import axios from 'axios';
import Rating from '../components/Rating.js';
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils.js';
import {Store} from '../Store.js';

const reducer = (state, action) =>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state,loading: true};
        case 'FETCH_SUCCESS':
            return {...state, product: action.payload, loading:false};
        case 'FETCH_FAIL':
            return {...state,loading: false, error: action.payload};
        default:
            return state;
    }
}

function ProductScreen(){
    const navigate=useNavigate(); // We are giving navigate variable useNavigate() bcz we want to use useNavigate inside 
    // addToCartHandler. But we can't do that. So we are giving navigate useNavigate() outside addToCartHandler and using navigate inside addToCartHandler

    // We will get the slug from react-router-dom and display it
    const params = useParams(); 
    // We use useParams function of the react-router-dom to get the slug from the url as we are adding slug to the url of this pg
    const {slug} = params;
    const [{loading, error, product},dispatch] = useReducer(reducer,{
        product: [],  //since we will be showing only 1 roduct
        loading: true, 
        error: '' 
    });
    useEffect(()=>{
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try{
                const result = await axios.get(`/api/products/slug/${slug}`);
                dispatch({type: 'FETCH_SUCCESS',payload:result.data});
            }
            catch(err){
                dispatch({type: 'FETCH_FAIL', payload: getError(err)});
            }
    
        };
        fetchData();
    }, [slug]);

    const {state, dispatch: ctxDispatch}= useContext(Store);
    const { cart } = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }   
        ctxDispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}});
        navigate('/cart');
    }

    return (
        loading? <div>Loading...</div>
        :error? <div>{error}</div>
        :
        <div>
            <div className='col1'><img src={product.image} alt={product.name}></img></div>
            <div className='col2'>
                <Helmet><title>{product.name}</title></Helmet>
                <h1>{product.name}</h1>
                <Rating rating={product.rating} numReviews={product.numReviews}/>
                <p><strong>Price: ${product.price}</strong></p>
                <p>{product.description}</p>
                <div>Status: {
                    product.countInStock > 0 ?
                    <div className='instock'>In stock</div>
                    : <div className='outofstock'>Out of Stock</div>
                }
                </div>
                <div>
                    {
                        product.countInStock > 0 && (
                            <button onClick={addToCartHandler}>Add to cart</button>
                            // <button className='add-to-cart' type="button">Add to cart</button>
                        )
                    }
                    
                </div>

            </div>
        </div>
    );
}

export default ProductScreen;