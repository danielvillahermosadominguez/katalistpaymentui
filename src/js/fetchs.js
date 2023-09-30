const urlBase =  "https://katalistpaymentservice.azurewebsites.net";
const urlBaseLocal =  "http://localhost:8080";
export async function post(url, json){
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: json
        })

        if (!response.ok) {
            let status = await response.status
            if (status !== 200) {
                let body = await response.json()
                return {
                    error: true,
                    code: body.code,
                    item: null
                };                
            }
        } else {
            return {
                error: false,
                code: -1,
                item: null
            };
        }
    } catch (error) {
        return {
            error: true,
            code: -2,
            item: null
        };    
    }
}

export 
async function getCourse(courseId) {
    console.log("GET COURSE - REAL!!!!!!")
    let url = urlBase +"/courses/" + courseId
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET",
        })
        if (!response.ok) {
            const body = await response.json()
            return {
                error: true,
                code: body.code,
                item: null
            };
        }
        const course = await response.json()        
        
        return {
            error: false,
            code: -1,
            item: course
        };
    } catch (error) {
        return {
            error: true,
            code: -2,
            item: null
        };
    }
}