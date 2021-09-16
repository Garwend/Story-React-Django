import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom'

import Terms from "../components/Terms/Terms";
import CookiesPolicy from "../components/CookiesPolicy/CookiesPolicy";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";

import "./InfoPage.css";

const InfoPage = () => {
    return (
        <div className='page-info-wrap'>
            <nav className='page-info-nav'>
                <NavLink exact to='/info/page'>Regulamin</NavLink>
                <NavLink to='/info/page/cookies'>Polityk plików cookie</NavLink>
                <NavLink to='/info/page/privacy/policy'>Polityka prywatności</NavLink>
            </nav>
            <main className='main-info-page'>
                <Switch>
                    <Route exact path='/info/page' component={Terms} />
                    <Route path='/info/page/cookies' component={CookiesPolicy} />
                    <Route path='/info/page/privacy/policy' component={PrivacyPolicy} />
                </Switch>
            </main>
        </div>
    )
}

export default InfoPage;