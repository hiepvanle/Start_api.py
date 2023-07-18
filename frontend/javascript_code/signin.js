let rememberedemail = "";
let rememberedpassword = "";

function searchSignup() {
    const search = document.getElementById('searchemail').value;
    const signuptable =document.getElementById('signup-table');
}

function login() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "login.php", true);
    xhr.setRequestHeader("Content-Type",  "application/x-www-form-urlencoded");
    xhr.send("email=" + email + "&password=" + password);
    xhr.onload = function() {
        if (xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          if (response.success) {
            window.location.href = "index.php";
          } else {
            alert(response.error);
          }
        }
      };

    fetch('http://127.0.0.1:5000/login')
    .then(response => response.json())
    .then(signup => {
        signuptable.style.display = 'block';
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${signup.email}</td>
        <td>${signup.password}</td>
        <td>
        `;
    })
    .catch(error => {
        signuptable.style.display = 'none';
        console.log('Sign up not found:', error);
    });
}

function showAddForm() {
    const addForm = document.getElementById('form-to-add');
    addForm.style.display = 'block';
}
function handleAddFormSubmit(event) {
    event.preventDefault(); // prevent form from submitting to server

    const form = document.getElementById('form-to-add');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "signup.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("email=" + email + "&password=" + password);

    // const signupData = {
    //     email: email,
    //     password: password
    // };
// }
// function signup() {

    fetch('http://127.0.0.1:5000/login?email', {
        method:'post',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(xhr)
    })
    .then(response => response.json())
    .then(data => {
        const postFormContainer = document.getElementById('form-to-add');
        const xhr = document.getElementById('signup-table');
        const postSuccessMessage = document.getElementById('success-message');
        postSuccessMessage.style.display = 'block';
        xhr.style.display = 'none';
        postFormContainer.style.display = 'none';
        form.reset();
        console.log('Data Posted successfully:', data);
        setTimeout(()=> {
            postSuccessMessage.style.display = 'none';
            searchSignup();
        },1000)
    })
    .catch(error => {console.error('Error posting account:', error);
                const postFormContainer = document.getElementById('form-to-add');
                const errorMessage = document.getElementById('error-message');
                errorMessage.innerHTML += '<p>An Error occurred while creating your Account</p>';
                errorMessage.style.display='block';
                postFormContainer.style.display = 'none';
                const signuptable = document.getElementById('signup-table');
                signuptable.style.display ='none';
                setTimeout(() =>{
                    errorMessage.style.display= 'none';
                    postFormContainer.style.display = 'block';
                searchSignup();
    },2000);
    });
}
    // var email = document.getElementById("email").value;
    // var password = document.getElementById("password").value;
    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", "signup.php", true);
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xhr.send("email=" + email + "&password=" + password);

document.getElementById('show-form-to-add-signup').addEventListener('click', showAddForm);
document.getElementById('form-to-add').addEventListener('submit', handleAddFormSubmit);