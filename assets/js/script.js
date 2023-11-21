
// add employee button
let addEmployeeBtn = document.getElementById('addEmployee');
let addEmployeePopup = document.querySelector('.addEmployeePopup .modal');
let addEmployeeClose = document.querySelector('#addEmployeePopupClose');
let addEmployeecancelButton = document.querySelector('#addEmployeecancelButton');
function openPopup() {
    clearForm();
    showInputImg();
    modalBackgroundDisplay();
    addEmployeePopup.style.display = 'block';
}

function closeAddEmployee() {
    addEmployeePopup.style.display = 'none';
    modalBackgroundNone();
    // clearForm();
}
addEmployeeBtn.onclick = openPopup;
addEmployeeClose.onclick = closeAddEmployee;
addEmployeecancelButton.onclick = closeAddEmployee;

// dropdown menu

function openBtn(dropdownId) {
    let dropdowns = document.getElementsByClassName('employeebtn');
    for (let i = 0; i < dropdowns.length; i++) {
        let dropdown = dropdowns[i];
        if (dropdown.id === dropdownId) {
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            } else {
                dropdown.style.display = 'block';
            }
        } else {
            dropdown.style.display = 'none';
        }
    }
}

document.addEventListener('click', function (event) {
    let dropdowns = document.getElementsByClassName('employeebtn');
    for (let i = 0; i < dropdowns.length; i++) {
        let dropdown = dropdowns[i];
        if (event.target.closest('.dropdown') !== null) {
            continue;
        }
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    }
});

function viewEmployee(employeeId) {
    const viewUrl = `/view/?id=${employeeId}`;
    window.location.href = viewUrl;
}


async function Search() {
    const searchField = document.getElementById("search").value;
    if (searchField === "" || searchField === undefined || searchField === null) {
        showEmployees();
    } else {
        await fetch(`http://localhost:3000/api/employees/search?q=${searchField}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                const employeeData = data;
                currentPage = 1;
                renderEmployee(employeeData);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

// pagination

function pagenumbervisibletotalPages(pageCount){
    let paginationblock = document.querySelector('.pagenumber');
    if (pageCount<=1){
        paginationblock.style.display='none';
    }
    else
    {
        paginationblock.style.display='flex';
    }
}

// original 
var totalPages ;

function pagination(pageCount) {
    totalPages = pageCount;
    document.getElementById('listCount').innerText = `of ${pageCount}`;

    // div element where the pagination buttons are displayed
    let pgnum = document.getElementById("pagenumbers");
    let listnum = document.getElementById('select');

    let temp = '';
    let list = '';
    for (let i = 1; i <= pageCount; i++) {

        temp += `<button class="page-item" id="page${i}">${i}</button>`;

        let isSelected = i === currentPage;

        list += `<option id="listNum${i}" value="${i}" ${isSelected ? 'selected' : ''}>${i}</option>`;
    }

    pgnum.innerHTML = temp;
    listnum.innerHTML = list;
    listnum.value = currentPage;


    for (let i = 1; i <= pageCount; i++) {
        (function (pageNumber) {
            const pageCounter = document.getElementById(`page${pageNumber}`);
            pageCounter.addEventListener('click', function (e) {
                e.preventDefault();
                currentPage = pageNumber;
                showEmployees();

                // Update the selected option when a page is clicked
                // listnum.value = currentPage;
            });
        })(i);
    }
    

    if (currentPage == 1) {
        pageLeftButton.classList.add('hidden');
    } else {
        pageLeftButton.classList.remove('hidden');
    }
    if (currentPage == pageCount) {
        pageRightButton.classList.add('hidden');
    } else {
        pageRightButton.classList.remove('hidden');
    }
    
}

let pageLeftButton = document.getElementById("previous");
let pageRightButton = document.getElementById("next");

pageLeftButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage -= 1;
        showEmployees();
    }
});

pageRightButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage < totalPages) {
        currentPage+=1;
        showEmployees();
    }
});
//end of pagination

// select list to paginate
function listPaginate(value) {

    currentPage = value;
    showEmployees();

}

// employee added successfully Modal
let empAdded = document.getElementById('empAdded');

function  addEmpSuccessfulModal(){
    modalBackgroundDisplay();
    empAdded.style.display = 'block';
}
function closeEmpAddedModal(){
    modalBackgroundNone();
    empAdded.style.display = 'none';
    showEmployees();
}

// employee deleted successfully
let editedSuccessfully = document.getElementById('editedSuccessfully');
function editedSuccessfullyModal(){
    editedSuccessfully.style.display = 'block';
    modalBackgroundDisplay();
}
function closeEmpEditModal(){
    editedSuccessfully.style.display = 'none';
    modalBackgroundNone();
    window.location.reload();
    showEmployees();
}

// hide input img file
function  hideInputImg(){
    let hide = document.querySelector('.fw-bold.hide');
    let show = document.querySelector('.fw-bold.show');
    hide.style.display='none';
    show.style.display= 'block';
}
function  showInputImg(){
    let hide = document.querySelector('.fw-bold.hide');
    let show = document.querySelector('.fw-bold.show');
    if(hide.style.display==='none'){
    hide.style.display='block';
    show.style.display= 'none';
    }
}

