let userObj = {};

function handleChange(event) {
    userObj[event.target.id] = event.target.value;
}

async function register(event) {
    event.preventDefault();
    let response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userObj)
    });

    if (response.ok) {
        let result = await response.json();
        console.log("Registration successful:", result);
    } else {
        console.error("Registration failed");
    }
    console.log(userObj);
}

function handlePass(event) {
    let prevPass = userObj.password;
    let cnfPass = event.target.value;
    if (prevPass == cnfPass) {
        document.getElementById("message").innerHTML = "pass word matched";
        document.getElementById("registerbtn").disabled = false;
    } else {
        document.getElementById("message").innerHTML = "Confirm password should match with password";
        document.getElementById("registerbtn").disabled = true;
    }
}