let container = document.getElementById("post-container");
let token = localStorage.getItem("token");
let CurrentUser

async function validateToken() {

    let response = await fetch("http://localhost:5000/validateToken", {
        method: "GET",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${token}`
        }
    })

    let result = await response.json();
    // console.log(result);


    if (result.status) {
        if (result.data.length <= 0) {
            document.getElementById("msg").innerHTML = `If there are no posts to display, create a new post by <a href="create-post.html">clicking here</a>.`
        }
        else {
            // console.log(result);

            let postData = result.data;
            console.log(postData);
            console.log(result.payload.username);
            CurrentUser=result.payload.username
            
            document.getElementById("userId").innerText = result.payload.username
            // console.log(result);

            postData.map((post, index) => {

                let div = document.createElement("span");

                div.setAttribute("id", `${post.username}_${index + 1}`);
                div.setAttribute("class", "postBlocks");

                div.innerHTML = `
                <h1>${post.category} : ${post.title}</h1>
                <hr>
                <p>Content: ${post.content}</p>
                <hr>
                <span>
                    <p><b>Author : </b> ${post.author}</p>
                    <p><b>Created On: </b> ${post.created_On}</p>
                </span>
                <br>
                <button onclick ="editPost('${post._id}')">Edit</button>
                <button onclick ="deletePost('${post._id}')">Delete</button>
                <br>
                <button id="likePostBtn_${post._id}" onclick="likePost('${post._id}','${result.payload.username}')">
    Likes: <span id="updatelike_${post._id}">${post.likes.length}</span>
</button>
                `;

                container.appendChild(div);
                return;
            })

        }
    } else {
        alert(result.msg);
        window.location.href = "login.html"
    }
}

function createPostPage() {
    window.location.href = "create-post.html"
}


async function handleAuthorPost(event) {
    let authorName = event.target.value;
    if (authorName == "") {
        document.getElementById("msg").innerText = "Enter valid Author Name";
        window.location.reload();
    } else {
        document.getElementById("msg").innerText = "";
    }

    let response = await fetch(`http://localhost:5000/author/${authorName}`, {
        method: "GET",
        headers: { 'Content-type': 'application/json' }
    })
    let result = await response.json();
    console.log(result);

    if (result.status) {
        container.innerHTML = ""
        let postData = result.data;

        postData.map((post, index) => {

            let div = document.createElement("span");

            div.setAttribute("id", `${post.username}_${index + 1}`);
            div.setAttribute("class", "postBlocks");

            div.innerHTML = `
        <h1>${post.category} : ${post.title}</h1>
        <hr>
        <p>Content: ${post.content}</p>
        <hr>
        <span>
            <p><b>Author : </b> ${post.author}</p>
            <p><b>Created On: </b> ${post.created_On}</p>
        </span>
        <br>
        <button onclick ="editPost('${post._id}')">Edit</button>
        <button onclick ="deletePost('${post._id}')">Delete</button>
        <br>
        <button id="likePostBtn" onclick = "likePost('${post._id}','${post.username}')">Likes: <span id="updatelike">${post.likes.length}</span></button>
        
        
        `;

            container.appendChild(div);
        })
    } else {
        document.getElementById("msg").innerText = result.msg;
    }

}


function editPost(id) {
    localStorage.setItem("editpostId", id);
    window.location.href = "edit-post.html";
    // console.log(id);
}

async function deletePost(id) {
    // console.log(id);

    let response = await fetch(`http://localhost:5000/deletePost/${id}`, {
        method: "DELETE",
        headers: { 'Content-type': 'application/json' }
    })

    let result = await response.json();
    // console.log(result);

    if (result.status) {
        alert(result.msg);
        window.location.reload();
    } else {
        alert("There's some problem in deleting the post.");
        window.location.reload();
    }
}

async function likePost(postId, userName) {
    let response = await fetch(
        `http://localhost:5000/likePost/${postId}/${userName}`,
        {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }
    );
    let result = await response.json();
    console.log(result);

    if (result.status) {
        document.getElementById(`updatelike_${postId}`).textContent = result.likesCount;

    } else {
        console.log(result.msg);
        document.getElementById(`updatelike_${postId}`).textContent = result.likesCount;
    }
}
async function ShowpostsByCurrentuser(){
    let response =await fetch(`http://localhost:5000/showCurrentUserpost/${CurrentUser}`,
        {
            method:"GET",
            headers:{
                'Content-type':'application/json',
                'Authorization': `Basic ${token}`
            }
        }
    )

    let result = await response.json();
    console.log(result);
    if (result.status) {
        container.innerHTML = ""
        let postData = result.data;

        postData.map((post, index) => {

            let div = document.createElement("span");

            div.setAttribute("id", `${post.username}_${index + 1}`);
            div.setAttribute("class", "postBlocks");

            div.innerHTML = `
        <h1>${post.category} : ${post.title}</h1>
        <hr>
        <p>Content: ${post.content}</p>
        <hr>
        <span>
            <p><b>Author : </b> ${post.author}</p>
            <p><b>Created On: </b> ${post.created_On}</p>
        </span>
        <br>
        <button onclick ="editPost('${post._id}')">Edit</button>
        <button onclick ="deletePost('${post._id}')">Delete</button>
        <br>
        <button id="likePostBtn" onclick = "likePost('${post._id}','${post.username}')">Likes: <span id="updatelike">${post.likes.length}</span></button>
        
        
        `;

            container.appendChild(div);
        })
    } else {
        document.getElementById("msg").innerText = result.msg;
    }

    
}


// ADD the FOLLOW / UNFOLLOW functionality to the users who created the post