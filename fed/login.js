let userObj = {};

function handleChange(event) {
    userObj[event.target.id] = event.target.value;
}

async function login(event) {
    event.preventDefault();
    let response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userObj)
    });

    if (response.ok) {
        let result = await response.json();
        console.log("Login successful:", result.token);
        localStorage.setItem("token", result.token);
        window.location.href='view-post.html'
    } else {
        console.error("Invalid failed");
        document.getElementById("msg").innerHTML="invalid username and password"
    }
    console.log(userObj);

}

