// page 
function redirect(){
    location.replace("/");
    }
// modal background
let modalbg = document.querySelector('.overlay');
function modalBackgroundDisplay(){
    modalbg.style.display = 'block';
}
function modalBackgroundNone(){
    modalbg.style.display = 'none';
}

//  Delete Employee

let deleteEmployeebtn = document.querySelector('#deletebtn');
let deleteModal = document.querySelector('.deletemodal .modal');
let deleteCloseBtn = document.querySelector('#deleteCloseBtn');
let deleteCancelBtn = document.querySelector('#deleteCancelBtn');
function deleteEmployee(employeeId) {
    deleteModal.style.display = 'block';

    const delButton = document.getElementById('deleteButton');
    delButton.addEventListener('click', function (e) {
        e.preventDefault();
        DeleteEmployee(employeeId);
    });
}

//function to Delete Employee
let delSuccessfully = document.getElementById('delSuccessfully');
function DeleteEmployee(employeeId) {
    
        fetch(`http://localhost:8080/api/employees/${employeeId}`, {
            method: 'DELETE'
        });
        closeDeleteEmployee();
        showEmployees();
        deleteSuccessfully();
    } 
function deleteSuccessfully() {
    delSuccessfully.style.display = 'block';
    modalBackgroundDisplay();
    showEmployees();
}
function closeEmpDeletedModal(){
    delSuccessfully.style.display = 'none';
    modalBackgroundNone();
}

function closeDeleteEmployee() {
    deleteModal.style.display = 'none';
}

