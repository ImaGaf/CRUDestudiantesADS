package ec.edu.espe.presentacion;

import ec.edu.espe.controller.EstudianteController;
import ec.edu.espe.logica_negocio.EstudianteService;
import ec.edu.espe.logica_negocio.strategy.SortByAgeStrategy;
import ec.edu.espe.logica_negocio.strategy.SortByNameStrategy;
import ec.edu.espe.datos.model.Estudiante;

public class StrategyDemo {
    public static void main(String[] args) {
        EstudianteController controller = new EstudianteController(new EstudianteService());

        System.out.println("--- Agregando Estudiantes ---");
        controller.crearEstudiante("3", "Carlos", 25);
        controller.crearEstudiante("1", "Ana", 22);
        controller.crearEstudiante("2", "Bernardo", 30);

        System.out.println("\n--- Estrategia por defecto (Ordenar por ID) ---");
        print(controller.obtenerTodos());

        System.out.println("\n--- Cambiando Estrategia a: Ordenar por Nombre ---");
        controller.setSortingStrategy(new SortByNameStrategy());
        print(controller.obtenerTodos());

        System.out.println("\n--- Cambiando Estrategia a: Ordenar por Edad ---");
        controller.setSortingStrategy(new SortByAgeStrategy());
        print(controller.obtenerTodos());
    }

    private static void print(java.util.List<Estudiante> list) {
        for (Estudiante e : list) {
            System.out.println(e.getId() + " - " + e.getNombres() + " - " + e.getEdad());
        }
    }
}
