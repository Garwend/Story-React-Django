const isExpired = (exp) => {
    const dateNow = Math.round(Date.now() / 1000);

    if (dateNow >= Number(exp)) {
        return true;
    } else {
        return false;
    }
    
}

export default isExpired;