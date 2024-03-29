const addBox = document.querySelector(".new-note"),
  popupBox = document.querySelector(".popupbox"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false,
  updateId;

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".notes").forEach((li) => li.remove());
  notes.forEach((notes, id) => {
    let filterDesc = notes.description.replaceAll("\n", "<br/>");
    let liTag = `<li class="notes">
                    <div class="description">
                       <p>${notes.title}</p>
                       <span>${notes.description}</span>
                    </div>
                    <div class="placeholder">
                      <span>${notes.date}</span>
                       <div class="options">
                          <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                          <ul class="menu">
                            <li onclick="updateNote(${id}, '${notes.title}', '${notes.description}')"><i class="fa-solid fa-pen"></i>Edit</li>
                            <li onclick="deleteNote(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
                          </ul>
                      </div>
                    </div>
                </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, filterDesc) {
  console.log("Updating note:", noteId, title, filterDesc);
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  console.log("updateId:", updateId);
  addBox.click();
  isUpdate = true;
  console.log("isUpdate:", isUpdate);
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}


/* function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  addBox.click();
  isUpdate = true;
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
} */

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let title = titleTag.value.trim(),
    description = descTag.value.trim();

  if (title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});
