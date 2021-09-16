import React from 'react';

import './DeleteProfileImage.css';

const DeleteProfileImage = ({close, deleteImage}) => {
    return (
        <div className='second-backdrop'>
            <div className='modal'>
                <div className='delete-profile-image-wrap'>
                    <p>
                        czy na pewno chcesz usunąć zdjęcie profilowe?
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

export default DeleteProfileImage;