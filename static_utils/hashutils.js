function hashUtilsGetHashValue(key) {
    const matches = location.hash.match(new RegExp(key + '=([^&]*)'))
    return matches ? matches[1] : null
}

function hashUtilsSetURL(obj) {
    const values = []
    Object.keys(obj).forEach(key => {
        if (obj[key])
            values.push(`${key}=${obj[key]}`)
    })
    window.location.hash = values.join("&")
}