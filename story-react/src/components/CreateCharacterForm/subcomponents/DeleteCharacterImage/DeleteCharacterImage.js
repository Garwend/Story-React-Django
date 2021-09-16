import React from 'react';

import './DeleteCharacterImage.css';

const DeleteCharacterImage = ({close, deleteImage}) => {
    return (
        <div className='second-backdrop'>
            <div className='modal'>
                <div className='delete-character-image-wrap'>
                    <p>
                        czy na pewno chcesz usunąć zdjęcie?
                    </p>
                    <div>
                        <button onClick={close} className='flat-button'>anuluj</button>
                        <button className='button-style' onClick={deleteImage}>usuń</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteCharacterImage;