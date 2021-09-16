import React, {useState} from 'react';
import CreateStoryForm from './subcomponents/CreateStoryForm';

import './CreateStory.css'

const CreateStory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = e => {
        e.preventDefault()
        setIsModalOpen(false)
    };

    return (
        <React.Fragment>
            <div className='create-story-wrap'>
                <h3>Stwórz historyjkę</h3>
                {/* <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio distinctio sit odit delectus tempore,     ducimus facere, reprehenderit nulla, quia sapiente quibusdam voluptatibus praesentium modi blanditiis.  Exercitationem culpa molestiae sit mollitia.</p> */}
                <button onClick={handleOpenModal} className='create-story-btn'>Stwórz</button>
            </div>
            {isModalOpen ? <CreateStoryForm close={handleCloseModal}/> : null}
        </React.Fragment>

    );
};

export default CreateStory;