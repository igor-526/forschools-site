try {

    // код...

} catch (err) {

    console.log(err)

}

async function instructionsAPIGetAll(role=null){
    let url = "/api/instructions/"
    if (role){
        url += `?role=${role}`
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