






export default getHome = async () => {
    let requestOptions = {
        method: 'GET',
        headers: {
            "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk2MTc3MTIwLCJpYXQiOjE2NTc0Njk5MjAsImp0aSI6ImFhN2YzM2IzMmY2NjQ2NzA4NjExZGQwODE4N2VlYjNjIiwidXNlcl9pZCI6Mn0.3klfhlkpTIAfaed5Id8OaKWLPbPxbRiD3EKRLqVClxU"
        },
    };
    try {
        const response = await fetch('http://localhost:8000/api/home/', requestOptions);
        const json = await response.json();
        console.log("Homes", json);
        return json;
    } catch (error) {
        console.error("Homes error", error);
    }


    // fetch("localhost:8000/api/home/", requestOptions)
    // .then(response => response.json())
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error));
};


