// const data = [
//     {
//         id: 1,
//         username: "admin",
//         email: "admin123@gmail.com",
//         password: "12345678",
//         role: "admin",
//         status: true,
//     },
//     {
//         id: 2,
//         username: "user2",
//         email: "user1@gmail.com",
//         password: "12345678",
//         role: "user",
//         status: true,
//     },
//     {
//         id: 3,
//         username: "user3",
//         email: "user1@gmail.com",
//         password: "12345678",
//         role: "user",
//         status: true,
//     },
//     {
//         id: 4,
//         username: "user4",
//         email: "user1@gmail.com",
//         password: "12345678",
//         role: "user",
//         status: true,
//     },
// ];
// localStorage.setItem("accounts", JSON.stringify(data));

const form = document.getElementById("login-form");
function registerAccount() {
    window.location.href = "../../UI/src/pages/register.html";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const usernameVl = document.getElementById("username").value;
    const passwordVl = document.getElementById("password").value;

    console.log(usernameVl, passwordVl);

    let check = false;

    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    const accountLogin = accounts.find(
        (item) => item.username == usernameVl && item.password == passwordVl
    );

    if (accountLogin) {
        if (accountLogin.role == "user") {
            localStorage.setItem("user-login", JSON.stringify(accountLogin));
            window.location.href = "../UI/src/home.html";
        } else {
            localStorage.setItem("admin-login", JSON.stringify(accountLogin));
            window.location.href =
                "./listUser.html";
        }
    } else {
        alert("Ban nhap sai thong tin");
    }
});