
const btnAdd = document.getElementById("btn-add")
const form = document.getElementById("form-scope")
const categoryName = document.getElementById('name')
const errorName = document.getElementById("error-name")
const btnCancel = document.getElementById("btn-cancel")
const btnSubmit = document.getElementById("btn-submit")
const btnSearch = document.getElementById("btn-search")
const tableCategory = document.getElementById("tbody")

let sortBy = "All";

let idUpdate = null;
const CATEGORY_LOCAL = "categorys";
const textSearch = document.getElementById("text-search");

let totalPage = 1;
let pageSize = 5;
let currentPage = 1;

btnSearch.addEventListener("click", function () {


    // const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL)) || []

    // const categoryFilter = categorys.filter(item => item.name.toLowerCase().includes(textSearch))
    // console.log("data filter: ", categoryFilter);
    render();
    // render()
})

btnAdd.addEventListener('click', function () {
    form.classList.remove('hidden')
})

btnCancel.addEventListener("click", function () {
    categoryName.value = '';
    errorName.innerHTML = '';
    btnSubmit.innerText = "Add";
    idUpdate = null;
    form.classList.add("hidden");
})
function submitForm(event) {
    event.preventDefault();
    if (idUpdate) {
        const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL)) || [];
        if (categoryName.value.length < 2) {
            errorName.innerText = `Lỗi`;
            return;
        } else {
            errorName.innerText = ``;
        }

        const index = categorys.findIndex(item => item.name === categoryName.value)
        if (index !== -1) {
            errorName.innerText = "Name bị trùng";
            return
        }
        else {
            errorName.innerText = "";
        }
        const indexUpdate = categorys.findIndex(item => item.id === idUpdate)
        categorys[indexUpdate].name = categoryName.value;
        localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(categorys))

        btnCancel.click()

        idUpdate = null;
        render()



        return
    }
    else {
        errorName.innerText = "";
    }

    let id = 1;
    const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL)) || [];
    if (categorys.length > 0) {
        id = categorys[categorys.length - 1].id + 1
    }
    if (categoryName.value.length < 2) {
        errorName.innerText = `Lỗi`;
        return;
    } else {
        errorName.innerText = ``;
    }

    const index = categorys.findIndex(item => item.name === categoryName.value)
    if (index !== -1) {
        errorName.innerText = "Name bị trùng";
        return
    }
    else {
        errorName.innerText = "";
    }
    const category = {
        id,
        name: categoryName.value,
        status: true,

    }

    categorys.push(category)

    localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(categorys))


    categoryName.value = "";

    form.classList.add("hidden")

    render();

}

function render(data) {
    let categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL));

    if (Array.isArray(data)) {
        categorys = data
    }

    let stringHTML = ``;

    if (sortBy == "aToZ") {
        categorys = categorys.sort(function (a, b) {
            var x = a.username.toLowerCase();
            var y = b.username.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        })
    }
    else if (sortBy == "zToA") {
        categorys = categorys.sort(function (a, b) {
            var x = a.username.toLowerCase();
            var y = b.username.toLowerCase();
            return x > y ? -1 : x < y ? 0 : 1;
        })
    }
    else if (sortBy == "STTAscending") {
        categorys = categorys.sort();
    }
    else if (sortBy == "STTDescending") {
        categorys = categorys.reverse();
    }
    //lọc theo gender
    else if (sortBy !== "All") {
        categorys = categorys.filter(
            (product) => product.username === sortBy
        );
    }

    // searchInput

    categorys = categorys.filter(item => item.name.toLowerCase().includes(textSearch.value));

    // console.log("filter: ", categorys);

    // categorys = categorys.filter((user) =>
    //     user.name.toLowerCase().includes("")
    // )

    // Phan trang
    totalPage = Math.ceil(categorys.length / 5);

    let stringPage = ``
    for (let i = 1; i <= totalPage; i++) {
        if (currentPage == i) {
            stringPage +=
                `
                <span class="active-page" onclick="movePage(${i})" >${i}</span>
            `
        } else {
            stringPage +=
                `
                <span class="active-page" onclick="movePage(${i})">${i}</span>
            `
        }
    }
    document.getElementById('page-list').innerHTML = stringPage


    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize
    if (categorys.length - 1 < end) {
        end = categorys.length - 1
    }

    for (let i in categorys) {
        if (i >= start && i < end) {
            stringHTML +=
                `
                    <tr>
                        <td>${categorys[i].id}</td>
                        <td>${categorys[i].name}</td>
                        <td>${categorys[i].status ? "Active" : "Block"}</td>
                        <td>
                         <button onclick="initUpdate(${categorys[i].id})">Update</button>
                         <button onclick="changeStatus(${categorys[i].id})">${categorys[i].status ? "Block" : "Active"}</button>
                    
                        </td>
                    </tr>
                `
        }
    }
    tableCategory.innerHTML = stringHTML;
}

render();

function movePage(index) {
    currentPage = index
    render()
}

function changePage() {

}

function deleteCategorys(id) {

    const result = confirm(`Are you sure delete id:${id}`)
    if (!result) {
        return;
    }
    const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL))

    const index = categorys.findIndex(item => item.id === id);

    categorys.splice(index, 1)
    localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(categorys));

    render();
}


function initUpdate(id) {
    idUpdate = id;
    const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL))

    const index = categorys.findIndex(item => item.id === id)

    categoryName.value = categorys[index].name;
    form.classList.remove("hidden")
    btnSubmit.innerText = "Update";
}

function changeStatus(id) {
    const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL))

    const index = categorys.findIndex(item => item.id === id)

    categorys[index].status = !categorys[index].status

    localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(categorys))

    render();
}

// hàm đọc gt từ select input
function changeCategory(e) {
    // console.log(e.target.value);
    sortBy = e.target.value;
    currentPage = 1;
    render();
}


// click phan trang chuyen trai phai

function changePage(status) {
    if (status === -1 && currentPage > 1) {
        currentPage -= 1;
    }
    if (status === 1 && currentPage < totalPage) {
        currentPage += 1;
    }
    render();
}

