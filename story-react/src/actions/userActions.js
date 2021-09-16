import { setGlobalError } from "./errorActions";
import isExpired from "../helpers/isExpired";

export const SET_USER = 'SET_USER';
export const LOGOUT = 'LOGOUT';

export const setUser = (payload) => ({
    type: SET_USER,
    payload: payload,
})

export const logoutUser = (payload) => ({
    type: LOGOUT,
    payload: payload,
})

export const registerUser = (username, email, password, gender, setUsernameError, setEmailError, setIsSubmitted) => (dispatch) => {
    const data = JSON.stringify({query: `
    mutation {
        createUser(username:"${username}",email:"${email}",password:"${encodeURI(password)}",gender: ${gender}) {
          success
          user {
            id
          }
          validationError
        }
      }
    `
    })

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
                dispatch(setGlobalError());
            } else {
                if (data.data.createUser.success) {
                    console.log('LOGIN')
                    dispatch(fetchLoginUser(username, password))
                }else {
                    setIsSubmitted(false)
                    const validationErrors = JSON.parse(data.data.createUser.validationError)
                    console.log(validationErrors)
                    if (validationErrors.username !== undefined) {
                        if (validationErrors.username[0] === "A user with that username already exists.") {
                            setUsernameError({'error':true, 'errorType':'exists'})
                        }
                    }

                    if (validationErrors.email !== undefined) {
                        if (validationErrors.email[0] === "User with this Email address already exists.") {
                            setEmailError({'error':true, 'errorType':'exists'})
                        }
                    }
                }
            }   

            
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const deleteToken = () => (dispatch) => {
    const data = JSON.stringify({query: 'mutation {deleteTokenCookie { deleted } }'})

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
                dispatch(setGlobalError());
            } else {
                dispatch(logoutUser())
            }
            
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}

export const refreshToken = (func = null) => (dispatch) => {
    const data = JSON.stringify({query: 'mutation { refreshToken { payload refreshExpiresIn refreshToken } }'})

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
                dispatch(logoutUser())
            } else {
                dispatch(setUser(data.data.refreshToken.payload.user))
                localStorage.setItem('exp', data.data.refreshToken.payload.exp)
                if (func !== null) {
                    dispatch(func)
                }
            }
            
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const deleteRefreshToken = () => (dispatch) => {
    const data = JSON.stringify({query: 'mutation {deleteRefreshTokenCookie { deleted } }'})

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
                dispatch(setGlobalError());
            } else {
                dispatch(deleteToken())
            }
            
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const revokeToken = () => (dispatch) => {
    const data = JSON.stringify({query: 'mutation { revokeToken { revoked } }'})

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            console.log(data)
            if (data.errors !== undefined) {
                if (data.errors[0].message === 'Invalid refresh token') {
                    dispatch(deleteRefreshToken())
                    localStorage.setItem('exp', 0)
                }

            }else {
                console.log(data.data.revokeToken.revoked)
                dispatch(deleteRefreshToken())
                localStorage.setItem('exp', 0)
            }

        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const fetchLoginUser = (username, password, handleInvalidUsernameOrPassworError = null, handleOpenModal = null, setBanLeftTime = null) => (dispatch) => {
    const data = JSON.stringify({query: `
        mutation {
            tokenAuth(username:"${username}", password: "${encodeURI(password)}") {
                token
                payload
                refreshExpiresIn
            }
        }
        `
        })

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            console.log(data)
            if (data.errors !== undefined) {
                if (handleInvalidUsernameOrPassworError !== null) handleInvalidUsernameOrPassworError();
            } else {
                if (data.data.tokenAuth.payload.user.is_banned) {
                    console.log('banned')
                    if (handleOpenModal !== null) handleOpenModal();
                    if (setBanLeftTime !== null) setBanLeftTime(data.data.tokenAuth.payload.user.ban_left_time);
                    dispatch(revokeToken());
                }else {
                    dispatch(setUser(data.data.tokenAuth.payload.user));
                    localStorage.setItem('exp', data.data.tokenAuth.payload.exp)
                }
               
            }
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
    
};

export const updateUser = (formData, close) => (dispatch) => {

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
                dispatch(setGlobalError());
            } else {
                const user = data.data.updateUser.user;
                user.profile_image = user.imageUrl;
                delete user.imageUrl;
                dispatch(setUser(user));
                close();
            }
            
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}

export const checkUser = () => (dispatch) => {
    const data = JSON.stringify({query: `mutation { verifyToken { payload } }`
    })
    
    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            console.log(isExpired(localStorage.getItem('exp')))
            if (data.errors !== undefined) {
                dispatch(refreshToken());
            } else {
                dispatch(setUser(data.data.verifyToken.payload.user))
            }
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const validTokenRequiredFetch = (func) => (dispatch) => {
    console.log('valid check')
    if (isExpired(localStorage.getItem('exp'))) {
        dispatch(refreshToken(func));
        console.log('refreh before fetch')
    } else {
        dispatch(func)
    }
}

export const changePassword = (password, newPassword, newPassword2, setWrongPasswordError, setIsPasswordChanged) => (dispatch) => {
    const data = JSON.stringify({query: `
        mutation {
            changePassword (password: "${encodeURI(password)}", newPassword:"${encodeURI(newPassword)}", newPassword2:"${encodeURI(newPassword2)}") {
            success
            wrongPassword
            }
        }
    `})
    setIsPasswordChanged(false)

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
                dispatch(setGlobalError());
                setIsPasswordChanged(null);
            }else {
                if (data.data.changePassword.success) {
                    setIsPasswordChanged(true)
                    setTimeout(() => {
                        dispatch(revokeToken())
                    }, 1000);
                }else {
                    setIsPasswordChanged(null)
                    if (data.data.changePassword.wrongPassword) setWrongPasswordError(true)
                }
            }
            
        },
        (error) => {
            setIsPasswordChanged(null)
            dispatch(setGlobalError());
        }
    )
    
}

export const forgotPassword = (email, setIsEmailSent, setError) => (dispatch) => {
    const data = JSON.stringify({query: `mutation { forgotPassword(email:"${email}") { success } }`})
    setIsEmailSent(false)
    
    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            console.log(data)
            if (data.errors !== undefined) {
                setIsEmailSent(null)
                dispatch(setGlobalError())
            }else {
                if (data.data.forgotPassword.success) {
                    setIsEmailSent(true)
                } else {
                    setError(true)
                    setIsEmailSent(null)
                }
            }
            
        },
        (error) => {
            setIsEmailSent(null)
            dispatch(setGlobalError());
        }
    )
}

export const checkResetPasswordToken = (uid, token, setIsTokenValid) => (dispatch) => {
    const data = JSON.stringify({query: `
    mutation {
        checkResetPasswordToken(uid:${uid}, token: "${token}") {
        valid
        }
    }
`})

fetch('http://localhost:8000/api/graphql', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    credentials: 'include',
    body: data,
})
.then(data => data.json())
.then(
    data => {
        if (data.errors !== undefined) {
            dispatch(setGlobalError());
        } else {
            setIsTokenValid(data.data.checkResetPasswordToken.valid);
        }
        
    },
    (error) => {
        console.log(error)
        dispatch(setGlobalError());
    }
)
}

export const resetPassword = (uid, token, password, password2, setIsPasswordChanged) => (dispatch) => {
    const data = JSON.stringify({query: `
        mutation {
            resetPassword(uid:${uid}, token: "${token}", password: "${encodeURI(password)}", password2:"${encodeURI(password2)}") {
            success
            }
        }
    `})

    setIsPasswordChanged(false)
    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            } else {
                if (data.data.resetPassword.success) {
                    setIsPasswordChanged(true)
                } else {
                    setIsPasswordChanged(null)
                }
            }
            
            
        },
        (error) => {
            setIsPasswordChanged(null);
            dispatch(setGlobalError());
        }
    )
}

export const reportUser = (reason, reportedUserId, setIsReported, close) => (dispatch) => {
    const data = JSON.stringify({query: `
    mutation {
        reportUser(reason: "${reason}", reportedUserId: ${reportedUserId}) {
          success
        }
      }
    `})
    setIsReported(false)
    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            console.log(data)
            if (data.errors !== undefined) {
                dispatch(setGlobalError());
                setIsReported(null)
            } else {
                if (data.data.reportUser.success) {
                    setIsReported(true)
                    close();
                }else {
                    dispatch(setGlobalError);
                    setIsReported(null)
                }
            }
        },
        (error) => {
            dispatch(setGlobalError());
            setIsReported(null)
        }
    )

}

