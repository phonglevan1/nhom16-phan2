var productList = [];
function createProduct() {
    //     Kiểm tra validation
    if (!validateForm()) return;
    // 1.DOM lấy inputs
    var id = 0;
    var name = document.getElementById("txtName").value;
    var price = document.getElementById("txtPrice").value;
    var image = document.getElementById("txtImg").value;
    var describe = document.getElementById("txtDesc").value;

    // 3. tạo đối tượng product
    var product = new Product(
        id,
        name,
        price,
        image,
        describe,
    );
    // gửi request lên api
    var promise = productService.createProduct(product);
    promise
        .then(function (res) {
            fetchProductList();
            Swal.fire({
                title: "Thêm Thành Công!",
                timer: 2000,
                icon: "success",
            });
            cancel();
        })
        .catch(function (err) {
            console.log(err);
            Swal.fire({
                title: "Error!",
                timer: 2000,
                icon: "error",
            });
        });
}

function renderProduct(data) {
    data = data || productList;
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += `<tr>
                  <td>${data[i].name}</td>
                  <td>${data[i].price}</td>
                  <td><img src = "${data[i].image}"></td>
                  <td>${data[i].describe}</td> 
                  <td>
                    <button 
                      onclick="deleteProduct('${data[i].id}')" 
                      class="btn btn-danger">Xoá</button>
                    <button 
                    id = "update"
                      data-bs-toggle="modal" 
                      href="#exampleModalToggle"
                      onclick="getUpdateProduct('${data[i].id}')"  
                      class="btn btn-info">Sửa</button>
                  </td>
              </tr>`;
    }
    document.getElementById("tbodyProduct").innerHTML = html;

}

function deleteProduct(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then(function (result) {
        if (result.isConfirmed) {
            var promise = productService.deleteProduct(id);
            promise
                .then(function (res) {
                    fetchProductList();
                    Swal.fire({
                        title: "Deleted!",
                        timer: 2000,
                        icon: "success",
                    });

                })
                .catch(function (err) {
                    console.log(err);
                    Swal.fire({
                        title: "Error!",
                        timer: 2000,
                        icon: "error",
                    });
                });
        }
    });
}

function getUpdateProduct(id) {
    document.getElementById("btnAdd").style.display = "none";
    document.getElementById("btnUpdate").style.display = "inline";
    // call api backend => id => backend trả về chi tiết đối tượng product
    productService
        .fetchProductDetail(id)
        .then(function (res) {
            var product = res.data;
            document.querySelector(".btn").value = product.id;
            document.getElementById("txtName").value = product.name;
            document.getElementById("txtPrice").value = product.price;
            document.getElementById("txtImg").value = product.image;
            document.getElementById("txtDesc").value = product.describe;

        })
        .catch(function (err) {
            console.log(err);
        });
}

function updateProduct() {
    //Kiểm tra validation
    if (!validateForm()) return;

    var id = document.querySelector(".btn").value;
    var name = document.getElementById("txtName").value;
    var price = document.getElementById("txtPrice").value;
    var image = document.getElementById("txtImg").value;
    var describe = document.getElementById("txtDesc").value;
    // 3. tạo đối tượng product
    var product = new Product(
        id,
        name,
        price,
        image,
        describe,
    );

    // gửi request lên api
    productService.updateProduct(product)
        .then(function (res) {
            fetchProductList();
            Swal.fire({
                title: "Sửa Thành Công!",
                timer: 2000,
                icon: "success",

            });
            cancel();
        })
        .catch(function (err) {
            console.log(err);
            Swal.fire({
                title: "Error!",
                timer: 2000,
                icon: "error",
            });
        });
}

function fetchProductList() {
    // call api backend => productList
    productList = [];
    renderProduct();
    document.getElementById("loader").style.display = "block";

    var promise = productService.fetchProduct();
    // promise - PENDING - FULFILL - REJECT

    promise
        .then(function (res) {
            productList = mapProductList(res.data);
            renderProduct();
        })
        .catch(function (err) {
            console.log("error", err);
        })
        .finally(function(){
            document.getElementById("loader").style.display = "none";
        })
}
function mapProductList(local) {
    var result = [];

    for (var i = 0; i < local.length; i++) {
        var oldProduct = local[i];
        var newProduct = new Product(
            oldProduct.id,
            oldProduct.name,
            oldProduct.price,
            oldProduct.image,
            oldProduct.describe,
        );
        result.push(newProduct);
    }

    return result;
}

function cancel() {
    // reset form
    document.getElementById("form").reset();
}

function addForm() {
    document.getElementById("btnAdd").style.display = "inline";
    document.getElementById("btnUpdate").style.display = "none";
}

function searchProduct(e) {
    var keyword = e.target.value.toLowerCase().trim();
    var result = [];

    for (var i = 0; i < productList.length; i++) {
        var productName = productList[i].name.toLowerCase();

        if (productName.includes(keyword)) {
            result.push(productList[i]);
        }
    }
    renderProduct(result);
}

window.onload = function () {
    fetchProductList();
};
//validation

function required(val, config) {
    if (val.length > 0) {
        document.getElementById(config.errorId).innerHTML = "";
        return true;
    }

    document.getElementById(config.errorId).innerHTML = "*Vui lòng nhập giá tri";
    return false;
}

function pattern(val, config) {
    if (config.regexp.test(val)) {
        document.getElementById(config.errorId).innerHTML = "";
        return true;
    }
    document.getElementById(config.errorId).innerHTML =
        "*Giá trị không đúng định dạng";
    return false;
}



function validateForm() {

    var name = document.getElementById("txtName").value;
    var price = document.getElementById("txtPrice").value;
    var image = document.getElementById("txtImg").value;
    var describe = document.getElementById("txtDesc").value;

    var textRegexp = /^\d*(\.\d+)?$/;

    // nối các hàm kiểm tra của ô studentId
    var name =
        required(name, { errorId: "spName" });

    var price =
        required(price, { errorId: "spPrice" }) &&
        pattern(price, { errorId: "spPrice", regexp: textRegexp });
    var name =
        required(image, { errorId: "spImage" });
    var describe =
        required(describe, { errorId: "spDesc" });

    var isFormValid = name && price && image && describe;

    return isFormValid;
}