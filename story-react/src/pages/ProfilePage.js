import React from 'react';
import ProfileInfo from '../components/ProfileInfo/ProfileInfo';
import CharactersList from '../components/CharactersList/CharactersList';
const ProfilePage = () => {
    return (
        <React.Fragment>
            <ProfileInfo />
            <CharactersList />
        </React.Fragment>
    )
}

export default ProfilePage;