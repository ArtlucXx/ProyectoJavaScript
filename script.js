const students = [];

document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtener valores
    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const grade = parseFloat(document.getElementById("grade").value);

    // Limpiar mensajes anteriores
    document.getElementById("errorName").textContent = "";
    document.getElementById("errorLastName").textContent = "";
    document.getElementById("errorGrade").textContent = "";

    let hasError = false;

    // Validaciones y mensajes de error en español
    if (!name) {
        document.getElementById("errorName").textContent = "Por favor ingrese el nombre.";
        hasError = true;
    }
    if (!lastName) {
        document.getElementById("errorLastName").textContent = "Por favor ingrese el apellido.";
        hasError = true;
    }
    if (isNaN(grade) || grade < 1 || grade > 7) {
        document.getElementById("errorGrade").textContent = "Ingrese una nota válida entre 1.0 y 7.0.";
        hasError = true;
    }

    if (hasError) return;

    // Crear estudiante y agregar al arreglo
    const student = { name, lastName, grade };
    students.push(student);

    // Mostrar en tabla
    addStudentToTable(student);

    // Calcular promedio
    calcularPromedio();

    // Limpiar formulario
    this.reset();
});

const tableBody = document.querySelector("#studentTable tbody");

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.grade.toFixed(1)}</td>
    `;
    tableBody.appendChild(row);
}

const promedioDiv = document.getElementById("average");

function calcularPromedio() {
    if (students.length === 0) {
        promedioDiv.textContent = "Promedio General del Curso: N/A";
        return;
    }

    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const promedio = total / students.length;

    promedioDiv.textContent = `Promedio General del Curso: ${promedio.toFixed(2)}`;
}
