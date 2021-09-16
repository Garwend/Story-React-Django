import React,{useState} from 'react';

import CreateCharacterForm from '../CreateCharacterForm/CreateCharacterForm';
import DeleteCharacterModal from './subcomponents/DeleteCharacterModal';

import './CharacterImageAndName.css';

const CharacterImageAndName = ({id, name, imageUrl, characterStory, characterAppearance, characterTrait, setCharacter}) => {
    const [isEditModalOpen,setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false);
    const handleEditModalClose = e => {
        if (e !== undefined){
            e.preventDefault();
        }
        setIsEditModalOpen(false);
    }
    const handleEditModalOpen = () => setIsEditModalOpen(true);

    const handleDeleteModalClose = () => setIsDeleteModalOpen(false);
    const handleDeleteModalOpen = () => setIsDeleteModalOpen(true);

    return (
        <React.Fragment>
            <section className='character-image-name-wrap'>
                <div className='character-image-wrap'>
                    <img className='character-image' src={imageUrl} alt=""/>
                    <button onClick={handleDeleteModalOpen} className='delete-character'>
                        <span className="material-icons">delete</span>
                    </button>
                    <button onClick={handleEditModalOpen} className='edit-character'>
                        <span className="material-icons">edit</span>
                    </button>
                </div>
                <p className='character-name'>{name}</p>
            </section>
            {isEditModalOpen ? <CreateCharacterForm id={id} name={name} story={characterStory} appearance = {characterAppearance}  trait = {characterTrait} imgUrl={imageUrl} isEdit={true} setCharacter={setCharacter} close={handleEditModalClose}/> : null}
            {isDeleteModalOpen ? <DeleteCharacterModal id={id} close={handleDeleteModalClose}/> : null}
        </React.Fragment>

    )
};

export default CharacterImageAndName;