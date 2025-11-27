# Documentación del Patrón Strategy en CRUD Estudiantes

Este documento detalla la implementación del patrón de diseño **Strategy** en el módulo `crud_strategy` y lo compara con la implementación base (`crudbase`) para resaltar sus diferencias, ventajas y beneficios.

## 1. Diferencias: `crud_strategy` vs `crudbase`

La diferencia fundamental radica en cómo se maneja el comportamiento de **ordenamiento** de la lista de estudiantes.

*   **En `crudbase` (Sin Patrón):**
    *   La lógica de negocio (`EstudianteService`) simplemente recupera los datos del repositorio y los devuelve tal cual.
    *   Si se quisiera ordenar la lista, se tendría que modificar directamente el método `listarEstudiantes` dentro del servicio.
    *   Para soportar múltiples ordenamientos (por nombre, por edad, por ID), se necesitarían múltiples métodos (`listarPorNombre`, `listarPorEdad`) o estructuras `if/else` complejas dentro del servicio.
    *   **Resultado:** Código rígido, difícil de mantener y que viola el principio Open/Closed.

*   **En `crud_strategy` (Con Patrón Strategy):**
    *   Se introduce una interfaz `SortingStrategy` que define el contrato para los algoritmos de ordenamiento.
    *   Se crean clases separadas para cada criterio de ordenamiento (`SortByIdStrategy`, `SortByNameStrategy`, `SortByAgeStrategy`).
    *   `EstudianteService` delega la tarea de ordenar a un objeto estrategia. No sabe *cómo* se ordena, solo sabe que la estrategia lo hará.
    *   **Resultado:** Código flexible, extensible y limpio.

## 2. Beneficios de Aplicar el Patrón Strategy

La aplicación de este patrón aporta significativas mejoras a la arquitectura de la aplicación:

1.  **Principio Open/Closed (Abierto/Cerrado):** Podemos agregar nuevas formas de ordenar (ej. por promedio, por fecha de ingreso) creando nuevas clases que implementen `SortingStrategy`, *sin tocar ni una sola línea de código* de `EstudianteService`.
2.  **Eliminación de Condicionales:** Se evitan largas sentencias `if-else` o `switch` dentro del servicio para decidir qué algoritmo de ordenamiento usar.
3.  **Intercambiabilidad en Tiempo de Ejecución:** El cliente (la interfaz de usuario o el controlador) puede cambiar el comportamiento del servicio dinámicamente llamando a `setSortingStrategy`.
4.  **Separación de Responsabilidades:** Cada clase de estrategia tiene una única responsabilidad (ordenar de una manera específica), lo que facilita la lectura y el mantenimiento.
5.  **Testabilidad:** Cada algoritmo de ordenamiento se puede probar de forma aislada (Unit Testing) sin depender de la lógica completa del servicio.

## 3. Partes Importantes del Código Documentadas

### A. La Interfaz de la Estrategia (`SortingStrategy.java`)
Define el comportamiento común para todas las estrategias de ordenamiento.
```java
public interface SortingStrategy<T> {
    // Método que todas las estrategias deben implementar
    List<T> ordenar(List<T> items);
}
```

### B. El Contexto (`EstudianteService.java`)
Es la clase que utiliza la estrategia. Mantiene una referencia a la estrategia actual y permite cambiarla.

```java
public class EstudianteService {
    // Referencia a la estrategia (Composición)
    private SortingStrategy<Estudiante> sortingStrategy;

    public EstudianteService() {
        // ...
        // Estrategia por defecto (evita NullPointerException)
        this.sortingStrategy = new SortByIdStrategy();
    }

    // Setter para cambiar la estrategia dinámicamente (Inyección de Dependencia)
    public void setSortingStrategy(SortingStrategy<Estudiante> sortingStrategy) {
        this.sortingStrategy = sortingStrategy;
    }

    public List<Estudiante> listarEstudiantes() {
        // DELEGACIÓN: El servicio no ordena, delega esa tarea a la estrategia
        return sortingStrategy.ordenar(repository.listar());
    }
}
```

### C. Estrategias Concretas
Implementaciones específicas del algoritmo.
*   `SortByIdStrategy`: Ordena usando `Comparator.comparing(Estudiante::getId)`.
*   `SortByNameStrategy`: Ordena alfabéticamente por nombre.
*   `SortByAgeStrategy`: Ordena numéricamente por edad.

## 4. Cuadro Comparativo: Sin Patrón vs Con Strategy

| Criterio | Sin Patrón (`crudbase`) | Con Strategy (`crud_strategy`) |
| :--- | :--- | :--- |
| **Categoría** | N/A (Programación Procedural/Monolítica) | Comportamiento |
| **Propósito** | Listar datos simplemente | Encapsular algoritmos de ordenamiento intercambiables |
| **Problema que resuelve** | Acceso básico a datos | Necesidad de múltiples variantes de un algoritmo (ordenar) |
| **Aplicado en** | Lógica directa en `EstudianteService` | `EstudianteService` delegando a `SortingStrategy` |
| **Clases principales** | `EstudianteService` (hace todo) | `EstudianteService` (Contexto) + `SortingStrategy` (Interfaz) + Implementaciones |
| **Complejidad** | Baja (inicialmente) | Media (requiere más clases e interfaces) |
| **Flexibilidad** | Baja (difícil cambiar lógica sin editar código) | Alta (se pueden agregar estrategias sin tocar el servicio) |
| **Reutilización** | Baja (lógica acoplada al servicio) | Alta (las estrategias se pueden reusar en otros contextos) |
| **Impacto en código existente** | Alto (cada cambio requiere editar la clase principal) | Bajo (los cambios se hacen en nuevas clases) |
| **Ventaja principal** | Simplicidad para casos triviales | Mantenibilidad y extensibilidad a largo plazo |
| **Cuándo usarlo** | Cuando el algoritmo nunca cambiará | Cuando se tienen múltiples variantes de un algoritmo y se necesita cambiar entre ellas |
| **Escalabilidad** | Limitada (el servicio crece descontroladamente) | Muy escalable (el servicio se mantiene delgado) |
| **Facilita testing** | Difícil (hay que probar toda la lógica junta) | Fácil (se prueban las estrategias por separado) |

---
**Conclusión:** Aunque `crud_strategy` introduce más archivos, proporciona una arquitectura mucho más robusta y profesional, preparada para cambios futuros y requerimientos de negocio evolutivos, a diferencia de `crudbase` que es una solución estática.
