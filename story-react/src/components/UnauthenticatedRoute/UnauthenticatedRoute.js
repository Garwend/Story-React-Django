import React from 'react';
import { useSelector} from "react-redux";
import { Route, Redirect } from 'react-router-dom';

const UnauthenticatedRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = useSelector(state => state.userReducer.isLoggedIn)
    
    return <Route {...rest} render={() => {
        return isLoggedIn ? <Redirect to='/' /> : <Component />
    }}/>
    
}

export default UnauthenticatedRoute