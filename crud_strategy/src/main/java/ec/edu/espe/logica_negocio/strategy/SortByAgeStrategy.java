package ec.edu.espe.logica_negocio.strategy;

import ec.edu.espe.datos.model.Estudiante;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class SortByAgeStrategy implements SortingStrategy<Estudiante> {
    @Override
    public List<Estudiante> ordenar(List<Estudiante> estudiantes) {
        // evidencia de aplicación de estrategia
        System.out.println("DEBUG: Aplicando Estrategia -> Ordenar por Edad");
        return estudiantes.stream()
                .sorted(Comparator.comparingInt(Estudiante::getEdad))
                .collect(Collectors.toList());
    }
}
