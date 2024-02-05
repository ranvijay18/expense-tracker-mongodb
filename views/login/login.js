const form = document.getElementById('loginForm');
const sign = document.getElementById("btnSign");


sign.addEventListener('click', () => {
    window.location.href = "../sign/sign.html";
})

form.addEventListener('submit' , check);

async function check(e){
      
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;


    if(password != confirmPassword){
        console.log("Mismatch in Password");
    }else{


    const obj = {
        email,
        password
    }

    const res = await axios.post('http://localhost:8000/login', obj);

    const data = res.data.status;
    const tokenData = res.data.token;
    localStorage.setItem("token", tokenData);
    localStorage.setItem("row", 5);

    if(data === true){
        // alert("User is Logged In");
        window.location.replace("../expense/index.html");
    }else if(data === false){
        console.log("Wrong Password");
    }else{
        console.log("User not found")
    }
}
}