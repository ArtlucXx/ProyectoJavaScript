const students = [];

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const gradeInput = document.getElementById("grade");
const dateInput = document.getElementById("date");

let studentBeingEdited = null;

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Limpiar mensajes previos
    nameInput.setCustomValidity("");
    lastNameInput.setCustomValidity("");
    gradeInput.setCustomValidity("");
    dateInput.setCustomValidity("");

    // Validar nombre
    if (!nameInput.value.trim()) {
        nameInput.setCustomValidity("Por favor, complete el campo Nombre.");
    }

    // Validar apellido
    if (!lastNameInput.value.trim()) {
        lastNameInput.setCustomValidity("Por favor, complete el campo Apellido.");
    }

    // Validar nota
    if (!gradeInput.value) {
        gradeInput.setCustomValidity("Por favor, complete el campo Nota.");
    } else {
        const grade = parseFloat(gradeInput.value);
        if (grade < 1 || grade > 7) {
            gradeInput.setCustomValidity("La nota debe estar entre 1.0 y 7.0.");
        }
    }

    // Validar fecha
    if (!dateInput.value) {
        dateInput.setCustomValidity("Por favor, agregue la fecha de inscripción.");
    }

    // Si hay algún error, mostrar burbujas y no continuar
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const student = {
        name: nameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        grade: parseFloat(gradeInput.value),
        date: dateInput.value,  // Mantener la fecha tal cual está en formato "yyyy-mm-dd"
    };

    if (studentBeingEdited) {
        // Actualizar los datos del estudiante editado
        studentBeingEdited.name = student.name;
        studentBeingEdited.lastName = student.lastName;
        studentBeingEdited.grade = student.grade;
        studentBeingEdited.date = student.date;
        
        // Limpiar la referencia de estudiante editado
        studentBeingEdited = null;

        // Cambiar el texto del botón de vuelta a "Agregar estudiante"
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = "Agregar estudiante";
    } else {
        // Agregar el nuevo estudiante al array
        students.push(student);
    }

    renderTable();  // Vuelve a renderizar la tabla después de agregar o editar
    calcularPromedio();
    mostrarTabla();

    form.reset();  // Limpiar el formulario
});

const tableBody = document.querySelector("#studentTable tbody");

function addStudentToTable(student) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.grade.toFixed(1)}</td>
        <td>${formatDate(student.date)}</td>
        <td>
            <button class="delete-btn" onclick="deleteStudent('${student.name}', '${student.lastName}')">
                <i class="fas fa-trash-alt"></i>
            </button>
            <button class="edit-btn" onclick="editStudent('${student.name}', '${student.lastName}')">
                <i class="fas fa-edit"></i>
            </button>
        </td>
    `;

    tableBody.appendChild(row);
}

// Función para formatear la fecha correctamente
function formatDate(dateString) {
    // Convertimos la fecha a un objeto Date sin zona horaria, manteniendo el formato original
    const [year, month, day] = dateString.split('-'); // Separar la fecha en partes
    const date = new Date(year, month - 1, day); // Crear una nueva fecha

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options); // Formatear la fecha en español
}

function editStudent(name, lastName) {
    // Buscar el estudiante en el array de estudiantes
    const student = students.find(student => student.name === name && student.lastName === lastName);

    if (student) {
        // Establecer el estudiante a editar
        studentBeingEdited = student;

        // Cargar los datos en el formulario
        nameInput.value = student.name;
        lastNameInput.value = student.lastName;
        gradeInput.value = student.grade;
        dateInput.value = student.date;
        
        // Cambiar el texto del botón para indicar que estamos editando
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = "Actualizar estudiante";
    }
}

function deleteStudent(name, lastName) {
    // Filtramos el estudiante por su nombre y apellido
    const index = students.findIndex(student => student.name === name && student.lastName === lastName);
    if (index !== -1) {
        students.splice(index, 1); // Elimina el estudiante del array
        renderTable();  // Vuelve a renderizar la tabla después de eliminar
        calcularPromedio();
    }
}

function renderTable() {
    tableBody.innerHTML = '';  // Limpiar la tabla antes de re-renderizar
    students.forEach(student => addStudentToTable(student));  // Volver a agregar las filas
}

const promedioDiv = document.getElementById("average");

function calcularPromedio() {
    if (students.length === 0) {
        promedioDiv.textContent = "Promedio General del Curso: N/A";
        return;
    }

    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const promedio = total / students.length;

    // Mostrar solo el número sin el símbolo de porcentaje
    promedioDiv.textContent = `Promedio de Notas: ${promedio.toFixed(2)}`;
}

function mostrarTabla() {
    const table = document.getElementById("studentTable");
    if (students.length > 0) {
        table.classList.remove("hidden");
    }
}

// Validaciones de los campos "Nombre" y "Apellido" para evitar números
nameInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, ''); // Reemplaza todo lo que no sea letra o espacio
});

lastNameInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, ''); // Reemplaza todo lo que no sea letra o espacio
});

// Validación en el campo "Nota" para evitar letras
gradeInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9\.]/g, ''); // Permite solo números y punto
});
