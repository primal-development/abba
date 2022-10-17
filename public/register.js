let url = 'http://demez.asuscomm.com:3000'
let auth_code = null;

function validateEmail(email){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      );
};

async function sendRegistrationMail(email_address){
    let data = 
    {
        "recipient": email_address
    }

    const response = await fetch(url + '/sendRegistrationMail', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json();
}

async function submit(){
    console.log('submit');

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    console.log("Email: " + email + " Password: " + password)

    let a = document.getElementById('email');

    if(!validateEmail(email)){
        a.setAttribute('style', 'border-bottom: 2px solid rgb(209, 0, 0);  box-shadow: 0px 4px 0px 0px rgb(100, 0, 0);')
    }else{
        a.setAttribute('style', 'border-bottom: 1px solid #fff');
        auth_code = await sendRegistrationMail(email)
        console.log("Auth code: " + auth_code);
        // let s = document.getElementsByClassName('user-box');
        // let z = document.getElementsByClassName('auth_box');
        // s.setAttribute('style', 'visibility:hidden');
        // z.setAttribute('style', 'visibility:visible');
    }
}

async function createUser(athlete_name, lastname, email_address, password){
    let data = 
    {
        "athlete_name" : athlete_name,
        "athlete_lastname" : lastname,
        "email_address" : email_address,
        "password" : password
    }

    const response = await fetch(url + '/createUser', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response;
}


async function auth(){
    console.log("Auth code: " + auth_code);
    console.log("Auth code in html: " + document.getElementById('auth_input').value);
    if(document.getElementById('auth_input').value.toString() == auth_code){
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let athlete_name = document.getElementById('athlete_name').value;
        let lastname = document.getElementById('lastname').value;
        console.log("Authenticated");
        await createUser(athlete_name, lastname, email, password);
        location.href = url + '/login.html';
    }

}
