import React, {useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { useDispatch } from "react-redux";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute/UnauthenticatedRoute";

import {checkUser} from './actions/userActions';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CharacterPage from './pages/CharacterPage';
import StoryChatPage from './pages/StoryChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InfoPage from "./pages/InfoPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import Header from './components/Header/Header';
import ErrorSnackbar from "./components/ErrorSnackbar/ErrorSnackbar";
import CookieInfo from "./components/CookieInfo/CookieInfo";

import './App.css';

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(()=>{

    dispatch(checkUser())
    
    const theme = localStorage.getItem('theme')
    document.documentElement.lang = navigator.language
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark-mode');
    } else {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark-mode');
    }

  },[dispatch])
  
  return (
      <Router>
        <div id="oriesst">
          <Header />
          <main id='context'>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <PrivateRoute exact path='/:username' component={ProfilePage} />
              <PrivateRoute path='/character/:id' component={CharacterPage} />
              <PrivateRoute path='/story/:id' component={StoryChatPage} />
              <UnauthenticatedRoute path='/accounts/login' component={LoginPage} />
              <UnauthenticatedRoute path='/accounts/register' component={RegisterPage} />
              <UnauthenticatedRoute path='/accounts/forgot/password' component={ForgotPasswordPage} />
              <UnauthenticatedRoute path='/accounts/reset/password/:uid/:token' component={ResetPasswordPage} />
              <Route path='/info/page' component={InfoPage}/>
            </Switch>
          </main>
          <ErrorSnackbar />
          <CookieInfo />
        </div>
      </Router>
  );
}

export default App;
