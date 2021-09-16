import React,{useState} from 'react';
import { useSelector } from "react-redux";
import EditProfileForm from './subcomponenets/EditProfileForm';

import './ProfileInfo.css';

const ProfileInfo = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const username = useSelector(state => state.userReducer.user.username);
    const profileImage = useSelector(state => state.userReducer.user.profile_image);
    
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = e => {
        if (e !== undefined) {
            e.preventDefault();
        }
        setIsModalOpen(false)
    };

    return (
        <React.Fragment>
            <section className='profile-info'>
                <div className='user-image-wrap'>
                    <img className='user-image' src={profileImage} alt=""/>
                    <button className='edit-profile' onClick={handleModalOpen}><span className="material-icons">edit</span></button>
                </div>
                    <div className='username-wrap'>
                    <p className='username'>{username}</p>
                </div>
            </section>
            {isModalOpen ? <EditProfileForm close={handleModalClose} /> : null}
        </React.Fragment>

    )
}

export default ProfileInfo;