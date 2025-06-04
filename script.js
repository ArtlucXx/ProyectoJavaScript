const students = JSON.parse(localStorage.getItem("students")) || [];
let editingIndex = null;

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const gradeInput = document.getElementById("grade");
const dateInput = document.getElementById("date");
const promedioDiv = document.getElementById("average");
const tableBody = document.querySelector("#studentTable tbody");
const table = document.getElementById("studentTable");
const totalCount = document.getElementById("totalCount");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const grade = parseFloat(gradeInput.value);
  const date = dateInput.value;

  let valid = true;

  if (!name) {
    document.getElementById("errorName").textContent = "Por favor, ingrese el nombre.";
    valid = false;
  } else {
    document.getElementById("errorName").textContent = "";
  }

  if (!lastName) {
    document.getElementById("errorLastName").textContent = "Por favor, ingrese el apellido.";
    valid = false;
  } else {
    document.getElementById("errorLastName").textContent = "";
  }

  if (!grade || grade < 1 || grade > 7) {
    document.getElementById("errorGrade").textContent = "Por favor, ingrese una nota válida (1.0 a 7.0).";
    valid = false;
  } else {
    document.getElementById("errorGrade").textContent = "";
  }

  if (!date) {
    document.getElementById("errorDate").textContent = "Por favor, seleccione la fecha.";
    valid = false;
  } else {
    document.getElementById("errorDate").textContent = "";
  }

  if (!valid) return;

  const student = { name, lastName, grade, date };

  if (editingIndex !== null) {
    students[editingIndex] = student;
    editingIndex = null;
  } else {
    students.push(student);
  }

  saveStudents();
  form.reset();
  renderTable();
  updatePromedio();
  updateCount();
  table.classList.remove("hidden");
});

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function renderTable() {
  tableBody.innerHTML = "";
  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.lastName}</td>
      <td>${student.grade.toFixed(1)}</td>
      <td>${formatDate(student.date)}</td>
      <td>
        <button class="edit-btn" onclick="editStudent(${index})"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" onclick="deleteStudent(${index})"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function editStudent(index) {
  const student = students[index];
  nameInput.value = student.name;
  lastNameInput.value = student.lastName;
  gradeInput.value = student.grade;
  dateInput.value = student.date;
  editingIndex = index;
}

function deleteStudent(index) {
  if (confirm("¿Estás seguro de eliminar este estudiante?")) {
    students.splice(index, 1);
    saveStudents();
    renderTable();
    updatePromedio();
    updateCount();
    if (students.length === 0) {
      table.classList.add("hidden");
      promedioDiv.textContent = "Promedio de Notas: N/A";
      document.getElementById("countText").textContent = "0 estudiantes registrados";
      document.getElementById("examenText").textContent = "0 deben rendir examen";
      document.getElementById("eximidosText").textContent = "0 están eximidos";
    }
  }
}

function updatePromedio() {
  if (students.length === 0) {
    promedioDiv.textContent = "Promedio de Notas: N/A";
    return;
  }
  const total = students.reduce((sum, s) => sum + s.grade, 0);
  const promedio = total / students.length;
  promedioDiv.textContent = `Promedio de Notas: ${promedio.toFixed(2)}`;
}

function updateCount() {
  const total = students.length;
  const debenExamen = students.filter(s => s.grade < 4.0).length;
  const eximidos = students.filter(s => s.grade > 5.0).length;

  document.getElementById("countText").textContent = `${total} estudiante${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''}`;
  document.getElementById("examenText").textContent = `${debenExamen} deben rendir examen`;
  document.getElementById("eximidosText").textContent = `${eximidos} están eximidos`;
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// Al cargar
renderTable();
updatePromedio();
updateCount();
if (students.length > 0) {
  table.classList.remove("hidden");
}
