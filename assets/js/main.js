// object contrucstor
const methodList = new listEmployees();
const isCheckInput = new validator();
// variable
const btnAddPopup = document.querySelector("#showPopup");
const popup = document.querySelector(".main-form");
const titleAdd = document.querySelector(".add-title");
const titleEdit = document.querySelector(".edit-title");
const btnAddList = document.querySelector("#addList");
const btnEditList = document.querySelector("#editList");
// input variable
const form = document.querySelector("#form-employees");
const name = form.querySelector("#fullname");
const email = form.querySelector("#email");
const address = form.querySelector("#address");
const phone = form.querySelector("#phone");
const input = [name, email, address, phone];
// event
btnAddPopup.addEventListener("click", () => {
  popup.classList.add("showAdd");
  titleAdd.style.display = "block";
  btnAddList.style.display = "inline-block";
});
// addEmployees
btnAddList.addEventListener("click", creatEmployee);
// onblur input tag
// del btn
const btnDel = document.querySelector('#deleteLocal');
input.forEach((input) => {
  input.addEventListener("blur", () => {
    checkInput(input.value, input);
  });
});
input.forEach((input) => {
  input.addEventListener("keyup", () => {
    checkInput(input.value, input);
  });
});

setting();
const btnEditPopup = document.querySelector("#editPopup");
// Show Popup
btnEditPopup.addEventListener("click", () => {
  popup.classList.add("showAdd");
  titleEdit.style.display = "block";
  btnEditList.style.display = "inline-block";
});
// Delete
btnDel.addEventListener('click',delEmployee);
// add atribute
// Function
function hidePopup() {
  popup.classList.remove("showAdd");
  titleAdd.style.display = "none";
  btnAddList.style.display = "none";
}
function checkInput(value, input) {
  let isError = 0;
  let errorElement = input.parentElement.querySelector(".form-error");
  let isCheck = isCheckInput.isRequire(value);
  let getID = input.getAttribute("id");
  if (isCheck === undefined && getID === "email") {
    isCheck = isCheckInput.isEmail(value);
  }
  if (isCheck === undefined && getID === "phone") {
    isCheck = isCheckInput.isPhone(value);
  }
  if (isCheck) {
    errorElement.innerText = isCheck;
    input.classList.add("invalid");
    isError++;
  } else {
    errorElement.innerText = "";
    input.classList.remove("invalid");
  }
  return isError;
}
function reset() {
  name.value = "";
  email.value = "";
  address.value = "";
  phone.value = "";
}
// Create
function creatEmployee() {
  let isError;
  input.forEach((input) => {
    isError = checkInput(input.value, input);
  });
  if (isError > 0) {
    return;
  }
  const listEmployees = new employees(
    name.value,
    email.value,
    address.value,
    phone.value
  );
  console.log(listEmployees.id);
  pushStorage(listEmployees);
  let value = getStorage();
  renderSreen(value);
  reset();
}
// render
function renderSreen(listEmployees) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  listEmployees.forEach((Employee, index) => {
    let trBody = document.createElement("tr");
    let inner = `
    <tr class="body-table">
      <td>
        <input type='checkbox' class="checkbox" value="${Employee.phone}"/>
      </td>
      <td>
        ${Employee.name}
      </td>
      <td>
        ${Employee.email}
      </td>
      <td>
        ${Employee.address}
      </td>
      <td>
        ${Employee.phone}
      </td>
      <td>
        <i class="fas fa-edit" id="editPopup"></i>
      </td>
    </tr>
    `;
    trBody.innerHTML = inner;
    tbody.appendChild(trBody);
  });
}
// storage
function pushStorage(value) {
  {
    let employee = JSON.parse(localStorage.getItem("employees"));
    if (employee === null) employee = [];
    employee.push(value);
    localStorage.setItem("employees", JSON.stringify(employee));
  }
}
function getStorage() {
  let value;
  if (localStorage.getItem("employees") === null) {
    value = []; //arr[]
  } else {
    value = JSON.parse(localStorage.getItem("employees"));
  }
  return value;
}
function saveStorage (data) {
  localStorage.setItem('employees', JSON.stringify(data));
}
// Default load
function setting() {
  let value = getStorage();
  renderSreen(value);
}
// Delete
function delEmployee() {
  let localValues = getStorage();
  let inputsCheckbox = [...document.querySelectorAll(".checkbox")];
  let arrValues = [];
  inputsCheckbox.forEach(checkbox=>{
    if(checkbox.checked == true) {
      arrValues.push(checkbox.value)
    }
  })
  arrValues.forEach(arrValue=>{
    localValues.forEach((localValue,index)=>{
      if(arrValue === localValue.phone) {
        localValues.splice(index,1);
      }
    })
  })
  saveStorage(localValues);
  renderSreen(localValues);
}
// Edit 
function editEmployee () {

}

