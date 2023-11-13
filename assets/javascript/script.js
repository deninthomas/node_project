// script for add employee form
const clickedAddEmployeeBtn = document.getElementById("addEmployeeBtn");
const openedForm = document.getElementById("openForm");
const clickedCloseBtn = document.getElementById("closeBtn");
const overlay = document.getElementsByClassName("overlay")[0];
const editForm = document.getElementById("openEditForm");

function openAddEmployeeForm() {
  overlay.style.display = "block";
  openedForm.style.display = "block";
}
function closeAddEmployeeForm() {
  overlay.style.display = "none";
  openedForm.style.display = "none";
}
function closeAddForm() {
  openedForm.style.display = "none";
}
function closeEditForm() {
  editForm.style.display = "none";
}
// script for toggle menu

function toggleMenu(id) {
  const list = document.getElementById("list");
  list.innerHTML = `
    <li><button id="viewEmployeeBtn" onclick=viewEmployeeBtn('${id}')><i class="material-symbols-outlined">
        visibility
        </i>View Details</button></li>
    <li><button  id="editBtn" onclick=editEmployeeForm('${id}')><i class="material-symbols-outlined">
        edit
        </i>Edit</button></li>
    <li><button class="deleteButton" id="deleteEmployee" onclick=open_delete_employee('${id}')><i class="material-symbols-outlined">
        delete
        </i>Delete</button></li>
  `;
  list.style.display = "flex";

  // Close the list when clicking outside
  document.addEventListener("click", function closeDropdown(event) {
    if (!list.contains(event.target)) {
      list.style.display = "none";
      document.removeEventListener("click", closeDropdown);
    }
  });

  // Prevent the click event from bubbling up
  event.stopPropagation();
}

function togglePosition(id) {
  const list = document.getElementById("list");
  const moreOptionsToggle = document.querySelectorAll(".three-dot-button");

  moreOptionsToggle.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      const buttonRect = event.target.getBoundingClientRect();
      list.style.top = buttonRect.bottom + 10 + "px";
      toggleMenu(id);
      event.stopPropagation(); // Prevent the click event from bubbling up
    });
  });
}




// function for clear the function
function clearForm() {
  // document.getElementById('avatar').value = "";
  document.getElementById("select").value = "";
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("emailAddress").value = "";
  document.getElementById("mobileNumber").value = "";
  document.getElementById("dob").value = "";
  let gender = document.querySelector('input[name="gender"]:checked');
  if (gender) {
    gender.value = "";
  }
  document.getElementById("qualifications").value = "";
  document.getElementById("address").value = "";
  document.getElementById("country").value = "";
  document.getElementById("state").value = "";
  document.getElementById("city").value = "";
  document.getElementById("pin").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}
function Display(data) {
  let temp = "";
  if (data.length == 0) {
    const searchError = document.getElementById("no_user");
    temp = searchError.innerHTML;
  }
  for (var i = 0; i < data.length; i++) {
    const employee = data[i];
    temp += `<tr class = "table-row">
    <td>${(CurrentPage - 1) * itemsPerPage + i + 1}</td>
    <td><span class="profile-icon "><img src = "/${employee.image}">
    <p>${employee.firstName + " " + employee.lastName}</p>
    </span></td>
    <td>${employee.email}</td>
    <td>${employee.phone}</td>
    <td>${employee.gender}</td>
    <td>${employee.dob}</td>
    <td>${employee.country}</td>
    <td>
        <button class = "three-dot-button" onclick=toggleMenu('${
          employee._id
        }')  id = "threeDotButton")>
        <i class="material-symbols-outlined three-dot-button-icon">more_horiz</i> 
        </button>
        <ul class = "more-options-list" id="list"></ul> 
        </td>
    </tr>`;
  }
  document.getElementById("employeeTableBody").innerHTML = temp;
}

// fetch data from the API and display it to the html

var CurrentPage = 1;
let itemsPerPage = 5;
let employees = [];

let employeesNum = document.getElementById("list-num");
employeesNum.value = itemsPerPage;
employeesNum.addEventListener("change", () => {
  itemsPerPage = employeesNum.value;
  console.log(itemsPerPage);
  showEmployees();
});
async function showEmployees() {
  await fetch(
    `http://localhost:3000/api/employees/?page=${CurrentPage}&limit=${itemsPerPage}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let employees = data.data;
      var pageCount = Math.ceil(data.length / itemsPerPage);
      displayPagination(pageCount);
      document.getElementById(
        "totalEmployees"
      ).innerHTML = `<p>of ${data.length}</p>`;
      selectNum = document.getElementById("list-num").value;
      console.log(selectNum);
    
      Display(employees);
      return pageCount;
    });
}

//****************Employees to be shown*****************/


function submitForm(event) {
  event.preventDefault();

  const salutation = document.getElementById("select").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("emailAddress").value;
  const phone = document.getElementById("mobileNumber").value;
  const birthDate = document.getElementById("dob").value;
  const dob = changeformat(birthDate);

  let gender = document.querySelector('input[name="gender"]:checked');
  if (gender) {
    const checkedGender = gender.value;
    gender = checkedGender;
  }

  const qualifications = document.getElementById("qualifications").value;
  const address = document.getElementById("address").value;
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const city = document.getElementById("city").value;
  const pin = document.getElementById("pin").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const image = document.getElementById("input-file").files[0];

  const formData = new FormData();

  formData.append("salutation", salutation);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("dob", dob);
  formData.append("gender", gender);
  formData.append("qualifications", qualifications);
  formData.append("address", address);
  formData.append("country", country);
  formData.append("state", state);
  formData.append("city", city);
  formData.append("pin", pin);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  console.log(formData);

  // Sending the employee data to the server
  if (validateForm()) {
    fetch("http://localhost:3000/api/employees", {
      method: "POST",
      // body: JSON.stringify(employeeData)
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Employee added:", data);
        clearForm();
        showEmployees();
        addedEmployee();
        closeAddForm();
        
     
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
      });
  }
}

function changeformat(val) {
  const Array = val.split("-");
  let year = Array[0];
  let month = Array[1];
  let day = Array[2];
  let formatteddate = day + "-" + month + "-" + year;
  return formatteddate;
}

showEmployees();

// script for form validation

function validateForm() {
  const avatar = document.getElementById("input-file");
  console.log(avatar);
  const salutationInput = document.getElementById("select").value;
  const firstNameInput = document.getElementById("firstName").value;
  const lastNameInput = document.getElementById("lastName").value;
  const emailInput = document.getElementById("emailAddress").value;
  const mobileNumberInput = document.getElementById("mobileNumber").value;
  const dobInput = document.getElementById("dob").value;
  const genderRadios = document.getElementsByName("gender");
  const qualificationsInput = document.getElementById("qualifications").value;
  const addressInput = document.getElementById("address").value;
  const countryInput = document.getElementById("country").value;
  const stateInput = document.getElementById("state").value;
  const cityInput = document.getElementById("city").value;
  const pinInput = document.getElementById("pin").value;
  const usernameInput = document.getElementById("username").value;
  const passwordInput = document.getElementById("password").value;

  const imageError = document.getElementById("imageError");
  const salutationError = document.getElementById("salutationError");
  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const emailError = document.getElementById("emailError");
  const mobileNumberError = document.getElementById("mobileNumberError");
  const dobError = document.getElementById("dobError");
  const genderError = document.getElementById("genderError");
  const qualificationsError = document.getElementById("qualificationsError");
  const addressError = document.getElementById("addressError");
  const countryError = document.getElementById("countryError");
  const stateError = document.getElementById("stateError");
  const cityError = document.getElementById("cityError");
  const pinError = document.getElementById("pinError");
  const usernameError = document.getElementById("userNameError");
  const passwordError = document.getElementById("passwordError");

  let valid = true;

  // //image
  if (avatar.files.length === 0) {
    imageError.style.display = "flex";
    valid = false;
  } else {
    imageError.style.display = "none";
  }
  // salutation
  if (salutationInput === "") {
    salutationError.style.display = "flex";
    valid = false;
  } else {
    salutationError.style.display = "none";
  }

  // name
  const validNamePattern = /^[A-Za-z]+$/;

  if (firstNameInput === "") {
    firstNameError.style.display = "flex";
    valid = false;
  } else if (!validNamePattern.test(firstNameInput)) {
    firstNameError.style.display = "flex";
    firstNameError.textContent = "Invalid characters in first name";
    valid = false;
  } else {
    firstNameError.style.display = "none";
  }
  if (lastNameInput === "") {
    lastNameError.style.display = "flex";
    valid = false;
  } else if (!validNamePattern.test(lastNameInput)) {
    lastNameError.style.display = "flex";
    lastNameError.textContent = "Invalid character in last name";
    valid = false;
  } else {
    lastNameError.style.display = "none";
  }

  // email
  const validEmailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (emailInput === "") {
    emailError.style.display = "flex";
    valid = false;
  } else if (!validEmailPattern.test(emailInput)) {
    emailError.style.display = "flex";
    emailError.textContent = "Invalid email format";
    valid = false;
  } else {
    emailError.style.display = "none";
  }

  // phone number
  const validMobileNumberPattern = /^\d{10}$/;
  if (mobileNumberInput === "") {
    mobileNumberError.style.display = "flex";
    valid = false;
  } else if (!validMobileNumberPattern.test(mobileNumberInput)) {
    mobileNumberError.style.display = "flex";
    mobileNumberError.textContent = "Invalid phone number";
    valid = false;
  } else {
    mobileNumberError.style.display = "none";
  }

  // dob

  if (dobInput === "") {
    dobError.style.display = "flex";
    valid = false;
  } else {
    dobError.style.display = "none";
  }

  // gender
  for (const radio of genderRadios) {
    if (!radio.checked) {
      genderError.style.display = "flex";
    } else {
      genderError.style.display = "none";
      break;
    }
  }
  // qualifications

  if (qualificationsInput === "") {
    qualificationsError.style.display = "flex";
    valid = false;
  } else {
    qualificationsError.style.display = "none";
  }

  // address
  if (addressInput === "") {
    addressError.style.display = "flex";
    valid = false;
  } else {
    addressError.style.display = "none";
  }

  // country

  if (countryInput === "" || countryInput == "") {
    countryError.style.display = "flex";
    valid = false;
  } else {
    countryError.style.display = "none";
  }

  // state
  if (stateInput === "" || stateInput == "") {
    stateError.style.display = "flex";
    valid = false;
  } else {
    stateError.style.display = "none";
  }

  // city
  if (cityInput === "") {
    cityError.style.display = "flex";
    valid = false;
  } else {
    cityError.style.display = "none";
  }

  // pincode
  if (pinInput === "") {
    pinError.style.display = "flex";
    valid = false;
  } else {
    pinError.style.display = "none";
  }

  // username
  if (usernameInput === "") {
    usernameError.style.display = "flex";
    valid = false;
  } else {
    usernameError.style.display = "none";
  }

  // password
  if (passwordInput === "") {
    passwordError.style.display = "flex";
    valid = false;
  } else {
    passwordError.style.display = "none";
  }

  function errorHider(className) {
    const errorElements = document.querySelectorAll("." + className); // Get all elements with the specified class name

    errorElements.forEach(function (errorElement) {
      const inputElement = errorElement.previousElementSibling; // Assuming the input fields are siblings of the error elements

      inputElement.addEventListener("input", function () {
        errorElement.style.display = "none";
      });
    });
  }

  errorHider("error");

  if (valid == false) {
    return false;
  } else {
    return true;
  }
}
// end of validation

// function for deleting the employee from the api and also from the api
function deleteDataFromAPI(id) {
  fetch(`http://localhost:3000/api/employees/${id}`, {
    method: "DELETE",
  });

  close_delete_employee();
  deletedEmployee();
  showEmployees();
}

// script for edit employee form

const editCloseBtn = document.getElementById("editCloseBtn");

function closeEditEmployeeForm() {
  const editEmployeeForm = document.getElementById("openEditForm");
  const editOverlay = document.getElementsByClassName("overlay")[0];
  editEmployeeForm.style.display = "none";
  editOverlay.style.display = "none";
}

// update method to edit employee

function editEmployeeForm(id) {
  const editEmployeeForm = document.getElementById("openEditForm");
  const editOverlay = document.getElementById("editOverlay");
  editEmployeeForm.style.display = "block";
  editOverlay.style.display = "block";

  fetch(`http://localhost:3000/api/employees/${id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      document.getElementById("editSelect").value = data.salutation;
      document.getElementById("editFirstName").value = data.firstName;
      document.getElementById("editLastName").value = data.lastName;
      document.getElementById("editEmail").value = data.email;
      document.getElementById("editMobileNumber").value = data.phone;

      function formatDate(dob) {
        var parts = dob.split("-");
        if (parts.length === 3) {
          var day = parts[0].padStart(2, "0");
          var month = parts[1].padStart(2, "0");
          var year = parts[2];
          return [year, month, day].join("-");
        } else {
          return "";
        }
      }

      const formattedDob = formatDate(data.dob);
      console.log(formattedDob);
      document.getElementById("editDob").valueAsDate = new Date(formattedDob);

      const genderRadios = document.querySelectorAll('input[name="gender"]');
      for (const radio of genderRadios) {
        if (radio.value === data.gender) {
          radio.checked = true;
        } else {
          radio.checked = false;
        }
      }

      if (data.country) {
        console.log(data.country);
        document.getElementById("editCountry").value = data.country;
      }

      if (data.state) {
        console.log(data.state);
        document.getElementById("editState").value = data.state;
      }

      if (data.city) {
        console.log(data.city);
        document.getElementById("editCity").value = data.city;
      }

      document.getElementById("editqualifications").value = data.qualifications;
      document.getElementById("editAddress").value = data.address;
      document.getElementById("editPin").value = data.pin;
      document.getElementById("editUsername").value = data.username;
      document.getElementById("editPassword").value = data.password;
      document.getElementById("image-preview").src = data.image;

      const updateSubmission = document.getElementById("updateSubmissionBtn");
      updateSubmission.addEventListener("click", (e) => {
        e.preventDefault();

        let salutation = document.getElementById("editSelect").value;
        let firstName = document.getElementById("editFirstName").value;
        let lastName = document.getElementById("editLastName").value;
        let email = document.getElementById("editEmail").value;
        let phone = document.getElementById("editMobileNumber").value;
        let dob = document.getElementById("editDob").value;
        dob = formatToPutDate(dob);
        let gender = data.gender;
        let qualifications =
          document.getElementById("editqualifications").value;
        let address = document.getElementById("editAddress").value;
        let country = document.getElementById("editCountry").value;
        let state = document.getElementById("editState").value;
        let city = document.getElementById("editCity").value;
        let pin = document.getElementById("editPin").value;
        let username = document.getElementById("editUsername").value;
        let password = document.getElementById("editPassword").value;

        const formData = new FormData();
        let uploadImage = document.getElementById("editForm-input-file")
          .files[0];

        if (uploadImage) {
          formData.append("image", uploadImage);
        }

        formData.append("salutation", salutation);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("dob", dob);
        formData.append("gender", gender);
        formData.append("qualifications", qualifications);
        formData.append("address", address);
        formData.append("country", country);
        formData.append("state", state);
        formData.append("city", city);
        formData.append("pin", pin);
        formData.append("username", username);
        formData.append("password", password);

        function formatToPutDate(dob) {
          var d = new Date(dob);
          var month = (d.getMonth() + 1).toString().padStart(2, "0");
          var day = d.getDate().toString().padStart(2, "0");
          var year = d.getFullYear().toString();
          return [day, month, year].join("-");
        }

        console.log(dob);

        fetch(`http://localhost:3000/api/employees/${id}`, {
          method: "PUT",
          body: formData,
        })
          .then((res) => {
            console.log(res);
          })
          .then((data) => {
            // console.log(data);
            editedEmployee();
            closeEditForm();
            showEmployees();
          })

         
          .catch((error) => {
            console.error("Error adding employee:", error);
          });
      });
    });
}

function editEmployeeUpdateCancel() {
  const editEmployee = document.getElementById("openEditForm");
  const overlay = document.getElementById("editOverlay");
  editEmployee.style.display = "none";
  overlay.style.display = "none";
}

function viewEmployeeBtn(id) {
  const viewEmployeeButton = document.getElementById("viewEmployeeBtn");
  // window.location.href = `employee-details.html?id=${id}`;
  window.location.href = `/view-employee/${id}`;
}

function goToHomePage() {
  window.location.href = "/home";
}
// script for pagination

function displayPagination(totalPages) {
  // console.log(totalPages);
  var pgnum = document.getElementById("pagination");
  let temp = "";
  for (let i = 1; i <= totalPages; i++) {
    temp += `<a id="page${i}" class="">${i}</a>`;
  }
  pgnum.innerHTML = temp;
  pgnum.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      const pageNumber = parseInt(e.target.textContent);
      if (!isNaN(pageNumber)) {
        CurrentPage = pageNumber;
        showEmployees();
      }
    }
  });
  var previousButton = document.getElementById("prevBtn");
  var nextButton = document.getElementById("nextBtn");
  // Use CSS to control button visibility
  if (CurrentPage === 1) {
    previousButton.classList.add("hidden");
  } else {
    previousButton.classList.remove("hidden");
  }
  if (CurrentPage === totalPages) {
    nextButton.classList.add("hidden");
  } else {
    nextButton.classList.remove("hidden");
  }
  previousButton.addEventListener("click", function () {
    if (CurrentPage > 1) {
      CurrentPage--;
      showEmployees();
    }
  });
  nextButton.addEventListener("click", function () {
    if (CurrentPage < totalPages) {
      CurrentPage++;
      showEmployees();
    }
  });
  const activeBtn = document.getElementById(`page${CurrentPage}`);
  activeBtn.style.backgroundColor = "lightblue";
}
//end of pagination



async function searchEmployee() {
  const searchBar = document.getElementById("searchEmployee").value;
  if (searchBar === "" || searchBar === undefined || searchBar === null) {
    showEmployees();
  } else {
    await fetch(`http://localhost:3000/api/employees/search?q=${searchBar}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const employeeData = data;
        CurrentPage = 1;
        Display(employeeData);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

// add employee upload image
// const imageLabel = document.getElementById('drop-area');
const uploadBtn = document.getElementById("uploadImgBtn");
const fileInput = document.getElementById("input-file");
const imageViewDiv = document.getElementById("img-view");
const uploadedImage = document.getElementById("uploadedImage");
const uploadIcon = document.getElementById("uploadIcon");
const uploadSpan = document.getElementById("uploadSpan");

uploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fileInput.click(); // Trigger the hidden file input when the button is clicked
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    const imageLink = URL.createObjectURL(fileInput.files[0]);
    uploadedImage.src = imageLink;
    imageViewDiv.style.border = "none";
    uploadIcon.style.display = "none";
    uploadSpan.style.display = "none";
    // imageViewDiv.textContent = "";
  } else {
    // Handle the case where no file is selected
    uploadedImage.src = ""; // Clear the image source
    imageViewDiv.style.border = "none";
  }
});

// edit employee upload image

const editEmployeeImageLabel = document.getElementById("editForm-drop-area");
const editEmployeeFileInput = document.getElementById("editForm-input-file");
const editEmployeeImageViewDiv = document.getElementById("editForm-img-view");
const selectedImage = document.getElementById("image-preview");

editEmployeeFileInput.addEventListener("change", displaySelectedImage);

function displaySelectedImage() {
  // Get the selected image file
  const file = editEmployeeFileInput.files[0];

  if (file) {
    // Create a URL for the selected image and display it
    const imageLink = URL.createObjectURL(file);
    selectedImage.src = imageLink;
    editEmployeeImageViewDiv.style.border = "none";
    editEmployeeImageViewDiv.style.width = "200px";
  } else {
    // Clear the image if no file is selected
    selectedImage.src = "";
    editEmployeeImageViewDiv.style.border = "1px #ccc"; // Add a border
    editEmployeeImageViewDiv.style.width = "auto"; // Reset width
  }
}

function changeImage(event) {
  // Trigger the file input click event when the "Change" button is clicked
  event.preventDefault();
  editEmployeeFileInput.click();
}

// delete employee popups
function deletedEmployee() {
  var addedEmployee = document.getElementById("deleted-emp");
  addedEmployee.style.display = "block";
  var overlay_close = document.getElementsByClassName("overlay")[0];
  overlay_close.style.display = "block";
  showEmployees();
}
function closeDeletedEmployee() {
  var addedEmployee = document.getElementById("deleted-emp");
  addedEmployee.style.display = "none";
  var overlay_close = document.getElementsByClassName("overlay")[0];
  overlay_close.style.display = "none";
  goToHomePage();
}
function close_delete_employee() {
  var delete_btn = document.getElementById("delete_employee");
  delete_btn.style.display = "none";

}

function open_delete_employee(id) {
  var delete_btn = document.getElementById("delete_employee");
  delete_btn.style.display = "block";
  var overlay_close = document.getElementsByClassName("overlay")[0];
  overlay_close.style.display = "block";
  const deleteButton = document.getElementById("deleteConfirmation");
  deleteButton.addEventListener("click", () => {
    // var list = document.getElementById("list");
    // list.style.display = "none";
    deletedEmployee();
    deleteDataFromAPI(id);
  });
}

//   edit & add form successful popups

function addedEmployee() {
  var addedEmployee = document.getElementById("added-emp");
  addedEmployee.style.display = "block";
  var overlay_close = document.getElementsByClassName("overlay")[0];
  overlay_close.style.display = "block";
}
function closeAddedEmployee() {
  var addedEmployee = document.getElementById("added-emp");
  addedEmployee.style.display = "none";
  var overlay_close = document.getElementsByClassName("overlay")[0];
  overlay_close.style.display = "none";
}
function editedEmployee() {
  var addedEmployee = document.getElementById("edited-emp");
  addedEmployee.style.display = "block";
  var overlay_close = document.getElementsByClassName("overlay")[0];
  overlay_close.style.display = "block";
}
function closeEditedEmployee() {
  var addedEmployee = document.getElementById("edited-emp");
  addedEmployee.style.display = "none";
  var overlay_close = document.getElementsByClassName("overlay")[0];
  overlay_close.style.display = "none";
  location.reload();
}
