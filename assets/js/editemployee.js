
// edit employee
let editemployee = document.getElementById("editPopup");
function editEmployeePopup(employeeId) {
    editEmployeeDetails(employeeId);
    editemployee.style.display = 'block';
    modalBackgroundDisplay();
}

let editCloseBtn = document.getElementById('editCloseBtn');
let editCancelBtn = document.getElementById('editCancelBtn');

editCloseBtn.onclick = closeEditEmployee;
editCancelBtn.onclick = closeEditEmployee;

function closeEditEmployee() {
    editemployee.style.display = 'none';
    modalBackgroundNone();
    clearFormEdit();
}
function clearFormEdit() {
    // Reset the form to clear the input fields
    document.getElementById('editEmployeeForm').reset();
    const clearEditImgPreview = document.getElementById('editImgPreview');
    clearEditImgPreview.innerHTML = "";
    console.log('clear edit form');
}

// Edit popup
// function changeDateFormat(v) {
//     const arr = v.split('-');
//     let formattedDate = `${arr[2]}-${arr[1]}-${arr[0]}`;
//     return formattedDate;
// }
// Edit Employee Modal
function editEmployeeDetails(employeeId) {
    fetch(`http://localhost:8080/api/employees?id=${employeeId}`)
        .then((response) => response.json())
        .then((employee) => {

            document.getElementById('editsalutation').value = employee.salutation;
            document.getElementById('editfirstname').value = employee.firstName;
            document.getElementById('editlastname').value = employee.lastName;
            document.getElementById('editemail').value = employee.email;
            document.getElementById('editmobile').value = employee.phone;
            document.getElementById('editdatepicker').value = formatDate(employee.dob);
            document.querySelector(`input[name="editgender"][value="${employee.gender}"]`).checked = true;
            document.getElementById('editaddress').value = employee.address;
            document.getElementById('editqualification').value = employee.qualifications;
            document.getElementById('editcountry').value = employee.country;
            document.getElementById('editstate').value = employee.state;
            document.getElementById('editcity').value = employee.city;
            document.getElementById('editzip').value = employee.pincode;
            document.getElementById('editUserName').value = employee.username;
            document.getElementById('editpassword').value = employee.password;
            document.getElementById('editImgPreview').src = `/${employee.avatar}`;
        });


    document.getElementById('savechanges').addEventListener('click', function (event) {
        event.preventDefault();
        console.log('edited');
        saveEditedEmployee(employeeId);
    });
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}

async function saveEditedEmployee(employeeId) {
    console.log(employeeId);
    try {


        const salutation = document.getElementById('editsalutation').value;
        const firstName = document.getElementById('editfirstname').value;
        const lastName = document.getElementById('editlastname').value;
        const email = document.getElementById('editemail').value;
        const phone = document.getElementById('editmobile').value;
        const dob = formatDate(document.getElementById('editdatepicker').value);
        const gender = document.querySelector('input[name="editgender"]:checked').value;
        const address = document.getElementById('editaddress').value;
        const qualifications = document.getElementById('editqualification').value;
        const country = document.getElementById('editcountry').value;
        const state = document.getElementById('editstate').value;
        const city = document.getElementById('editcity').value;
        const pincode = document.getElementById('editzip').value;
        const username = document.getElementById('editUserName').value;
        const password = document.getElementById('editpassword').value;
        const file = document.getElementById('editImgUpload').files[0];

        const editEmpData = new FormData()

        // Check if an avatar file is selected
        if (file) {
            editEmpData.append('avatar', file); // Append the avatar file to formData
        }

        editEmpData.append('salutation', salutation);
        editEmpData.append('firstName', firstName);
        editEmpData.append('lastName', lastName);
        editEmpData.append('email', email);
        editEmpData.append('phone', phone);
        editEmpData.append('address', address);
        editEmpData.append('qualifications', qualifications);
        editEmpData.append('country', country);
        editEmpData.append('state', state);
        editEmpData.append('city', city);
        editEmpData.append('pincode', pincode);
        editEmpData.append('password', password);
        editEmpData.append('dob', dob);
        editEmpData.append('gender', gender)
        editEmpData.append('username', username);

        const response = await fetch(`http://localhost:8080/api/employees/${employeeId}`, {
            method: 'PUT',
            body: editEmpData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Employee edited:', data);

        closeEditEmployee();
        // showEmployees();
        editedSuccessfullyModal();
    } catch (error) {
        console.error('Error editing employee:', error);
    }
}

function updateImage() {
    const updateUserImage = document.getElementById('editImgUpload');
    // console.log('hi');
    // updateUserImage.click();

    updateUserImage.addEventListener('change', function (event) {
        const selectedImage = updateUserImage.files[0];

        const reader = new FileReader();

        reader.onload = function (event) {
            const imageUrl = event.target.result;

            const newEmpImage = document.getElementById('editImgPreview');

            newEmpImage.src = imageUrl;
        }
        reader.readAsDataURL(selectedImage);
    });
}