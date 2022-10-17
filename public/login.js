let url = 'http://demez.asuscomm.com:3000'

function validateEmail(email){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      );
}

async function validatePassword(email, password){

    let data = 
    {
        "email_address" : email,
        "password" : password
    }

    const response = await fetch(url + '/login', {
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
        let response = await validatePassword(email, password);
        console.log("Response: " + response);
        console.log(response);
        if (response.status == 200){
            alert('Password is correct');
        }else{
            alert('Password is incorrect');
        }
    }
}