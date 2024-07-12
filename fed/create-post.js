let postObj = {};
let token = localStorage.getItem("token");

function handleInput(event) {
    postObj[event.target.id] = event.target.value;
}
async function validateToken() {
    let token = localStorage.getItem("token");

    let response = await fetch("http://localhost:5000/validateToken", {
        method: "GET",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${token}`
        }
    })

    let result = await response.json();
    console.log(result);
    
    if(!result.status){
        // alert(result.msg);
        window.location.href = "login.html"
    }else{
        // window.location.href= "create-post.html"
    }
}
async function createPost(event) {
    event.preventDefault();
    validateToken();

    let response = await fetch("http://localhost:5000/createPost", {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${token}`
        },
        body: JSON.stringify(postObj)
    });

    let result = await response.json();
    console.log(result);
    window.location.href="view-post.html"
}