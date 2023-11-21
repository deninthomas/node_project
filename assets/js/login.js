function passwordVisibility() {
    var paswdLock = document.getElementById("loginPassword");
    let lock = document.getElementById('lock');
    let lockOpen = document.getElementById('lockOpen');
    if (paswdLock.type === "password") {
        lock.style.display = 'none';
        lockOpen.style.display = 'block';
        paswdLock.type = "text";
    } else {
        lockOpen.style.display = 'none';
        lock.style.display = 'block';
        paswdLock.type = "password";
    }
}



var emplog = document.getElementById('loginButton');
emplog.addEventListener('click', (e) => {
    e.preventDefault()

    var username = document.getElementById('userName').value;
    var password = document.getElementById('loginPassword').value;

    var loggedin = {
        username: username,
        password: password
    }

    console.log(loggedin)
    if (!username || !password) {

        console.log("fields cant be empty");
        return false;
    }

    else {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(loggedin)
        })

            .then((res) => {
                console.log(res);
                if (res.ok) {
                    console.log('logged in')
                    window.location.href="/";
                } else {
                    return res.json().then((err) => {
                        console.log('invalid request');
                    });
                }

            })

    }

})

