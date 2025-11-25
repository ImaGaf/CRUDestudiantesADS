import { EstudianteRepository } from "../datos/repository/EstudianteRepository.js";
import { EstudianteService } from "../logica_negocio/EstudianteService.js";

export class EstudianteUI {

  constructor() {
    this.repo = EstudianteRepository.getInstance();
    this.service = new EstudianteService(this.repo);

    this.btnGuardar = document.getElementById("btnGuardar");
    this.table = document.getElementById("tablaEstudiantes");

    this.modo = "crear";     
    this.idEditando = null;  

    this.btnGuardar.addEventListener("click", () => this.guardar());

    this.mostrarTabla();
  }


  guardar() {
    const id = document.getElementById("txtId").value;
    const nombres = document.getElementById("txtNombres").value;
    const edad = parseInt(document.getElementById("txtEdad").value);

    if (this.modo === "crear") {
      try {
        this.service.crearEstudiante({ id, nombres, edad });
        alert("Estudiante agregado correctamente");
      } catch (e) {
        alert(e.message);
      }
    }

    if (this.modo === "editar") {
      try {
        this.service.editarEstudiante(this.idEditando, { nombres, edad });
        alert("Estudiante actualizado");

        this.modo = "crear";
        this.btnGuardar.textContent = "Guardar";
        document.getElementById("txtId").disabled = false;

      } catch (e) {
        alert(e.message);
      }
    }

    this.limpiarCampos();
    this.mostrarTabla();
  }

  cargarParaEditar(id) {
    const est = this.service.repository.buscarPorId(id);

    document.getElementById("txtId").value = est.id;
    document.getElementById("txtNombres").value = est.nombres;
    document.getElementById("txtEdad").value = est.edad;

    document.getElementById("txtId").disabled = true;

    this.modo = "editar";
    this.idEditando = id;
    this.btnGuardar.textContent = "Actualizar";
  }

  eliminar(id) {
    if (confirm("¿Seguro que deseas eliminar este estudiante?")) {
      this.service.eliminarEstudiante(id);
      alert("Estudiante eliminado");
      this.mostrarTabla();
    }
  }


  mostrarTabla() {
    const lista = this.service.listarEstudiantes();

    this.table.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Nombres</th>
        <th>Edad</th>
        <th>Acciones</th>
      </tr>
    `;

    lista.forEach(est => {
      this.table.innerHTML += `
        <tr>
          <td>${est.id}</td>
          <td>${est.nombres}</td>
          <td>${est.edad}</td>
          <td>
            <button onclick="ui.cargarParaEditar('${est.id}')">Editar</button>
            <button onclick="ui.eliminar('${est.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });
  }

  limpiarCampos() {
    document.getElementById("txtId").value = "";
    document.getElementById("txtNombres").value = "";
    document.getElementById("txtEdad").value = "";

    document.getElementById("txtId").disabled = false;
  }
}

window.ui = new EstudianteUI();
