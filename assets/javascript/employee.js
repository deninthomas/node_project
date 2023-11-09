// delete and edit buttons in employee details form

document.addEventListener('DOMContentLoaded', () => {
    const employeeEdit = document.getElementById('employeeDetailsPageEdit');
    const employeeEditForm = document.getElementById('openEditFormEmployeeDetails');
    const employeeOverlay = document.getElementById('editEmployeeOverlay');
    const employeeCloseButton = document.getElementById('editEmployeeCloseBtn');
    const employeeDelete = document.getElementById('employeeDetailsPageEdit');
    // const employeeModal = document.getElementById('modalEmployee');

    // employeeEdit.addEventListener('click', () => {
    //     employeeEditForm.style.display = 'block';
    //     employeeOverlay.style.display = 'block';
    // });

    employeeCloseButton.addEventListener('click', () => {
        employeeEditForm.style.display = 'none';
        employeeOverlay.style.display = 'none';
    })

    // employeeDelete.addEventListener('click', () => {
    //     employeeModal.style.display = 'block';
    // })

});

function calculateAge(birthDate) {
    // Parse the birth date string to a Date object
    const birthDateObj = new Date(birthDate);
  
    // Get the current date
    const currentDate = new Date();
  
    // Calculate the difference in years
    let age = currentDate.getFullYear() - birthDateObj.getFullYear();
  
    // Check if the birthday for this year has already occurred
    // If not, subtract 1 from the age
    if (
      currentDate.getMonth() < birthDateObj.getMonth() ||
      (currentDate.getMonth() === birthDateObj.getMonth() &&
        currentDate.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
  
    return age;
  }

  function formatDate(dob) {
    var parts = dob.split('-'); // Split the input date by hyphens

    if (parts.length === 3) {
        var day = parts[0];
        var month = parts[1];
        var year = parts[2];

        // Ensure month and day have leading zeros if necessary
        var formattedMonth = month.padStart(2, '0');
        var formattedDay = day.padStart(2, '0');

        // Format the date as "YYYY-MM-DD"
        return [year, formattedMonth, formattedDay].join('-');
    } else {
        return ''; // Return an empty string for invalid input
    }
}




  
  // Example usage:
//   const birthDate = "1990-05-15"; // YYYY-MM-DD format
//   const age = calculateAge(birthDate);
//   console.log(`You are ${age} years old.`);
  

// let params = new URLSearchParams(document.location.search);
// let employeeid = params.get("id");
function retrieveAndUseIdFromUrl(url) {
    console.log(url)
    const regex = /\/view-employee\/([^/]+)$/;
    const match = url.match(regex);
    if (match) {
        const id = match[1];
        return id;
    } else {
      console.error('Id not found in the URL');
    }
  }
  
  const employeeid = retrieveAndUseIdFromUrl(window.location.href);



console.log(employeeid)
function viewEmployeeData(employeeid){

    fetch(`http://localhost:3000/api/employees/${employeeid}`, {
        method: 'GET',
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);

        birthDate = data.dob;
        console.log(birthDate);

        let formattedDate = formatDate(birthDate);
        age = calculateAge(formattedDate);

        document.getElementById("viewEmployeeForm").innerHTML=
        `<div class="row gap-3">
        <div class="row">
            <div class="cover-image col">
                <div class="title-image-div">
                    <img class="background-employee-details" src="/assets/images/Background Image.png" alt="">
                    <div class="profile-picture-employeeDetails">
                        <img src = "/${data.image}" class="profile-picture-employeeDetails-img">
                    </div>
                </div>
            </div>
        </div>
        <div class="row text-center employee-name">
            <h5>${data.salutation}${data.firstName+" "+data.lastName}</h5>
            <p>${data.email}</p>
        </div>
        <div class="row ">
            <div class="col-4">
                <div class="column-container div-specs rounded-4 p-4">
                    <p>Gender</p>
                    <h6>${data.gender}</h6>
                </div>
            </div>
            <div class="col-4">
                <div class="column-container div-specs rounded-4 p-4">
                    <p>Age</p>
                    <h6>${age}</h6>
                </div>
            </div>
            <div class="col-4">
                <div class="column-container div-specs rounded-4 p-4">
                    <p>Date of Birth</p>
                    <h6>${data.dob}</h6>
                </div>
            </div>
        </div>
    


        <div class="row">
            <div class="col-6">
                <div class="column-container div-specs rounded-4 p-4">
                    <p>Mobile Number</p>
                    <h6>${data.phone}</h6>
                </div>
            </div>
            <div class="col-6">
                <div class="column-container div-specs rounded-4 p-4">
                    <p>Qualifications</p>
                    <h6>${data.qualifications}</h6>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <div class="column-container div-specs rounded-4 p-4">
                    <p>Address</p>
                    <h6>${data.address}</h6>
                </div>
            </div>
            <div class="col-6">
                <div class="column-container div-specs rounded-4 p-4">
                    <p>Username</p>
                    <h6>${data.username}</h6>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="d-flex justify-content-end gap-3 p-4">
                <button id="employeeDetailsPageDelete" class="pt-3 pb-3 ps-4 pe-4 btn-delete btn rounded-4" onclick=open_delete_employee('${data._id}')>Delete</button>
                <button id="employeeDetailsPageEdit" class="pt-3 pb-3 ps-4 pe-4 btn-edit btn rounded-4" onclick=editEmployeeForm('${data._id}')>Edit Details</button>
            </div>
        </div>
    </div>`
    })
}
viewEmployeeData(employeeid);
