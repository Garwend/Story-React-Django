import React,{useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import ReactDOM from 'react-dom';
import { validTokenRequiredFetch, updateUser } from "../../../actions/userActions";
import ChangePassword from "./ChangePassword/ChangePassword";
import DeleteProfileImage from "./DeletProfileImage/DeleteProfileImage";
import './EditProfileForm.css';

const EditProfileForm = ({close}) => {
    const defaultImageUrlBeginning = 'https://s3.eu-central-1.amazonaws.com/cdn.oriesst/static/profile_images/avatar.png';
    const profileImage = useSelector(state => state.userReducer.user.profile_image);
    const [imagePreview, setImagePreview] = useState('');
    const [image, setImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageChange = e => {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        setImage(e.target.files[0]);
    }

    const handleModalOpenClick = () => setIsModalOpen(true)
    const handleModalCloseClick = () => setIsModalOpen(false)

    const dispatch = useDispatch();

    const handleDeleteImage = () => {
        const formData = new FormData();
        const graphqlMutation = `mutation { updateUser { user { id username imageUrl } } }`
        formData.append('query', graphqlMutation);
        dispatch(validTokenRequiredFetch(updateUser(formData, close)));
    }


    const handleSubmit = e => {
        e.preventDefault();
        console.log(image);
        if (image !== null) {
            const formData = new FormData();
            const graphqlMutation = `mutation { updateUser { user { id username imageUrl } } }`
            formData.append('query', graphqlMutation);
            if (image !== 'deleted') {
                formData.append('image', image);
            }
            dispatch(validTokenRequiredFetch(updateUser(formData, close)));
        }
    }

    return ReactDOM.createPortal((
        <>
        <div className='backdrop'>
            <div className='modal'>
                <button type='button' className='close-modal-btn' onClick={close}>
                    <span className="material-icons">close</span>
                </button>
                <form className='edit-profile-form' onSubmit={image !== null ? handleSubmit : null}>
                    <div className='edit-profile-image-wrap'>
                        <div className='image-preview-wrap'>
                            <img className='edit-profile-image-preview' src={imagePreview === '' ? profileImage : imagePreview} alt=""/>
                            {!profileImage.startsWith(defaultImageUrlBeginning) && !imagePreview.startsWith(defaultImageUrlBeginning) ? 
                            <button onClick={handleModalOpenClick} type='button'>Usuń</button> 
                            : null}
                            
                        </div>
                        <input onChange={handleImageChange} type="file" name="" id="input-edit-image-profile" className="hide" accept="image/*"/>
                        <label style={{cursor:'pointer'}} className='flat-button' htmlFor="input-edit-image-profile">wybierz zdjęcie</label>
                    </div>

                    <div className='edit-profile-button-wrap'>
                        <button disabled={ image !== null ? false : true} className='button-style' type='submit'>
                            edytuj
                        </button>
                    </div>
                </form>
                <ChangePassword />
            </div>
        </div>
        {isModalOpen ? <DeleteProfileImage close={handleModalCloseClick} deleteImage={handleDeleteImage}/> : null}
        </>
    ), document.body)
}

export default EditProfileForm;