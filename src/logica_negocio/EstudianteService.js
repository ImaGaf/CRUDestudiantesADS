import { Estudiante } from "../datos/model/Estudiante.js";

export class EstudianteService {
  constructor(repository) {
    this.repository = repository;
  }

  crearEstudiante(datos) {
    const est = Estudiante.crear(datos);

    if (this.repository.buscarPorId(est.id)) {
      throw new Error("El ID ya existe");
    }

    this.repository.agregar(est);
    return est;
  }

  editarEstudiante(id, nuevosDatos) {
    if (!this.repository.buscarPorId(id)) {
      throw new Error("Estudiante no encontrado");
    }

    return this.repository.editar(id, nuevosDatos);
  }

  eliminarEstudiante(id) {
    if (!this.repository.buscarPorId(id)) {
      throw new Error("Estudiante no encontrado");
    }

    return this.repository.eliminar(id);
  }

  listarEstudiantes() {
    return this.repository.listar();
  }
}
