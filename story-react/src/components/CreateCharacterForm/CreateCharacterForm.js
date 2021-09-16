import React,{useState, useEffect} from 'react';
import { validTokenRequiredFetch } from "../../actions/userActions";
import { createCharacter, editCharacter, getDefaultCharacterImageUrl } from "../../actions/characterActions";
import { useDispatch } from "react-redux";
import ReactDOM from 'react-dom';
import DeleteCharacterImage from "./subcomponents/DeleteCharacterImage/DeleteCharacterImage";
import './CreateCharacterForm.css';

const CreateCharacterForm = ({
    id = 0,
    name = '',
    story = '',
    appearance = '',
    trait = '',
    imgUrl = '',
    isEdit = false,
    setCharacter = null,
    close
}) => {
    const defaultImageUrlBeginning = 'https://s3.eu-central-1.amazonaws.com/cdn.oriesst/static/character_images/avatar.png?';
    const [image,setImage] = useState(null);
    const [defaultImage, setDefaultImage] = useState(null)
    const [imagePreview,setImagePreview] = useState(imgUrl);
    const [characterName,setCharacterName] = useState(name);
    const [characterNameError,setCharacterNameError] = useState({'error': false, 'errorType': null});
    const [characterStory,setcharacterStory] = useState(story);
    const [characterAppearance,setCharacterAppearance] = useState(appearance);
    const [characterTrait,setCharacterTrait] = useState(trait);
    const [isImageDelete,setIsImageDelete] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageChange = e => {
        setImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        if (isEdit && imgUrl !== defaultImage) {
            setIsImageDelete(false)
        }
    }

    const handleCharacterNameChange = e => {
        if(characterNameError.error) {
            if (characterNameError.errorType === 'empty' && e.target.value.trim().length !== 0) {
                setCharacterNameError({'error': false, 'errorType': null});
            } else if (characterNameError.errorType === 'maxLength' && e.target.value.length <= 24) {
                setCharacterNameError({'error': false, 'errorType': null});
            } 
        }
        setCharacterName(e.target.value);
    };

    const handleDeleteImageClick = e => {
        e.preventDefault();
        if (defaultImage !== null) setImagePreview(defaultImage);
        else setImagePreview(imgUrl);
        setImage(null);
    }

    const handlecharacterStoryChange = e => setcharacterStory(e.target.value);
    const handleCharacterAppearanceChange = e => setCharacterAppearance(e.target.value);
    const handleCharacterTraitChange = e => setCharacterTrait(e.target.value);
    
    const handleModalOpen = e => {
        setIsModalOpen(true);
        setIsImageDelete(true);
    }
    const handleModalClose = e => {
        setIsModalOpen(false);
        setIsImageDelete(false);
    }

    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        if(characterName.trim().length === 0 || characterName.length > 24) {
            console.warn('Nazwa postaci jest wymagana');
            if (characterName.trim().length === 0) {
                setCharacterNameError({'error': true, 'errorType': 'empty'});
            } else if (characterName.length > 24) {
                setCharacterNameError({'error': true, 'errorType': 'maxLength'});
            }

        }else{
            if (isEdit) {
                dispatch(validTokenRequiredFetch(editCharacter(id,encodeURI(characterName), encodeURI(characterStory), encodeURI(characterTrait), encodeURI(characterAppearance),isImageDelete, image, setCharacter, close)))
            }else {
                dispatch(validTokenRequiredFetch(createCharacter(encodeURI(characterName), encodeURI(characterStory), encodeURI(characterTrait), encodeURI(characterAppearance), image, close)))
                console.log('create')
            }
        }
    }

    useEffect(()=>{
        if (!isEdit) dispatch(validTokenRequiredFetch(getDefaultCharacterImageUrl(setDefaultImage, setImagePreview)));
    },[dispatch, isEdit])

    return ReactDOM.createPortal((
        <>
        <div className='backdrop'>
            <div className='modal'>
                <form onSubmit={handleSubmit} className='create-character-form'>
                    <div className='create-character-image-wrap'>
                        <div style={{position:'relative'}}>
                            <img className='create-character-image-preview' src={imagePreview} alt=""/>
                            {image !== null || !imagePreview.startsWith(defaultImageUrlBeginning) ? 
                            <button type='button' onClick={
                                !isEdit ? 
                                handleDeleteImageClick
                                : image === null ? 
                                handleModalOpen
                                : handleDeleteImageClick} className='delete-character-image-btn'>Usuń</button> 
                            : null}
                        </div>
                        <input onChange={handleImageChange} className='hide' type="file" id="create-character-image-input" accept='image/*'/>
                        <label style={{cursor:'pointer'}} className='flat-button' htmlFor="create-character-image-input">wybierz zdjęcie</label>
                    </div>
                    <div>
                        <input value={characterName} onChange={handleCharacterNameChange} className='form-input' placeholder="nazwa postaci" type="text"/>
                        {characterNameError.error ? 
                        <p className='validation-error'>
                            {characterNameError.errorType === 'empty' ?
                            'to pole nie może być puste'
                            : 'nazwa postaci nie może być dłuższa niż 24 znaków'}
                        </p> 
                        : null}
                    </div>
                    <textarea value={characterStory} onChange={handlecharacterStoryChange} className='form-input' placeholder="historia postaci" cols="30" rows="10"></textarea>
                    <div>
                        <input value={characterAppearance} onChange={handleCharacterAppearanceChange} className='form-input' placeholder="wygląd postaci" type="text"/>
                        <p className='input-info'>Oddziel każdy element wyglądu przecinkiem</p>
                    </div>
                    
                    <div>
                        <input value={characterTrait} onChange={handleCharacterTraitChange} className='form-input' placeholder="cechy charakteru" type="text"/>
                        <p className='input-info'>Oddziel każdą ceche charakteru przecinkiem</p>
                    </div>
                    
                    <div className='create-character-or-cancel'>
                        <button onClick={close} className='flat-button'>anuluj</button>
                        <button className='button-style' type='submit'>{isEdit ? 'aktualizuj' :'stwórz'}</button>
                    </div>
                </form>
            </div>
        </div>
        {isModalOpen ? <DeleteCharacterImage close={handleModalClose} deleteImage={handleSubmit}/> : null}
        </>
    ),document.body)
}

export default CreateCharacterForm;