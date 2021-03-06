import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { registerUser } from "../../actions/userActions";
import './RegisterForm.css';

const RegisterForm  = () => {
    const [username,setUsername] = useState('');
    const [usernameError,setUsernameError] = useState({'error': false, 'errorType': null});
    const [email,setEmail] = useState('');
    const [emailError,setEmailError] = useState({'error': false, 'errorType': null});
    const [password,setPassword] = useState('');
    const [passwordError,setPasswordError] = useState({'error': false, 'errorType': null});
    const [gender, setGender] = useState('1');
    
    const [isSubmitted, setIsSubmitted] = useState(false);

    const usernameRegex = /^(?!.*\.\.)(?!.*--)(?!.*__)[a-zA-Z0-9]+[a-zA-Z0-9._-]*$/
    
    const handleUsernameChange = e => {
        if(usernameError.error) {
            if (usernameError.errorType === 'empty' && e.target.value.trim().length !== 0) {
                setUsernameError({'error': false, 'errorType': null})
            } else if (usernameError.errorType === 'exists') {
                setUsernameError({'error': false, 'errorType': null})
            } else if (usernameError.errorType === 'maxLength' && e.target.value.length <= 24) {
                setUsernameError({'error': false, 'errorType': null})
            } else if (usernameError.errorType === 'regexError' && usernameRegex.test(e.target.value)) {
                setUsernameError({'error': false, 'errorType': null})
            }
        }

        setUsername(e.target.value);
    };
    
    const handleEmailChange = e => {
        if(emailError.error) {
            if (emailError.errorType === 'empty' && e.target.value.trim().length !== 0) {
                setEmailError({'error': false, 'errorType': null})
            } else if (emailError.errorType === 'exists') {
                setEmailError({'error': false, 'errorType': null})
            }
        }   

        setEmail(e.target.value);
    };
    
    const handlePasswordChange = e => {
        if(passwordError.error) {
            if (passwordError.errorType === 'empty' && e.target.value.length !== 0) {
                setPasswordError({'error': false, 'errorType': null})
            }else if (passwordError.errorType === 'minLength' && e.target.value.length >= 8) {
                setPasswordError({'error': false, 'errorType': null})
            }
        }
        
        setPassword(e.target.value);
    };

    const handleGenderChange = e => setGender(e.target.value)

    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();

        if ((username.trim().length === 0 || !usernameRegex.test(username) || username.length > 24) || email.trim().length === 0 || (password.length === 0 || password.length < 8)) {
            console.log('check')
            if (username.trim().length === 0) {
                setUsernameError({'error': true, 'errorType': 'empty'})
            } else if (!usernameRegex.test(username)) {
                setUsernameError({'error': true, 'errorType': 'regexError'})
            } else if (username.length > 24) {
                setUsernameError({'error': true, 'errorType': 'maxLength'})
            }

            if (email.trim().length === 0) {
                setEmailError({'error': true, 'errorType': 'empty'})
            }

            if (password.length === 0) {
                setPasswordError({'error': true, 'errorType': 'empty'})
            } else if (password.length < 8) {
                setPasswordError({'error': true, 'errorType': 'minLength'})
            }

        } else {
            console.log('check2')
            setIsSubmitted(true)
            dispatch(registerUser(username,email,password, gender, setUsernameError,setEmailError,setIsSubmitted))
        }
        
    }

    const handleSubmitDisabled = e => {
        e.preventDefault();
        console.warn('REJESTRACJA NIE JEST JESZCZE DOST??PNA');
    }

    return (
        <div onSubmit={handleSubmitDisabled} className='register-wrap'>
            <h3 style={{textAlign:'center', color:'red', marginBottom:'4px'}}>Rejestracja nie jest jeszcze dost??pna</h3>
            <form className='register-form'>
                <div className='form-input-wrap'>
                    <input value={username} onChange={handleUsernameChange} placeholder='Nazwa u??ytkownika' type="text" className='form-input'/>
                    {usernameError.error ? 
                    <p className="input-error-message">
                        {usernameError.errorType === 'empty' ?
                        'to pole nie mo??e by?? puste'
                        : usernameError.errorType === 'exists' ?
                        'ta nazwa u??ytkownika jest ju?? zaj??ta'
                        :  usernameError.errorType === 'regexError' ?
                        `
                        nazwa u??ykownika:
                        - musi zaczyna?? si?? od litery lub cyfry
                        - mo??e zawiera?? litery, cyfry,  .,  _,  -
                        - dwa takie same znaki specjalne nie mog?? wyst??powa?? po sobie
                        ` 
                        : usernameError.errorType === 'maxLength' ?
                        'nazwa u??ytkownika nie mo??e by?? d??u??sza ni?? 24 znaki' 
                        : ''}
                    </p> 
                    : null}
                </div>

                <div className='form-input-wrap'>
                    <input autoComplete='chrome-off' value={email} onChange={handleEmailChange} placeholder='E-mail' type="email" className='form-input'/>
                    {emailError.error ? 
                    <p className="input-error-message">
                        {emailError.errorType === 'empty' ?
                        'to pole nie mo??e by?? puste'
                        : emailError.errorType === 'exists' ?
                        'ten email jest ju?? zaj??ty':
                        ''}
                    </p> 
                    : null}
                </div>

                <div className='form-input-wrap'>
                    <input value={password} onChange={handlePasswordChange} placeholder='Has??o' type="password" className='form-input'/>
                    {passwordError.error ? 
                    <p className="input-error-message">
                        {passwordError.errorType === 'empty' ?
                        'to pole nie mo??e by?? puste'
                        : passwordError.errorType === 'minLength' ?
                        'has??o musi zawiera?? przynajmniej 8 znak??w'
                        :''}
                    </p> 
                    : null}
                </div>
                
                <div className='form-gender-wrap'>
                    <label htmlFor="female">
                        <input type="radio" name="gender" id="female" checked={gender === '1'} value='1' onChange={handleGenderChange}/>
                        <span>Kobieta</span>
                    </label>

                    <label htmlFor="male">
                        <input type="radio" name="gender" id="male" checked={gender === '0'} value='0' onChange={handleGenderChange}/>
                        <span>M????czyzna</span>
                    </label>

                </div>
                
                <p className='register-info'>rejestruj??c si?? akceptujesz <Link to='/info/page'>regulamin</Link>, <Link to='/info/page/privacy/policy'>polityk?? prywatno??ci</Link> oraz <Link to='/info/page/cookies'>polityk?? plik??w cookie</Link></p>

                <button disabled={isSubmitted} className='button-style register-button' type="submit">
                    {isSubmitted ? <div className='register-spinner-loader'></div> : 'Zarejestruj si??'}
                </button>
            </form>
            <div className='register-form-bottom-part'>
                <span style={{color:'var(--font-color)'}}>Masz ju?? konto?</span> <Link to="/accounts/login">zaloguj si??</Link>
            </div>
        </div>
    );
};

export default RegisterForm;