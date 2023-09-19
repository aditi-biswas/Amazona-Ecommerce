import {Helmet} from 'react-helmet-async';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import {Store} from '../Store.js';

function SignupScreen(){
    const navigate = useNavigate();
    const {search}=useLocation();
    const redirectInUrl=new URLSearchParams(search).get('redirect');
    const redirect= redirectInUrl ? redirectInUrl: '/';

    const [name, setName]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]=useState('');
    const [confirmPassword, setConfirmPassword]=useState('');

    const {state, dispatch: ctxDispatch}= useContext(Store);
    const {userInfo}=state;

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password!==confirmPassword){
            alert('Passwords do not match');
            return;
        }
        try{ // for try block we will send an ajax request to backend at /api/user/signin. This is the api we created
            const {data} = await Axios.post('/api/users/signup',{
                name,
                email,
                password,
            }); // extractig data from what we get by making this request
        //     params : {email : email,password: password}
        // });
            ctxDispatch({type: 'USER_SIGNIN', payload: data});
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        }
        catch(err){
            alert('Invalid email or assword');
        }
    }

    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return (
        <div className="small-container">
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <h1 className="my-3">Sign Up</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <label for="name">Name </label>
                    <input type="name" name="name" id="name" placeholder="name" required onChange={(e)=> setName(e.target.value)}></input>
                </div>
                <div>
                    <label for="email">Email </label>
                    <input type="email" name="email" id="email" placeholder="email" required onChange={(e)=> setEmail(e.target.value)}></input>
                </div>
                <div>
                    <label for="password">Password </label>
                    <input type="password" name="password" id="password" placeholder="password" required onChange={(e)=>setPassword(e.target.value)}></input>
                </div>
                <div>
                    <label for="confirmPassword">Confirm Password </label>
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="confirmPassword" required onChange={(e)=>setConfirmPassword(e.target.value)}></input>
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <div>Already have an account?
                <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
            </div>
            {/* <form action="/login" method="post">
                <div>
                    <label for="username">Enter Username: </label>
                    <input type="text" name="username" id="username" placeholder="username"></input>
                </div>
                <div>
                    <label for="password">Enter Password: </label>
                    <input type="password" name="password" id="password" placeholder="password"></input>
                </div>
                <button>Login</button>
            </form> */}
        </div>
    )
}

export default SignupScreen;