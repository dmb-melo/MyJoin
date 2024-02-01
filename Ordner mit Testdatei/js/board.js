let draggedElementId;
let stateOfTask = ["checkbox-1-0", "checkbox-1-1"];
let subtaskLevel = [
  {
    taskId: 1,
    percentageCompleted: 100,
    valueOfTheSubtaskBreak: "2/2",
  },
];

async function boardInit() {
  await includeHTML();
  await loadContactsFromServer();
  load();
  loadUserData();
  setInitialsInTheHeader();
  loadStateOfSubTask();
  loadLevelOfSubtask();
  removeStyleSidebar();
  addTextColor();
  document.getElementById("sidebarCategoryBorard").classList.add("sidebarCategoryLinkActive");
  updateHtml();
  renderSmallContats();
  renderProgressbar();
}

function filterTasksByStatus(taskStatus) {
  return tasks.filter((t) => t["taskStatus"] === taskStatus);
}

function updateHtmlForStatus(taskStatus, elementId) {
  const tasksByStatus = filterTasksByStatus(taskStatus);
  const element = document.getElementById(elementId);
  element.innerHTML = "";
  if (tasksByStatus.length === 0) {
    element.innerHTML = '<p class="noTask">Keine Aufgaben vorhanden</p>';
  } else {
    for (let i = 0; i < tasksByStatus.length; i++) {
      const task = tasksByStatus[i];
      element.innerHTML += generateSmallCard(task, i);
    }
  }
}

function renderProgressbar() {
  for (let i = 0; i < subtaskLevel.length; i++) {
    if (subtaskLevel) {
      let taskId = subtaskLevel[i]["taskId"];
      let percentageCompleted = subtaskLevel[i]["percentageCompleted"];
      let valueOfTheSubtaskBreak = subtaskLevel[i]["valueOfTheSubtaskBreak"];
      const smallProgressDiv = document.getElementById(`smallProgress-${taskId}`);
      smallProgressDiv.textContent = `${valueOfTheSubtaskBreak}`;
      let progressBar = document.getElementById(`progress-${taskId}`);
      progressBar.style.width = `${percentageCompleted}%`;
    }
  }
}

function updateHtml() {
  updateHtmlForStatus("todo", "todo");
  updateHtmlForStatus("inProgress", "inProgress");
  updateHtmlForStatus("awaitFeedback", "awaitFeedback");
  updateHtmlForStatus("done", "done");
}

function removeActiveClassFromSvgElements(container) {
  let svgElements = container.querySelectorAll(".img-priorityUrgent, .img-priorityMedium, .img-priorityLow");
  svgElements.forEach((svgElement) => {
    svgElement.classList.remove("imgPrio-active");
  });
}

function generateSmallCard(task, i) {
  let currenCategory = task.category[0];
  let currentPriorityContent = task.priorityContent || "";
  let tempDiv = document.createElement("div");
  let taskID = task["id"];
  tempDiv.innerHTML = currentPriorityContent;
  tempDiv.classList.add("selectedPriorityContentDiv");
  removeActiveClassFromSvgElements(tempDiv);
  let clonedContentDiv = document.createElement("div");
  clonedContentDiv.appendChild(tempDiv.cloneNode(true));
  removeActiveClassFromSvgElements(clonedContentDiv);
  return generateSelectedPriorityContent(currenCategory, clonedContentDiv, taskID, task, i);
}

function generateSelectedPriorityContent(currenCategory, clonedContentDiv, taskID, task, i) {
  let className = typeof currenCategory === "string" ? currenCategory.replace(/\s+/g, "") : "";
  let selectedPriorityContentDiv = clonedContentDiv.querySelector(".selectedPriorityContentDiv");
  ["textUrgent", "textMedium", "textLow"].forEach((className) => {
    let textElement = selectedPriorityContentDiv.querySelector("." + className);
    if (textElement) {
      textElement.textContent = "";
    }
  });
  let smallProgressDiv = "";
  if (task.subtasks.length > 0) {
    smallProgressDiv = generateProgressBar(task.id, task.subtasks.length);
  }
  return generateSmallCardHTML(task, className, clonedContentDiv, smallProgressDiv, i, taskID);
}

function deleteTask(event) {
  let noteElement = event.target.closest(".largeCardA");
  if (noteElement) {
    let parentElement = noteElement.parentElement;
    let index = Array.from(parentElement.children).indexOf(noteElement);
    deleteLevelOfSubtask(index);
    noteElement.remove();
    title.splice(index, 1);
    description.splice(index, 1);
    assigned.splice(index, 1);
    dueDate.splice(index, 1);
    prio.splice(index, 1);
    category.splice(index, 1);
    subtasks.splice(index, 1);
    subT.splice(index, 1);
    priorityContentArray.splice(index, 1);
    tasks.splice(0, 1);
    save();
    updateHtml();
    closeCard();
  }
}

function startDragged(id) {
  draggedElementId = id;
}

function moveIt(taskStatus) {
  const taskIndex = tasks.findIndex((task) => task.id === draggedElementId);
  if (taskIndex !== -1) {
    tasks[taskIndex].taskStatus = taskStatus;
    updateHtml();
    save();
    renderProgressbar();
    renderSmallContats();
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function openCard(taskId) {
  load();
  const largeCardElement = document.getElementById("popUpWindow");
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    largeCardElement.innerHTML = generateLargeCard(task);
    largeCardElement.style.transform = "translateX(0%)";
    renderLargeContats(task);
  }
  renderLargeContats();
  loadLevelOfSubtask();
  renderSubtaskState(task);
}

function renderSubtaskState(task) {
  let taskId = task["id"];
  let subTask = task["subtasks"];
  for (let i = 0; i < subTask.length; i++) {
    let renderTaskId = `checkbox-${taskId}-${i}`;
    let indexTaskId = getTaskId(renderTaskId);
    validateSubtask(indexTaskId, renderTaskId);
  }
}

function validateSubtask(indexTaskId, renderTaskId) {
  let checkboxRenderTaskId = document.getElementById(renderTaskId);
  if (indexTaskId === -1) {
    checkboxRenderTaskId.checked = false;
  } else {
    checkboxRenderTaskId.checked = true;
  }
}

function saveStateOfSubTask(taskId, index) {
  const id = `checkbox-${taskId}-${index}`;
  let indexTaskId = getTaskId(id);
  if (indexTaskId === -1) {
    stateOfTask.push(id);
  } else {
    stateOfTask.splice(indexTaskId, 1);
  }
  let idAtText = JSON.stringify(stateOfTask);
  localStorage.setItem("id", idAtText);
}

function getTaskId(id) {
  let index = stateOfTask.indexOf(id);
  return index;
}

async function saveLevelOfSubtask(taskId, percentageCompleted, valueOfTheSubtaskBreak) {
  await getLevelTaskId(taskId);
  pushLevelOfSubtask(taskId, percentageCompleted, valueOfTheSubtaskBreak);
  saveLevelOfSubtaskLocalStorage();
}

function saveLevelOfSubtaskLocalStorage() {
  let subtaskLevelAtText = JSON.stringify(subtaskLevel);
  localStorage.setItem("subtaskLevel", subtaskLevelAtText);
}

function getLevelTaskId(taskId) {
  for (let i = 0; i < subtaskLevel.length; i++) {
    let idOfTasklevel = subtaskLevel[i]["taskId"];
    if (idOfTasklevel === taskId) {
      subtaskLevel.splice(i, 1);
    }
  }
}

function pushLevelOfSubtask(taskId, percentageCompleted, valueOfTheSubtaskBreak) {
  let level = {
    taskId: taskId,
    percentageCompleted: percentageCompleted,
    valueOfTheSubtaskBreak: valueOfTheSubtaskBreak,
  };
  subtaskLevel.push(level);
}

function deleteLevelOfSubtask(indexOfTask) {
  let idOfTask = tasks[indexOfTask]["id"];
  for (let i = 0; i < subtaskLevel.length; i++) {
    let idOfTasklevel = subtaskLevel[i]["taskId"];
    if (idOfTasklevel === idOfTask) {
      subtaskLevel.splice(i, 1);
    }
  }
  saveLevelOfSubtaskLocalStorage();
  loadLevelOfSubtask();
}

function loadStateOfSubTask() {
  let idAtText = localStorage.getItem("id");
  if (idAtText) {
    stateOfTask = JSON.parse(idAtText);
  }
}

function loadLevelOfSubtask() {
  let subtaskLevelAtText = localStorage.getItem("subtaskLevel");
  if (subtaskLevelAtText) {
    subtaskLevel = JSON.parse(subtaskLevelAtText);
  }
}

function generateLargeCard(task) {
  let currentPriorityContent = task.priorityContent || "";
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = currentPriorityContent;
  tempDiv.classList.add("selectedPriorityContentDiv");
  tempDiv.classList.add("blackImport");
  removeActiveClassFromSvgElements(tempDiv);
  let clonedContentDiv = document.createElement("div");
  clonedContentDiv.appendChild(tempDiv.cloneNode(true));
  removeActiveClassFromSvgElements(clonedContentDiv);
  let currenCategory = task.category[0];
  let className = typeof currenCategory === "string" ? currenCategory.replace(/\s+/g, "") : "";
  const subsHtml = generateSubtasksHTML(task);
  return generateLargeCardHTML(task, className, clonedContentDiv, subsHtml);
}

function updateProgress(taskId, index) {
  const checkboxes = document.querySelectorAll(`.checkbox-input-${taskId}`);
  const checkedCheckboxes = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
  const smallProgressDiv = document.getElementById(`smallProgress-${taskId}`);
  smallProgressDiv.textContent = `${checkedCheckboxes.length}/${checkboxes.length}`;
  `${checkedCheckboxes.length}/${checkboxes.length}`;
  let valueOfTheSubtaskBreak = `${checkedCheckboxes.length}/${checkboxes.length}`;
  const progressBar = document.getElementById(`progress-${taskId}`);
  const percentageCompleted = (checkedCheckboxes.length / checkboxes.length) * 100;
  progressBar.style.width = `${percentageCompleted}%`;
  saveStateOfSubTask(taskId, index);
  saveLevelOfSubtask(taskId, percentageCompleted, valueOfTheSubtaskBreak);
  loadStateOfSubTask();
}

function editLargCard(taskId) {
  const task = tasks.find((task) => task.id === taskId);
}

function closeCard() {
  const largeCardElement = document.getElementById("popUpWindow");
  largeCardElement.style.transform = "translateX(500%)";
  assignedMenuOpen = false;
}

function renderSmallContats() {
  contacts.innerHTML = "";
  if (tasks.length === 0) {
    return;
  }
  for (let i = 0; i < tasks.length; i++) {
    let assigned = tasks[i]["assigned"];
    let idTask = tasks[i]["id"];
    let contactsSmallCard = document.getElementById(`boardAssigend-${idTask}`);
    let maxContactsToShow = 3;
    let totalAssigned = assigned.length;
    renderContentUserLargeCard(assigned, idTask, contactsSmallCard, maxContactsToShow, totalAssigned);
    if (totalAssigned > maxContactsToShow) {
      contactsSmallCard.innerHTML += generateManyContactsSmalCard(totalAssigned, maxContactsToShow);
    }
  }
}

function renderContentUserLargeCard(assigned, idTask, contactsSmallCard, maxContactsToShow, totalAssigned) {
  for (let a = 0; a < Math.min(maxContactsToShow, totalAssigned); a++) {
    let name = assigned[a];
    let firstname = name[0].toUpperCase();
    let names = assigned[a].split(" ");
    let surname = names[1].toUpperCase().charAt(0);
    contactsSmallCard.innerHTML += generateContactsSmalCard(a, firstname, surname);
  }
  return totalAssigned;
}

function renderLargeContats(task) {
  const contactsLargeCard = document.getElementById("boardAssigendLargCard");
  contacts.innerHTML = "";
  if (task && task["assigned"]) {
    const assigned = task["assigned"];
    for (let d = 0; d < assigned.length; d++) {
      const assigendAvatar = assigned[d];
      let name = assigned[d];
      let firstname = name[0].toUpperCase();
      let names = assigned[d].split(" ");
      let surname = names[1].toUpperCase().charAt(0);
      contactsLargeCard.innerHTML += generatCircleContactsLargeCard(d, firstname, surname, assigendAvatar);
    }
  }
}

function renderEditContacts() {
  const contactsLargeCard = document.getElementById("boardAssigendLargCard");
  contactsLargeCard.innerHTML = "";
  for (let d = 0; d < assigned.length; d++) {
    contactsLargeCard.innerHTML += generateEditContacts(assigned[d], colors[d]);
  }
}

function appendGeneratedAddTask(taskStatusFromBoard) {
  statusFromUser = taskStatusFromBoard;
  let addWindow = document.getElementById("popUpAddWindow");
  addWindow.classList.add("openAddWindow");
  let addBoard = document.getElementById("addBoard");
  let newDivAddTask = document.createElement("div");
  newDivAddTask.classList.add("addWindowCss");
  newDivAddTask.innerHTML = generate_addTask(statusFromUser);
  addBoard.appendChild(newDivAddTask);
  let contactsList = document.getElementById("contactList");
  contactsList.innerHTML = "";
  generateContentAppendAddTask(contactsList, handleContactSearch);
}

function generateContentAppendAddTask(contactsList, handleContactSearch) {
  sortContacts();
  for (let i = 0; i < contacts.length; i++) {
    renderContactsAddTask(i, contactsList);
  }
  document.getElementById("searchContacts").addEventListener("keyup", handleContactSearch);
  changeColour("priorityMedium");
}

function searchTask() {
  let terminal = document.getElementById("searchInput").value.toLowerCase();
  let foundTaskIds = [];
  for (let i in tasks) {
    let taskTitle = tasks[i].title.toLowerCase();
    if (taskTitle.includes(terminal)) {
      foundTaskIds.push(tasks[i].id);
    }
  }
  notSearchTasks(foundTaskIds);
}

function notSearchTasks(foundTaskIds) {
  for (let task of tasks) {
    let taskElement = document.getElementById("smallCardId-" + task.id);
    if (foundTaskIds.includes(task.id)) {
      console.log("Task with ID " + task.id + ": flex");
      taskElement.style.display = "flex";
    } else {
      console.log("Task with ID " + task.id + ": not");
      taskElement.style.display = "none";
    }
  }
}

function closeAddBoard() {
  let addWindow = document.getElementById("popUpAddWindow");
  addWindow.classList.remove("openAddWindow");
  let addBoard = document.getElementById("addBoard");
  let newDivAddTask = document.querySelector(".addWindowCss");
  if (newDivAddTask) {
    addBoard.removeChild(newDivAddTask);
  }
}

function changeImage(isHovered) {
  var textElemet = document.getElementById("delete-task-title");
  var imageElement = document.getElementById("delete-task-image");
  if (isHovered) {
    imageElement.src = "./assets/img/delete.png";
  } else {
    imageElement.src = "./assets/img/delete_contacts.png";
  }
}

function changeEditImage(isHovered) {
  var imageElement = document.getElementById("edit-task-image");
  if (isHovered) {
    imageElement.src = "./assets/img/edit2.png";
  } else {
    imageElement.src = "./assets/img/edit_task.png";
  }
}
