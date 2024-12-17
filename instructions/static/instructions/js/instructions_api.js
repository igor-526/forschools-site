async function instructionsAPIGetAll(roles=[], name=null,
                                     upload_start=null, upload_end=null,
                                     changed_start=null, changed_end=null){
    let url = "/api/instructions/"
    const queryParams = []

    roles.forEach(role => {
        queryParams.push(`role=${role}`)
    })

    if (name){
        queryParams.push(`name=${name}`)
    }

    if (upload_start){
        queryParams.push(`upload_start=${upload_start}`)
    }

    if (upload_end){
        queryParams.push(`upload_end=${upload_end}`)
    }

    if (changed_start){
        queryParams.push(`changed_start=${changed_start}`)
    }

    if (changed_end){
        queryParams.push(`changed_end=${changed_end}`)
    }

    if (queryParams.length > 0){
        url += "?" + queryParams.join("&")
    }

    let statusCode = null
    try {
        const request = await fetch(url)
        statusCode = request.status
        return {
            status: statusCode,
            response: await request.json()
        }
    } catch (err) {
        console.log(err)
        return {
            status: statusCode
        }
    }
}

async function instructionsAPIGetItem(instructionID){
    let statusCode = null
    try {
        const request = await fetch(`/api/instructions/${instructionID}/`)
        statusCode = request.status
        return {
            status: statusCode,
            response: await request.json()
        }
    } catch (err) {
        console.log(err)
        return {
            status: statusCode
        }
    }
}

async function instructionsAPICreate(fd){
    let statusCode = null
    try {
        const request = await fetch(`/api/instructions/`, {
        method: "POST",
        credentials: 'same-origin',
        headers:{
            "X-CSRFToken": csrftoken,
        },
        body: fd
    })
        statusCode = request.status
        return {
            status: statusCode,
            response: await request.json()
        }
    } catch (err) {
        console.log(err)
        return {
            status: statusCode
        }
    }
}

async function instructionsAPIUpdate(instructionID, fd){
    let statusCode = null
    try {
        const request = await fetch(`/api/instructions/${instructionID}/`, {
        method: "PATCH",
        credentials: 'same-origin',
        headers:{
            "X-CSRFToken": csrftoken,
        },
        body: fd
    })
        statusCode = request.status
        return {
            status: statusCode,
            response: await request.json()
        }
    } catch (err) {
        console.log(err)
        return {
            status: statusCode
        }
    }
}

async function instructionsAPIFilesGetAll(){
    let statusCode = null
    try {
        const request = await fetch("/api/instructions/files/")
        statusCode = request.status
        return {
            status: statusCode,
            response: await request.json()
        }
    } catch (err) {
        console.log(err)
        return {
            status: statusCode
        }
    }
}

async function instructionsAPIFilesGetItem(fileID, imgonly=true){
    let statusCode = null
    try {
        let url = `/api/instructions/files/${fileID}/`
        if (imgonly){
            url += "?imgonly=true"
        }
        const request = await fetch(url)
        statusCode = request.status
        return {
            status: statusCode,
            response: await request.json()
        }
    } catch (err) {
        console.log(err)
        return {
            status: statusCode
        }
    }
}

async function instructionsAPIFilesCreate(fd){
    let statusCode = null
    try {
        const request = await fetch(`/api/instructions/files/`, {
        method: "POST",
        credentials: 'same-origin',
        headers:{
            "X-CSRFToken": csrftoken,
        },
        body: fd
    })
        statusCode = request.status
        return {
            status: statusCode,
            response: await request.json()
        }
    } catch (err) {
        console.log(err)
        return {
            status: statusCode
        }
    }
}
