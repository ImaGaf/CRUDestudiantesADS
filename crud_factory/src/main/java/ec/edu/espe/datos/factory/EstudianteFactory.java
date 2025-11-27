package ec.edu.espe.datos.factory;

import ec.edu.espe.datos.model.Estudiante;

public interface EstudianteFactory {
    Estudiante crearEstudiante(String id, String nombres, int edad);
}
