export const SET_ERROR = 'SET_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';

export const setGlobalError = () => ({
    type: SET_ERROR,
})

export const removeError = () => ({
    type: REMOVE_ERROR,
})

export const reportError = (errorDescription, close) => (dispatch) => {
    const data = JSON.stringify({query: `
    mutation {
        reportError(errorDescription: "${encodeURI(errorDescription)}",) {
          success
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
            console.log(data)
            if (data.errors !== undefined) {
                dispatch(setGlobalError());
            } else {
                if (data.data.reportError.success) {
                    close();
                }else {
                    dispatch(setGlobalError);

                }
            }
        },
        (error) => {
            dispatch(setGlobalError());

        }
    )
}