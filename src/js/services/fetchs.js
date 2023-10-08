import { urlBase } from '../config/config.js'
import { NO_SERVER_CONNECTION } from './errors.js'


async function post(url, json) {
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
            let body = await response.json()
            return {
                error: false,
                code: -1,
                item: body
            };
        }
    } catch (error) {
        return {
            error: true,
            code: NO_SERVER_CONNECTION,
            item: null
        };
    }
}

export async function executeSubscription(json) {
    let url = urlBase + "/subscription"
    return await post(url, json);
}
export async function getCourse(courseId) {
    let url = urlBase + "/courses/" + courseId
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
