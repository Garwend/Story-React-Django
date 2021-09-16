import React from 'react';
import { useSelector} from "react-redux";

import FindStory from '../components/FindStory/FindStory';
import CreateStory from '../components/CreateStory/CreateStory';
import StoryList from '../components/StoryList/StoryList';
import LoginForm from "../components/LoginForm/LoginForm";
import SpinnerLoader from "../components/SpinnerLoader/SpinnerLoader";

import './HomePage.css'

import SvgHomePage from "../images/home_page.svg";

const HomePage = () => {
    const isLoggedIn = useSelector(state => state.userReducer.isLoggedIn)
    if (isLoggedIn === null) {
        return (
            <div style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>
                <SpinnerLoader />
            </div>
        )
    }else {
        if (isLoggedIn) {
            return (
                <React.Fragment>
                    <section className='find-create-story-wrap'>
                        <FindStory />
                        <CreateStory />
                    </section>
                    <section className='user-stories-wrap'>
                        <h1>Historyjki</h1>
                        <StoryList />
                    </section>
                </React.Fragment>
            )
        } else {
            return (
                <div className='unauthenticated-home-page'>
                    <img src={SvgHomePage} alt=""/>
                    <div>
                        <h1 className='unauthenticated-home-page-oriesst'>Oriesst</h1>
                        <p className='unauthenticated-home-page-description'>Twórz własne historyjki lub znajdź historyjki i pisz je razem z innymi osobami</p>
                        <LoginForm />
                    </div>
                </div>
            )
        }
    }
    
    
}

export default HomePage;