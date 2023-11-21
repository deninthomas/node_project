


let usernameoutline = document.getElementById('userName');
let passwordoutlineOne = document.getElementById('loginPasswordOne');
let passwordoutline = document.getElementById('loginPassword');
let loginBox = document.getElementById('loginBox');

var empreg = document.getElementById('regmdl')
empreg.addEventListener('click', (e) => {
    e.preventDefault()

    var username = document.getElementById('userName').value;
    var password = document.getElementById('loginPassword').value;
    var confirmPswd = document.getElementById("loginPasswordOne").value;

    var newreg = {
        username: username,
        password: password
    }

    console.log(newreg)
    if (!username || !password || !confirmPswd) {

        let alertbox = document.getElementById('alertbox');

        alertbox.classList.remove('hide');
        alertbox.classList.add('show');

        alertbox.innerHTML = `<p class="alertsession requiredAlert">The fields can't be empty</p>`;

        usernameoutline.classList.remove('removeborder');
        passwordoutlineOne.classList.remove('removeborder');
        passwordoutline.classList.remove('removeborder');

        usernameoutline.classList.add('showborder');
        passwordoutlineOne.classList.add('showborder');
        passwordoutline.classList.add('showborder');

        return false;
    }
    else if(password!=confirmPswd){
        alertbox.innerHTML = `<p class="alertsession requiredAlert">password doesn't match</p>`;
        passwordoutlineOne.classList.remove('removeborder');
        passwordoutline.classList.remove('removeborder');

        passwordoutlineOne.classList.add('showborder');
        passwordoutline.classList.add('showborder');
    }
    else {
        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(newreg)
        })

            .then((res) => {
                if (res.ok) {
                    // alert('Account created successfully');

                    // Redirect to the login page
                    // window.location.href = "/login";
                    console.log('created account')

                    loginBox.innerHTML="";
                    let otp = "";
                    otp +=`   <div id="emailVerification">
                    <div class="emailTitle">
                        <i class="material-symbols-outlined mailLogo">
                            mail
                        </i>
                        <header class="fw-bold">VERIFY YOUR EMAIL ADDRESS</header>
                    </div>
                    <hr>
                    <div class="emailTitle">
                        <p>A verification code has been sent to</p>
                        <p class="fw-bold">${username}</p>
                    </div>
                    <p class="emailDef">Please check your inbox and enter the verification code below to verify your
                        email address.The code will expire in <span id="time"></span></p>
                    <div class="otpButton">
                        <div class="otpinput">
                            <input type="text" class="form-control" id="signupOtp" placeholder="enter otp"
                                maxlength="4">
                        </div>
                        <div class="otpinput">
                            <button class="otpBtn btn">Confirm</button>
                        </div>
                        <div class="otpinput resendOtp">
                            <a href="#">Resend OTP</a>
                            <a href="#">Change mail</a>
                        </div>
                    </div>
                </div>`;
                loginBox.innerHTML = otp;

                } else {
                    return res.json().then((err) => {

                        console.log('user already exists');

                        let alertbox = document.getElementById('alertbox');

                        alertbox.classList.remove('hide');
                        alertbox.classList.add('show');

                        alertbox.innerHTML = `<p class="alertsession requiredAlert">User already exists</p>`;

                        usernameoutline.classList.remove('removeborder');
                        usernameoutline.classList.add('showborder');
                    });
                }

            })


    }

})

function removeborders() {
    let alertbox = document.getElementById('alertbox');

    alertbox.classList.add('hide');
    alertbox.classList.remove('show');

    alertbox.innerHTML = "";

    let usernameoutline = document.getElementById('userName');
    let passwordoutline = document.getElementById('loginPassword');

    usernameoutline.classList.add('removeborder');
    passwordoutlineOne.classList.add('removeborder');
    passwordoutline.classList.add('removeborder');

    usernameoutline.classList.remove('showborder');
    passwordoutlineOne.classList.remove('showborder');
    passwordoutline.classList.remove('showborder');
}

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

  
// function startTimer(duration, display) {
//     var timer = duration, minutes, seconds;
//     setInterval(function () {
//         minutes = parseInt(timer / 60, 10);
//         seconds = parseInt(timer % 60, 10);

//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;

//         display.textContent = minutes + ":" + seconds;

//         if (--timer < 0) {
//             timer = duration;
//         }
//     }, 1000);
// }

// window.onload = function () {
//     var fiveMinutes = 60 * 5,
//         display = document.querySelector('#time');
//     startTimer(fiveMinutes, display);
// };