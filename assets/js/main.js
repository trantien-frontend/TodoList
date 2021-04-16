// Variable
const validate = new validator();

const buttonShowForm = document.querySelector('#show-form');
const buttonsHideForm = document.querySelectorAll('.hide-form');
const buttonShowFormDel = document.querySelector('#del-form-checked');

const buttonAddEmployee = document.querySelector('#add-employee');
const buttonDelEmployee = document.querySelector('#del-employee');
const buttonEditEmployee = document.querySelector('#edit-employee');

const form = document.querySelector('.main-form');
const overlay = document.querySelector('.overlay');

const inputFullName = document.querySelector('#fullname');
const inputEmail = document.querySelector('#email');
const inputAdress = document.querySelector('#address');
const inputPhone = document.querySelector('#phone');
const inputs = document.querySelectorAll('.form-control');

const buttonAllCheck = document.querySelector('.allcheck');

let deleteEmployees = '';

//=================== Hide-Form
for (const buttonHideForm of buttonsHideForm) {
  buttonHideForm.onclick = () => {
    hideForm();
  };
}
const hideForm = () => {
  form.className = 'main-form';
  overlay.classList.remove('overlay-show');
};
//===================

// Reset-Form
const resetForm = () => {
  inputFullName.value = '';
  inputEmail.value = '';
  inputAdress.value = '';
  inputPhone.value = '';
};
// Validate-Form
const validateForm = (input) => {
  let error = 0;
  const id = input.getAttribute('id');
  let inputParent = input.parentElement;
  let errMessElement = inputParent.querySelector('.form-error');

  let errMess = validate.isRequire(input.value);

  if (id === 'email') {
    errMess = validate.isEmail(input.value);
  }
  if (id === 'phone') {
    errMess = validate.isPhone(input.value);
  }

  if (errMess === true) {
    input.classList.remove('invalid');
    errMessElement.innerHTML = '';
  } else {
    input.classList.add('invalid');
    errMessElement.innerHTML = errMess;
    error++;
  }
  return error;
};
for (const input of inputs) {
  input.onblur = () => {
    validateForm(input);
  };
  input.onkeyup = () => {
    validateForm(input);
  };
}
// =================== Push to localStorage
const pushEmployee = () => {
  let employees = JSON.parse(localStorage.getItem('Employees'));
  if (employees === null) {
    employees = [];
  }
  const newEmployee = new Employee(
    employees.length,
    inputFullName.value,
    inputEmail.value,
    inputAdress.value,
    inputPhone.value
  );
  employees.push(newEmployee);
  localStorage.setItem('Employees', JSON.stringify(employees));
};
// =================== GetListEmployees from localStorage
const getEmployees = () => {
  let employees = JSON.parse(localStorage.getItem('Employees'));
  return employees;
};
// ================== SetListEmployees for localStorage
const setEmployees = (listEmployees) => {
  localStorage.setItem('Employees', JSON.stringify(listEmployees));
};
// ================= setCurrentPages
const setCurrentPages = (currentPage) => {
  localStorage.setItem('CurrentPage', JSON.stringify(currentPage));
};
// ================= getCurrentPages
const getCurrentPage = () => {
  return localStorage.getItem('CurrentPage') ? JSON.parse(localStorage.getItem('currentPage')) : 1;
};
// ================= setStatusSort
const setStatusSort = (statusSort) => {
  localStorage.setItem('StatusSort', JSON.stringify(statusSort));
};
// ================= getStatusSort
const getStatusSort = () => {
  return localStorage.getItem('StatusSort')
    ? JSON.parse(localStorage.getItem('StatusSort'))
    : 'name-asc';
};
//====================== RenDer-List-Employess
const renderEmployees = (listEmployees) => {
  let tbody = document.querySelector('tbody');
  tbody.innerHTML = '';
  for (const employee of listEmployees) {
    let trBody = document.createElement('tr');
    let result = `
    <tr class="body-table">
      <td>
        <input type='checkbox' class="checkbox" value="${employee.id}"/>
      </td>
      <td data-label="${Object.keys(employee)[1]}">
        ${employee.name}
      </td>
      <td data-label="${Object.keys(employee)[2]}">
        ${employee.email}
      </td>
      <td data-label="${Object.keys(employee)[3]}">
        ${employee.address}
      </td>
      <td data-label="${Object.keys(employee)[4]}">
        ${employee.phone}
      </td>
      <td data-label="action">
        <i class="fas fa-edit" data-id=${employee.id} id="edit-form"></i>
        <i class="fas fa-trash-alt" data-id=${employee.id} id="del-form"></i>
      </td>
    </tr>
    `;
    trBody.innerHTML = result;
    tbody.appendChild(trBody);
  }
  showFormEdit();
  showFormDel();
  eventDelEmployee();
  hideForm();
  resetForm();
};
//====================== Show-form-Edit
const showFormEdit = () => {
  let buttonsShowFormEdit = document.querySelectorAll('#edit-form');
  for (const button of buttonsShowFormEdit) {
    button.onclick = () => {
      form.classList.add('main-form__edit');
      overlay.classList.add('overlay-show');
      const employeeId = Number.parseInt(button.dataset.id);
      const getListEmployees = getEmployees();
      const employeeCurrent = getListEmployees.find((employee) => employee.id == employeeId);
      inputFullName.value = employeeCurrent.name;
      inputEmail.value = employeeCurrent.email;
      inputAdress.value = employeeCurrent.address;
      inputPhone.value = employeeCurrent.phone;
      editEmployee(employeeId);
    };
  }
};
//====================== Show-form-del
const showFormDel = () => {
  let buttonsShowFormDel = document.querySelectorAll('#del-form');
  for (const buttonShowFormDel of buttonsShowFormDel) {
    buttonShowFormDel.onclick = () => {
      deleteEmployees = 'deleteEmployee';
      form.classList.add('main-form__del');
      overlay.classList.add('overlay-show');
      const employeeId = buttonShowFormDel.dataset.id;
      eventDelEmployee(employeeId);
    };
  }
};
//==================== Show-form-add
buttonShowForm.onclick = () => {
  form.classList.add('main-form__add');
  overlay.classList.add('overlay-show');
};

//====================== add - employee
buttonAddEmployee.onclick = () => {
  let err;
  for (input of inputs) {
    err = validateForm(input);
  }

  if (err != 0) return;

  pushEmployee();
  const Employees = [...getEmployees()];
  let loading = document.querySelector('.loading');
  loading.classList.remove('loading--hide');
  setTimeout(() => {
    pagination(Employees);
    loading.classList.add('loading--hide');
  }, 1000);
};

//====================== Edit - employee
const editEmployee = (employeeId) => {
  buttonEditEmployee.onclick = () => {
    let err;

    for (input of inputs) {
      err = validateForm(input);
    }

    if (err != 0) return;

    const listEmployees = getEmployees();
    const newEmployee = new Employee(
      employeeId,
      inputFullName.value,
      inputEmail.value,
      inputAdress.value,
      inputPhone.value
    );
    for (const employee of listEmployees) {
      if (employee.id === employeeId) {
        employee.name = newEmployee.name;
        employee.email = newEmployee.email;
        employee.address = newEmployee.address;
        employee.phone = newEmployee.phone;
      }
    }
    const newListEmployees = [...listEmployees];
    setEmployees(newListEmployees);
    let loading = document.querySelector('.loading');
    loading.classList.remove('loading--hide');
    setTimeout(() => {
      pagination(newListEmployees);
      loading.classList.add('loading--hide');
    }, 1000);
  };
};

//====================== Del - employee
const delEmployee = (employeeId) => {
  const listEmployees = getEmployees();
  const newListEmployees = listEmployees.filter((employee) => employee.id != employeeId);
  setEmployees(newListEmployees);
  pagination(newListEmployees);
};

//====================== Del - employees
const delEmployees = () => {
  const checkBoxs = [...document.querySelectorAll('.checkbox')];
  const listEmployees = getEmployees();
  const checkBoxsTrue = checkBoxs.filter((checkBox) => checkBox.checked === true);
  const checkBoxsId = checkBoxsTrue.map((checkBox) => checkBox.value);
  for (const checkBoxId of checkBoxsId) {
    listEmployees.forEach((employee, index) => {
      if (employee.id == checkBoxId) {
        listEmployees.splice(index, 1);
      }
    });
  }
  const newListEmployees = [...listEmployees];
  setEmployees(newListEmployees);
  eventDelEmployee();
  pagination(newListEmployees);
};

const eventDelEmployee = (employeeId) => {
  buttonDelEmployee.onclick = () => {
    let loading = document.querySelector('.loading');
    loading.classList.remove('loading--hide');
    setTimeout(() => {
      if (deleteEmployees === 'deleteEmployees') {
        delEmployees();
        loading.classList.add('loading--hide');
      }
      if (deleteEmployees === 'deleteEmployee') {
        delEmployee(employeeId);
        loading.classList.add('loading--hide');
      }
    }, 1500);
  };
};

//======================select-all-check-box
buttonAllCheck.onclick = (e) => {
  const allcheck = e.target.checked;
  const checkBoxs = [...document.querySelectorAll('.checkbox')];
  if (checkBoxs.length === 0) return;
  for (const checkBox of checkBoxs) {
    checkBox.checked = allcheck;
  }
};

//======================Show-Form-Del-When-CheckBox = true
buttonShowFormDel.onclick = () => {
  const checkBoxs = [...document.querySelectorAll('.checkbox')];
  const isCheckBox = checkBoxs.some((checkBox) => checkBox.checked === true);

  if (isCheckBox !== true) return;
  form.classList.add('main-form__del');
  overlay.classList.add('overlay-show');
  deleteEmployees = 'deleteEmployees';
};

const loadingPage = () => {
  let loading = document.querySelector('.loading');
  console.log(loading);
  setTimeout(() => {
    loading.classList.add('loading--hide');
  }, 3000);
};
// Page
// _limit
// TotalRows
let currentPage = getCurrentPage();
let start = 0;
const _limit = 5;
let end = _limit;

const handelButtonPagination = (listEmployees) => {
  let buttonsPagination = document.querySelectorAll('.numbersPage__button');
  buttonsPagination.forEach((button) => {
    button.addEventListener('click', () => {
      for (const button of buttonsPagination) {
        button.classList.remove('numbersPage--active');
      }
      button.classList.add('numbersPage--active');
      const buttonId = parseInt(button.dataset.current);
      currentPage = buttonId;
      pagination(listEmployees);
    });
  });
};

const createButtonPagination = (listEmployees) => {
  const totalEmployees = listEmployees.length;
  const totalButtons = Math.ceil(totalEmployees / _limit);
  let listButtonPagination = document.querySelector('.numbersPage');
  console.log(totalButtons);
  listButtonPagination.innerHTML = '';
  for (let i = 0; i < totalButtons; i++) {
    let button = document.createElement('li');
    button.setAttribute('class', 'numbersPage__button');
    button.setAttribute('data-current', i + 1);
    button.innerHTML = i + 1;
    if (i == currentPage - 1) {
      button.classList.add('numbersPage--active');
    }
    listButtonPagination.appendChild(button);
  }
  handelButtonPagination(listEmployees);
};
const pagination = (listEmployees) => {
  if (listEmployees === null) return;
  start = (currentPage - 1) * _limit;
  end = currentPage * _limit;
  createButtonPagination(listEmployees);
  const newListEmployees = [...listEmployees];
  const listCurrenPage = newListEmployees.slice(start, end);
  renderEmployees(listCurrenPage);
};
// =====================Search
const formSearch = document.querySelector('.form-search');
const inputSearch = document.querySelector('.search');
inputSearch.oninput = (e) => {
  let valueCurrent = e.target.value;
  let listEmployees = getEmployees();
  if (valueCurrent === '') {
    pagination(listEmployees);
  }
};
formSearch.onsubmit = (e) => {
  e.preventDefault();
  const listEmployees = getEmployees();
  if (listEmployees === null) return;
  const valueSearch = inputSearch.value;
  if (valueSearch === '') {
    pagination(listEmployees);
    return;
  }
  const newListEmployees = listEmployees.filter(
    (employee) =>
      valueSearch === employee.name ||
      valueSearch === employee.email ||
      valueSearch === employee.phone ||
      valueSearch === employee.address
  );
  pagination(newListEmployees);
};
// =========== sort - name
const sort = document.querySelector('#sort');
sort.onchange = (e) => {
  const listEmployees = getEmployees();
  const statusSort = e.target.value;
  setStatusSort(statusSort);
  sortName(listEmployees, statusSort);
};
const sortName = (listEmployees, statusSort) => {
  const newListEmployees = [...listEmployees];
  let newListSort;
  const sortOption = new optionSort();
  if (statusSort === 'name-asc') {
    newListSort = sortOption.sortAz(newListEmployees);
  }
  if (statusSort === 'name-desc') {
    newListSort = sortOption.sortZa(newListEmployees);
  }
  pagination(newListSort);
};
const defaultSortName = () => {
  const optionsSort = [...document.querySelectorAll('#sort option')];
  const statusSort = getStatusSort();
  const listEmployees = getEmployees();
  for (const optionSort of optionsSort) {
    if (optionSort.value === statusSort) {
      optionSort.setAttribute('selected', 'selected');
    }
  }
  sortName(listEmployees, statusSort);
};
// Default - loading - page
const defaultLoadingPage = () => {
  loadingPage();
  const listEmployees = getEmployees();
  if (listEmployees === null) return;
  defaultSortName();
};
defaultLoadingPage();
// localStorage.clear();
