import React from 'react';
import { useDispatch, useSelector} from "react-redux";
import { removeError } from "../../actions/errorActions";
import "./ErrorSnackbar.css";

const ErrorSnackbar = () => {
    const error = useSelector(state => state.errorReducer.error)
    const dispatch = useDispatch();

    if (error) {
        return (
            <div className='error-snackbar'>
                <p>Wystąpił nieznany błąd</p>
                <button className='close-error-snackbar-btn' onClick={() => dispatch(removeError())}>
                    <span className="material-icons">close</span>
                </button>
            </div>
        )
    } else {
        return null
    }
    
}

export default ErrorSnackbar;