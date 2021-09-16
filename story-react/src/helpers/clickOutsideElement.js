const clickOutsideElement = (e, element) => {
    if (element === null) return

    let targetElement = e.target

    do {
        if (targetElement === element) {
            return false;
        }

        targetElement = targetElement.parentNode;
    } while(targetElement)

    return true
}

export default clickOutsideElement;