function validateEmail(email){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      );
};

function submit(){
    console.log('submit');

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    console.log("Email: " + email + " Password: " + password)

    let a = document.getElementById('email');

    if(!validateEmail(email)){
        a.setAttribute('style', 'border-bottom: 2px solid rgb(209, 0, 0);  box-shadow: 0px 4px 0px 0px rgb(100, 0, 0);')
    }else{
        a.setAttribute('style', 'border-bottom: 1px solid #fff');
    }
    console.log("Validate email result: " + validateEmail(email));
}
