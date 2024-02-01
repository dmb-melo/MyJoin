let contacts = [
  ["Marcel Bauer", "bauer@gmail.com", "+49 8625 946 38 2"],
  ["Anton Mayer", "antom@gmail.com", "+49 1111 111 11 1"],
  ["Anja Schulz", "schulz@hotmail.com", "+49 2222 222 22 2"],
  ["Benedikt Ziegler", "benedikt@gmail.com", "+49 3333 333 33 3"],
  ["David Eisenberg", "davidberg@gmail.com", "+49 1283 297 48 9"],
  ["Eva Fischer", "eva@gmail.com", "+49 2825 594 86 7"],
  ["Emmanuel Mauer", "emmanuelma@gmail.com", "+49 5890 487 38 4"],
  ["Tatjana Wolf", "wolf@gmail.com", "+49 7362 836 98 1"],
];
const colors = ["#9227FE", "#3BDBC7", "#FD81FF", "#FFBB2A", "#6E52FF", "#169857", "#6B5E5F", "#FF7915", "#9227FE", "#3BDBC7", "#FD81FF", "#FFBB2A", "#6E52FF", "#169857", "#6B5E5F", "#FF7915"];
let selectedContactIndex = null;

async function contactsInit() {
  await includeHTML();
  load();
  loadUserData();
  setInitialsInTheHeader();
  removeStyleSidebar();
  addTextColor();
  document.getElementById("sidebarCategoryContacts").classList.add("sidebarCategoryLinkActive");
  renderContacts();
}

async function renderContacts() {
  await loadContactsFromServer();
  contacts.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });
  showContacts();
}

async function setItemContacts(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, { method: "POST", body: JSON.stringify(payload) }).then((res) => res.json());
}

async function getItemContacts(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}

async function loadContactsFromServer() {
  try {
    contacts = JSON.parse(await getItemContacts("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function saveContactsToServer(newContact) {
  contacts.push(newContact);
  await setItemContacts("contacts", JSON.stringify(contacts));
}

function getRandomIndex() {
  let randomIndex = Math.floor(Math.random() * colors.length);
  newColors = colors;
  return randomIndex;
}

function showContacts() {
  let contactsdiv = document.getElementById("contacts");
  contactsdiv.innerHTML = "";
  let currentLetter = "";
  for (let i = 0; i < contacts.length; i++) {
    let name = contacts[i][0];
    let firstname = name[0].toUpperCase();
    let names = name.split(" ");
    let surname = names[1].toUpperCase().charAt(0);
    if (firstname !== currentLetter) {
      contactsdiv.innerHTML += `<div class="group-header">${firstname}</div><hr>`;
      currentLetter = firstname;
    }
    contactsdiv.innerHTML += displayContacts(contacts[i], i, firstname, surname);
  }
}

function resetSelectedContact() {
  if (selectedContactIndex !== null) {
    document.getElementById(`contact-info-${selectedContactIndex}`).style = "";
    selectedContactIndex = null;
  }
}

function selectContact(i, firstname, surname, event) {
  document.getElementById("editContact").classList.add("d-none");
  document.getElementById("editContactBackground").classList.add("d-none");
  resetSelectedContact();
  document.getElementById(`contact-info-${i}`).style = "background-color: #293647; color: white";
  selectedContactIndex = i;
  showCard(i, firstname, surname);
  document.getElementById("contact-details").classList.remove("hide-mobile-397px");
  document.getElementById("contact-list").classList.add("hide-mobile-397px");
  document.getElementById("button-add-contact-mobile").style = "display: none";
  document.getElementById("button-edit-contact-mobile").style = "display: block";
  fillOnclickDiv(i);
}

function fillOnclickDiv(i) {
  document.getElementById("onclickDiv").innerHTML = `
    <img class="image-edit-contact-mobile" src="./assets/img/more_vert.png" onclick="openMiniPopup(${i})">`;
}

function displayContactInfo(i, firstname, surname) {
  let name = (document.getElementById("nameCard").innerHTML = `${contacts[i][0]}`);
  let email = (document.getElementById("emailCard").innerHTML = `<div class="head-info"> Email </div><div class="main-info-mail">${contacts[i][1]}</div>`);
  let phone = (document.getElementById("phoneCard").innerHTML = `<div class="head-info"> Phone </div><div class="main-info"> ${contacts[i][2]}</div>`);
  let circle = document.getElementById("circleCard");
  circle.innerHTML = `<p class="nameId">${firstname}${surname}</p>`;
  circle.style = `background-color: ${colors[i]};`;
  let editCircle = document.getElementById("editCircle");
  editCircle.innerHTML = `<p class="nameIdEdit">${firstname}${surname}</p>`;
  editCircle.style = `background-color: ${colors[i]};`;
  document.getElementById("textCard").classList.remove("d-none");
  document.getElementById("circleCard").classList.remove("d-none");
}

function updateContactView(i) {
  document.getElementById("addContact").classList.add("d-none");
  document.getElementById("addContactBackground").classList.add("d-none");
  document.getElementById("contactCard").classList.remove("d-none");
  document.getElementById("contactCard").classList.add("slide-left");
  document.getElementById("buttonsCard").innerHTML = generateButtonHTML(i);
}

function showCard(i, firstname, surname) {
  displayContactInfo(i, firstname, surname);
  updateContactView(i);
}

function hoverEdit(element, isHover) {
  const logoMini = element.querySelector(".logo-mini");
  const logoMiniHover = element.querySelector(".logo-mini-hover");
  if (isHover) {
    logoMini.style.display = "none";
    logoMiniHover.style.display = "inline";
  } else {
    logoMini.style.display = "inline";
    logoMiniHover.style.display = "none";
  }
}

function hoverCancel(element, isHover) {
  const cancelImgBlack = element.querySelector(".cancel-img-black");
  const cancelImgBlue = element.querySelector(".cancel-img-blue");
  if (isHover) {
    cancelImgBlack.style.display = "none";
    cancelImgBlue.style.display = "inline";
  } else {
    cancelImgBlack.style.display = "inline";
    cancelImgBlue.style.display = "none";
  }
}

function handleHover(element, isHover) {
  const logoMini = element.querySelector(".custom-logo-mini");
  const logoMiniHover = element.querySelector(".custom-logo-mini-hover");
  if (isHover) {
    logoMini.classList.add("custom-hidden-logo");
    logoMiniHover.classList.remove("custom-hidden-logo");
  } else {
    logoMini.classList.remove("custom-hidden-logo");
    logoMiniHover.classList.add("custom-hidden-logo");
  }
}

async function createContact(event) {
  event.preventDefault();
  let userName = document.getElementById("1").value;
  let userEmail = document.getElementById("2").value;
  let userPhone = document.getElementById("3").value;
  if (!validateInput(userName, userEmail, userPhone)) {
    return;
  }
  let newContact = [userName, userEmail, userPhone];
  await saveContactsToServer(newContact);
  sortContacts();
  renderContacts();
  closeAddContact();
  clearInputFields();
  let newIndex = contacts.findIndex((contact) => contact === newContact);
  selectContact(newIndex, userName[0].toUpperCase(), userName.split(" ")[1].toUpperCase().charAt(0));
  showSuccessMessageBasedOnScreen();
}

function validateInput(userName, userEmail, userPhone) {
  if (!userName || !userEmail || !userPhone) {
    alert("Please fill out all fields before creating a contact.");
    return false;
  }
  let namePattern = /^[A-Za-z]+\s[A-Za-z]+$/;
  if (!namePattern.test(userName)) {
    alert("Please enter a valid name (first name and last name).");
    userNameInput.focus();
    return false;
  }
  return true;
}

function sortContacts() {
  contacts.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });
}

function clearInputFields() {
  document.getElementById("1").value = "";
  document.getElementById("2").value = "";
  document.getElementById("3").value = "";
}

function isResponsiveMode() {
  return window.innerWidth < 850;
}

function showSuccessMessageBasedOnScreen() {
  if (isResponsiveMode()) {
    showSuccessMessageResponsive();
  } else {
    showSuccessMessage();
  }
}

function showSuccessMessage() {
  let successDiv = document.getElementById("success");
  successDiv.classList.add("show");
  setTimeout(() => {
    hideSuccessMessage();
  }, 3000);
}

function hideSuccessMessage() {
  let successDiv = document.getElementById("success");
  successDiv.classList.remove("show");
}

function showSuccessMessageResponsive() {
  const successMessage = document.getElementById("success-2");
  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.classList.add("slide-top");
  }, 0);
  setTimeout(() => {
    successMessage.classList.remove("slide-top");
    successMessage.style.display = "none";
  }, 1500);
}

function addNewContact() {
  document.getElementById("contactCard").classList.add("d-none");
  document.getElementById("addContact").classList.remove("d-none");
  document.getElementById("addContactBackground").classList.remove("d-none");
  document.getElementById("addContact").classList.add("slide-left");
  resetSelectedContact();
}

function editContact(i) {
  document.getElementById("contactCard").classList.add("d-none");
  document.getElementById("editContact").classList.remove("d-none");
  document.getElementById("editContactBackground").classList.remove("d-none");
  document.getElementById("editContact").classList.add("slide-left");
  document.getElementById("formDiv").innerHTML = generateFormDivHTML(i);
  document.getElementById("userNameEdit").value = `${contacts[i][0]}`;
  document.getElementById("userEmailEdit").value = `${contacts[i][1]}`;
  document.getElementById("userPhoneEdit").value = `${contacts[i][2]}`;
}

async function deleteContact(event, i) {
  contacts.splice(i, 1);
  await setItemContacts("contacts", JSON.stringify(contacts));
  renderContacts();
  document.getElementById("contactCard").classList.add("d-none");
  selectedContactIndex = null;
  document.getElementById("editContact").classList.add("d-none");
  document.getElementById("editContactBackground").classList.add("d-none");
  event.preventDefault();
}

async function saveContact(event, i) {
  let newName = document.getElementById("userNameEdit").value;
  let editedContact = [document.getElementById("userNameEdit").value, document.getElementById("userEmailEdit").value, document.getElementById("userPhoneEdit").value];
  contacts.splice(i, 1);
  let name = newName;
  let firstname = name[0].toUpperCase();
  let names = newName.split(" ");
  let surname = names[1].toUpperCase().charAt(0);
  let circle = document.getElementById("circleCard");
  circle.innerHTML = `<p class="nameId">${firstname}${surname}</p>`;
  let editCircle = document.getElementById("editCircle");
  editCircle.innerHTML = `<p class="nameIdEdit">${firstname}${surname}</p>`;
  event.preventDefault();
  await saveContactsToServer(editedContact);
  await renderContacts();
  let index = validateValueOfContacts(newName);
  closeEditContact();
  selectContact(index, firstname, surname, event);
}

function validateValueOfContacts(newName) {
  for (let i = 0; i < contacts.length; i++) {
    let nameContacts = contacts[i][0];
    if (nameContacts === newName) {
      return i;
    }
  }
}

function closeEditContact() {
  document.getElementById("editContact").classList.add("d-none");
  document.getElementById("contactCard").classList.remove("d-none");
  document.getElementById("editContactBackground").classList.add("d-none");
}

function closeAddContact() {
  document.getElementById("addContact").classList.add("d-none");
  document.getElementById("contactCard").classList.remove("d-none");
  document.getElementById("addContactBackground").classList.add("d-none");
}

function openMiniPopup(i) {
  document.getElementById("mini-popup").style = "display: block";
  document.getElementById("mini-popup-display").innerHTML = generateMiniPopUpHTML(i);
}

function displayContacts(contact, index, firstname, surname) {
  return /*html*/ `      
          <div class="contact-info" id="contact-info-${index}" onclick="selectContact(${index},'${firstname}','${surname}')">
            <div class="contact-info-left">
                <div class="circle" id="circle-${index}" style="background-color: ${colors[index]}">
                    <p class="nameIdList" id="name-id">${firstname}${surname}</p>
                </div>
            </div>
            <div class="contact-info-right">
                <div class="contact-info-name" id="contact-info-name-${index}">
                    ${contact[0]}
                </div>
                <div class="contact-info-mail" id="contact-info-mail-${index}">
                    ${contact[1]}
                </div>
            </div>
          </div>`;
}

function generateButtonHTML(i) {
  return /*html*/ `
    <div class="editCard" id="editCard" onclick="editContact(${i})"
        onmouseover="hoverEdit(this, true)" onmouseout="hoverEdit(this, false)">
        <img class="logo-mini" src="./assets/img/edit_contacts.png">
        <img class="logo-mini-hover" src="./assets/img/edit2.png">
        <span class="textEdit">Edit</span>
    </div>
    <div class="deleteCard" id="deleteCard" onclick="deleteContact(event, ${i})"
        onmouseover="hoverEdit(this, true)" onmouseout="hoverEdit(this, false)">
        <img class="logo-mini" src="./assets/img/delete_contacts.png">
        <img class="logo-mini-hover" src="./assets/img/delete.png">
        <span class="textEdit">Delete</span>
    </div>`;
}

function generateFormDivHTML(i) {
  return /*html*/ `<form id="editContactForm" name="myFormEdit" onsubmit="saveContact(event, ${i})">
    <div class="close-img-div"><img class="close-img" src="./assets/img/cancel.png" onclick="closeEditContact()"></div>
    <div class="input" id="editInput">
        <div class="inputFieldName">
            <input class="inputField" type="text" id="userNameEdit" required> 
            <img class="logo-edit-input" src="./assets/img/person_add_contact.png">
        </div>
        <div class="inputFieldName">
            <input class="inputField" type="email" id="userEmailEdit" required> 
            <img class="logo-edit-input" src="./assets/img/mail_add_contact.png">
        </div>
        <div class="inputFieldName">
            <input class="inputField" type="number" id="userPhoneEdit" required> 
            <img class="logo-edit-input" src="./assets/img/call_add_contact.png">
        </div>
        <div class="editButtons">
            <button class="deleteButton" onclick="deleteContact(event, ${i})">Delete</button>
            <button class="saveButton" onsubmit="saveContact(event, ${i})">
                <div class="save-button-div">
                <div class="save-text">Save</div>
                <div><img class="save-check-img" src="./assets/img/check.png"></div>
            </button>
        </div>
    </div>
    </form>
    `;
}

function generateMiniPopUpHTML(i) {
  return /*html*/ ` 
      <div class="editCard-mini" id="editCard-mini" onclick="editContact(${i})"
          onmouseover="hoverEdit(this, true)" onmouseout="hoverEdit(this, false)">
          <img class="logo-mini logo-mini-2" src="./assets/img/edit_contacts.png">
          <img class="logo-mini-hover logo-mini-hover-2" src="./assets/img/edit2.png">
          <span class="textEdit textEdit-2">Edit</span>
      </div>
      <div class="deleteCard-mini" id="deleteCard-mini" onclick="deleteContact(event, ${i})"
          onmouseover="hoverEdit(this, true)" onmouseout="hoverEdit(this, false)">
          <img class="logo-mini" src="./assets/img/delete_contacts.png">
          <img class="logo-mini-hover logo-mini-hover-2" src="./assets/img/delete.png">
          <span class="textEdit textEdit-2">Delete</span>
      </div>`;
}
