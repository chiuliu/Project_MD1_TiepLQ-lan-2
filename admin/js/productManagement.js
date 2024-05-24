const errorName = document.querySelectorAll(".error-name")
const btnAdd = document.getElementById("btn-add")
const form = document.getElementById("form-scope")
const productName = document.getElementById('name')
const imgProduct = document.getElementById('imgProduct')
const quantity = document.getElementById('quantityProduct')
const price = document.getElementById('priceProduct')

const btnCancel = document.getElementById("btn-cancel")
const btnSubmit = document.getElementById("btn-submit")
const btnSearch = document.getElementById("btn-search")
const tableCategory = document.getElementById("tbody")

let sortBy = "All";

let idUpdate = null;
const CATEGORY_LOCAL = "products";
const textSearch = document.getElementById("text-search");

let totalPage = 1;
let pageSize = 5;
let currentPage = 1;

let imageBase64 = null

btnSearch.addEventListener("click", function () {
    render();
})

btnAdd.addEventListener('click', function () {
    form.classList.remove('hidden')
})

btnCancel.addEventListener("click", function () {
    productName.value = '';
    errorName.innerHTML = '';
    btnSubmit.innerText = "Add";
    idUpdate = null;
    form.classList.add("hidden");
})
function submitForm(event) {
    event.preventDefault();
    if (idUpdate) {
        // console.log("ko co gi dau");
        const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL)) || [];
        if (productName.value.length < 2) {
            errorName.innerText = `Lỗi`;
            return;
        } else {
            errorName.innerText = ``;
        }
        const indexCu = categorys.findIndex(el => el.id === idUpdate)
        const index = categorys.findIndex(item => item.name === productName.value)
        if (index !== -1 && indexCu !== index) {
            errorName.innerText = "Name bị trùng";
            return
        }
        else {
            errorName.innerText = "";
        }

        const indexUpdate = categorys.findIndex(item => item.id === idUpdate)
        categorys[indexUpdate].name = productName.value;

        localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(categorys))

        btnCancel.click()

        idUpdate = null;
        render()

        return
    }

    let id = 1;
    const products = JSON.parse(localStorage.getItem(CATEGORY_LOCAL)) || [];
    if (products.length > 0) {
        id = products[products.length - 1].id + 1
    }
    if (productName.value.length < 2) {
        errorName[0].innerText = `Lỗi`;
        return;
    } else {
        errorName[0].innerText = ``;
    }

    const index = products.findIndex(item => item.name === productName.value)
    if (index !== -1) {
        errorName[0].innerText = "Name bị trùng";
        return
    }
    else {
        errorName[0].innerText = "";
    }
    const product = {
        id,
        name: productName.value,
        img: imageBase64,
        quantity: quantity.value,
        price: priceProduct.value,
        status: true,
    }

    products.push(product)

    localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(products))
    productName.value = "";
    form.classList.add("hidden")
    render();

}

function render(data) {
    let categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL)) || [];

    if (Array.isArray(data)) {
        categorys = data
    }

    let stringHTML = ``;

    // if (sortBy == "aToZ") {
    //     categorys = categorys.sort(function (a, b) {
    //         var x = a.username.toLowerCase();
    //         var y = b.username.toLowerCase();
    //         return x < y ? -1 : x > y ? 1 : 0;
    //     })
    // }
    // else if (sortBy == "zToA") {
    //     categorys = categorys.sort(function (a, b) {
    //         var x = a.username.toLowerCase();
    //         var y = b.username.toLowerCase();
    //         return x > y ? -1 : x < y ? 0 : 1;
    //     })
    // }
    // else if (sortBy == "STTAscending") {
    //     categorys = categorys.sort();
    // }
    // else if (sortBy == "STTDescending") {
    //     categorys = categorys.reverse();
    // }
    // //lọc theo gender
    // else if (sortBy !== "All") {
    //     categorys = categorys.filter(
    //         (product) => product.username === sortBy
    //     );
    // }

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
    console.log(start, end);

    for (let i = start; i <= end; i++) {
        stringHTML +=
            `
            <tr>
                <td>${categorys[i].id}</td>
                <td>${categorys[i].name}</td>
                <td>
                    <img width="50px" src="${categorys[i].img}" alt="img">
                </td>
                <td>${categorys[i].quantity}</td>
                <td>${categorys[i].price}</td>
                <td>${categorys[i].status ? "Active" : "Block"}</td>
                <td>
                 <button onclick="initUpdate(${categorys[i].id})">Update</button>
                 <button onclick="deleleProduct(${categorys[i].id})">Delete</button>
                 <button onclick="changeStatus(${categorys[i].id})">${categorys[i].status ? "Block" : "Active"}</button>
            
                </td>
            </tr>
        `
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

function deleteProduct(id) {
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

    productName.value = categorys[index].name;
    document.getElementById('image-product').src = categorys[index].img;
    quantity.value = categorys[index].quantity;
    price.value = categorys[index].price;
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


//đưa ảnh vào form
function convertToBase64() {
    //khởi tạo biến lấy id inputimage
    const fileInput = document.getElementById('imgProduct');
    //trường hợp có nhiều ảnh thì lấy ảnh đầu tiên
    //Muốn có chọn nhiều ảnh thì thêm multi ở bên input image
    const file = fileInput.files[0];

    //đọc file
    const reader = new FileReader();
    reader.onload = function (event) {
        const base64 = event.target.result;
        imageBase64 = base64;
        imgProduct.src = imageBase64;
    };

    reader.readAsDataURL(file);
    //kết thúc đọc file
}
