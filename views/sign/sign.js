const form = document.getElementById('signForm');
const login = document.getElementById('btnLogin');

login.addEventListener('click' , () => {
    window.location.href = "../login/login.html"
})
form.addEventListener('submit' , store);



async function store(e){

    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const obj = {
        username,
        email,
        password
    }

    const res = await axios.post('http://localhost:8000/user', obj)
    
    const data = res.data;

    alert(data);

    window.location.href = ("../login/login.html");
     

}