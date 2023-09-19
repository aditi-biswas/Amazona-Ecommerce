import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import { useContext } from 'react';
import { Store } from './Store.js';
import CartScreen from './screens/CartScreen.js';
import SigninScreen from './screens/SigninScreen.js';
import SignupScreen from './screens/SignupScreen.js';
import ShippingAddressScreen from './screens/ShippingAddressScreen.js';
import PaymentMethodScreen from './screens/PaymentMethodScreen.js';
import PlaceOrderScreen from './screens/PlaceOrderScreen.js'
import OrderScreen from './screens/OrderScreen';

function App() {
  const {state, dispatch: ctxDispatch} = useContext(Store);
  const {cart, userInfo} = state;
  // var l=0;

  const signoutHandler=()=>{
    ctxDispatch({type: 'USER_SIGNOUT'});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  }

  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">amazona</Link>
          <div>
          <Link to="/cart" className='nav-link'>
            Cart {
              cart.cartItems.length>0 && (
                <span>{cart.cartItems.reduce((a,c) => a+c.quantity, 0)}</span>
              )
            }
          </Link>
          {userInfo ? (
            <div className='user-info'> <span>{userInfo.name  }</span>
              <span>{'   '}  </span>
              <Link to="/profile" className='slim-user-profile'>User-Profile</Link>
              <span>{'      '}</span>
              <Link to="/orderhistory" className='slim-user-profile'>Order-History</Link>
              {' '}
              <Link to="#signout" onClick={signoutHandler}  className='slim-user-profile'>Signout</Link>
            </div>
          ) : (
            <Link  className="signin-link" to="/signin">Sign In</Link>
          )}
          </div>
        </header>
        <main>
          <div>
          <Routes>
            <Route path="/" element={<HomeScreen />} />       
            {/* "/" means the default screen which will be displayed */}
            {/* In element we will give the element which we want to display(not file name the element name) */}
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />}></Route>
          </Routes>
          {/* Along with the route if we write any component(like p,h1,etc) in this page will be displayed the main page.as this is the pg from where our application starts executing */}
          {/* Routes are not any element to be displayed so they wont be displayed if we write them in this file and the contents inside them will only be displayed if we go to that link */}
          </div>
        </main>
        <footer>
          <div>@all rights reserver</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
