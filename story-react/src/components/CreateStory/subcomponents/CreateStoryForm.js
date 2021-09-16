import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import { validTokenRequiredFetch } from "../../../actions/userActions";
import { createStory } from "../../../actions/storyActions";
import { useDispatch, useSelector } from "react-redux";
import ReactDOM from 'react-dom';

import AdditionalCharacter from "../subcomponents/AdditionalCharacter/AdditionalCharacter";
import SelectAdditionalCharacters from "./SelectAdditionalCharacter/SelectAdditionalCharacters";

import './CreateStoryForm.css';

const CreateStoryForm = ({close}) => {
    const history = useHistory();
    const characters = useSelector(state => state.characterReducer.characters);

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState({'error': false, 'errorType': null})
    const [plot, setPlot] = useState('');
    const [plotError, setPlotError] = useState({'error': false, 'errorType': null})
    const [numberOfUsers, setNumberOfUsers] = useState("2");
    const [language, setLanguage] = useState('PL');
    const [numberOfFemale, setNumberOfFemale] = useState(0);
    const [numberOfMale, setNumberOfMale] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [characterList, setCharacterList] = useState([]);

    const handleTitleChange = e => {
        setTitle(e.target.value);
        if (titleError.error) {
            if (titleError.errorType === 'empty' && e.target.value.trim().length !== 0) {
                setTitleError({'error': false, 'errorType': null});
            } else if (titleError.errorType === 'maxLength' && e.target.value.length <= 30) {
                setTitleError({'error': false, 'errorType': null});
            } 
        }
    };
    const handlePlotChange = e => {
        setPlot(e.target.value);
        if (plotError.error) {
            if (e.target.value.trim().length !== 0) {
                setPlotError({'error': false, 'errorType': null});
            }
        }
    };
    const handleNumberOfUsersChange = e => {
        setNumberOfUsers(e.target.value)
        if (Number(e.target.value) - 1 < numberOfMale + numberOfFemale) {
            setNumberOfFemale(0)
            setNumberOfMale(0)
        }
        
    };
    const handleLanguageChange = e => setLanguage(e.target.value);
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const handleNumberOfFemaleUp = () => {
        if(numberOfFemale + numberOfMale < Number(numberOfUsers) - 1) {
            setNumberOfFemale(prev => prev + 1)
        }
       
    }

    const handleNumberOfFemaleDown = () => {
        if (numberOfFemale > 0) {
            setNumberOfFemale(prev => prev - 1)
        }
        
    }

    const handleNumberOfMaleUp = () => {
        if(numberOfMale + numberOfFemale < Number(numberOfUsers) - 1) {
            setNumberOfMale(prev => prev + 1)
        }
    }

    const handleNumberOfMaleDown = () => {
        if (numberOfMale > 0) {
            setNumberOfMale(prev => prev - 1)
        }
        
    }

    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();

        if ((title.trim().length === 0 || title.length > 30) || plot.trim().length === 0) {

            if (title.trim().length === 0 ) {
                setTitleError({'error': true, 'errorType': 'empty'})
            } else if (title.length > 30) {
                setTitleError({'error': true, 'errorType': 'maxLength'})
            }
    
            if (plot.trim().length === 0) {
                setPlotError({'error': true, 'errorType': 'empty'})
            }

        } else {
            dispatch(validTokenRequiredFetch(createStory(encodeURI(title), encodeURI(plot), numberOfUsers, language, numberOfFemale, numberOfMale, characterList, history)))
        }
        
    }

    const selectedCharacters = characters.filter(character => characterList.includes(character.id))

    return ReactDOM.createPortal((
        <div className='backdrop'>
            <div className='modal'>
                <form onSubmit={handleSubmit} className='create-story-form'>
                    <section className='create-story-inputs-wrap'>
                        <div>
                            <input value={title} onChange={handleTitleChange} placeholder='Tytuł' type="text" className='form-input'/>
                            {titleError.error ? 
                            <p className='validation-error'>
                                {titleError.errorType === 'empty' ?
                                'to pole nie może być puste' 
                                : 'tytuł nie może być dłuższy niż 30 znaków'}
                            </p> 
                            :  null}
                        </div>
                        <div>
                            <textarea value={plot} onChange={handlePlotChange} placeholder='Fabuła' cols="30" rows="10" className='form-input'></textarea>
                            {plotError.error ? <p className='validation-error'>to pole nie może być puste</p> :  null}
                        </div>
                        <div>
                            <p>Liczba osób w historyjce</p>
                            <hr className='divider-solid'/>
                            <div className='number-of-users-in-story-wrap'>
                                <input type="radio" className='hide' name="number-of-users" id="number-2" value="2" checked={numberOfUsers === "2"} onChange={handleNumberOfUsersChange}/>
                                <label htmlFor="number-2" className='create-story-label-number'>2</label>

                                <input type="radio" className='hide' name="number-of-users" id="number-3" value="3" checked={numberOfUsers === "3"} onChange={handleNumberOfUsersChange}/>
                                <label htmlFor="number-3" className='create-story-label-number'>3</label>

                                <input type="radio" className='hide' name="number-of-users" id="number-4" value="4" checked={numberOfUsers === "4"} onChange={handleNumberOfUsersChange}/>
                                <label htmlFor="number-4" className='create-story-label-number'>4</label>

                                <input type="radio" className='hide' name="number-of-users" id="number-5" value="5" checked={numberOfUsers === "5"} onChange={handleNumberOfUsersChange}/>
                                <label htmlFor="number-5" className='create-story-label-number'>5</label>
                            </div>
                        </div>
                        <div>
                            <p>Język historyjki i minimalna liczba osób danej płci w historyjce</p>
                            <hr className='divider-solid'/>
                            {/* <div>
                                <p>*</p>
                            </div> */}
                            <div className='create-story-language-gender-wrap'>
                                <div className='number-of-male-and-female-wrap'>
                                    <div className='number-of-female-wrap'>
                                        <h4>Liczba kobiet</h4>
                                        <div className='number-of-gender-counter-wrap'>
                                            <div className='gender-counter'>
                                                <span>{numberOfFemale}</span>
                                            </div>
                                            <div className='gender-counter-buttons-wrap'>
                                                <button type='button' onClick={handleNumberOfFemaleUp}>
                                                <span className="material-icons">keyboard_arrow_up</span>
                                                </button>
                                                <button type='button' onClick={handleNumberOfFemaleDown}>
                                                    <span className="material-icons">keyboard_arrow_down</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='number-of-male-wrap'>
                                        <h4>Liczba mężczyzn</h4>
                                        <div className='number-of-gender-counter-wrap'>
                                            <div className='gender-counter'>
                                                <span>{numberOfMale}</span>
                                            </div>
                                            <div className='gender-counter-buttons-wrap'>
                                                <button type='button' onClick={handleNumberOfMaleUp}>
                                                    <span className="material-icons">keyboard_arrow_up</span>
                                                </button>
                                                <button type='button' onClick={handleNumberOfMaleDown}>
                                                    <span className="material-icons">keyboard_arrow_down</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='create-story-language-wrap'>
                                    <span>Język: </span>
                                    <select className="create-story-language-select" value={language} onChange={handleLanguageChange}>
                                        <option value="PL">PL</option>
                                        <option value="EN">EN</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>Postacie dodatkowe</p>
                            <hr className='divider-solid'/>
                            <div className='additional-characters'>
                                {selectedCharacters.map(character => <AdditionalCharacter key={character.id} {...character}/>)}
                                <button type='button' onClick={handleModalOpen} className="add-additional-character">
                                    <span className="material-icons">add</span>
                                </button>
                            </div>
                        </div>
                    </section>
                    <section className='create-or-cancel-wrap'>
                        <button className='flat-button' onClick={close} type='button'>anuluj</button>
                        <button className='button-style'  type='submit'>Stwórz</button>
                    </section>
                </form>
            </div>
            {isModalOpen ? <SelectAdditionalCharacters close={handleModalClose} setCharacterList={setCharacterList} characterList={characterList}/> : null}
        </div>

    ),document.body)
}

export default CreateStoryForm;