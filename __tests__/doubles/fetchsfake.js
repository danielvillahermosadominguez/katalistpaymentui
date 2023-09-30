export async function post(url, json){
   
}

export async function getCourse(courseId) {
    console.log("GET COURSE - FAKE!!!!!!")
    return  {
        error: false,
        code: 0,
        item: {
            name: 'fake name',
            price: 100.5
        }
    };
}