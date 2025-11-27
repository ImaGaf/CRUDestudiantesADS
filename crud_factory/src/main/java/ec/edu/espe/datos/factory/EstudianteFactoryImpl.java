package ec.edu.espe.datos.factory;

import ec.edu.espe.datos.model.Estudiante;

public class EstudianteFactoryImpl implements EstudianteFactory {

    @Override
    public Estudiante crearEstudiante(String id, String nombres, int edad) {
        return Estudiante.crear(id, nombres, edad);
    }
}
