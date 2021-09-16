import React from 'react';
import { useSelector} from "react-redux";
import { Route, Redirect } from 'react-router-dom';
import SpinnerLoader from "../SpinnerLoader/SpinnerLoader";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = useSelector(state => state.userReducer.isLoggedIn)


    return <Route {...rest} render={() => {
        if (isLoggedIn === null) {
            return (
                <div style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>
                    <SpinnerLoader />
                </div>
            )
        }else {
            return isLoggedIn ? <Component /> : <Redirect to='/accounts/login' />
        }
        
    }}/>
    
}

export default PrivateRoute