**RETO DE PRÁCTICA — FLIGHT STATUS API**
***Simulación técnica para Team Spica***

1. Situación
Una aerolínea dispone de un archivo Excel con información inicial de vuelos. El área operacional necesita una solución que permita consultar y actualizar el estado de sus vuelos mediante una API REST. La solución debe poder desplegarse en la nube y contar con mecanismos de observabilidad para detectar problemas de rendimiento y errores.

2. Objetivo del reto
Construir una solución funcional que tome como punto de partida el dataset proporcionado en Excel, valide y almacene los datos, exponga la información mediante una API REST y permita desplegar y observar el sistema utilizando Azure, Terraform y Dynatrace.

3. Material proporcionado
El archivo flight_status_dataset.xlsx contiene aproximadamente 100 registros de vuelos y un diccionario de datos. El dataset incluye registros válidos y algunos registros intencionalmente problemáticos. El equipo debe descubrirlos mediante su propio proceso de validación.

4. Requisitos funcionales
•	Importar los datos iniciales desde el archivo Excel.
•	Validar los datos antes de almacenarlos.
•	Persistir los vuelos en una base de datos.
•	Consultar todos los vuelos.
•	Consultar un vuelo específico mediante su identificador.
•	Registrar nuevos vuelos mediante la API.
•	Actualizar el estado de un vuelo.
•	Disponer de un endpoint de salud del servicio.
•	Manejar adecuadamente solicitudes inválidas y errores.

5. API mínima esperada
Método	Endpoint	Propósito
GET	/flights	Consultar vuelos
GET	/flights/{id}	Consultar un vuelo
POST	/flights	Registrar un vuelo
PATCH	/flights/{id}/status	Actualizar estado
GET	/health	Comprobar disponibilidad

6. Requisitos técnicos
•	API REST desarrollada con una tecnología apropiada para el equipo.
•	Base de datos PostgreSQL.
•	Despliegue en Microsoft Azure.
•	Infraestructura administrada mediante Terraform.
•	Observabilidad mediante Dynatrace.
•	Código almacenado y colaborado mediante GitHub.
•	Pruebas que permitan verificar el comportamiento de la solución.

7. Observabilidad
La solución debe permitir observar el comportamiento de la API. Como mínimo, el equipo debe poder identificar solicitudes, errores y tiempos de respuesta. Durante la práctica deberán provocar o simular situaciones anómalas para comprobar que la observabilidad realmente funciona.

8. Infraestructura
La infraestructura necesaria para ejecutar el sistema en Azure deberá ser definida mediante Terraform. El equipo debe evitar depender de una configuración manual que no pueda reproducirse.

9. Trabajo colaborativo
El proyecto debe desarrollarse como si fuera un pequeño equipo de ingeniería. Cada integrante puede asumir un área principal, pero la solución final debe estar integrada y funcionar como un único sistema.
•	Utilizar ramas para desarrollar funcionalidades.
•	Crear commits claros y relacionados con una tarea.
•	Usar Pull Requests para integrar cambios importantes.
•	Documentar decisiones técnicas relevantes.
•	Mantener una única fuente de verdad en el repositorio.

10. Restricciones del ejercicio
•	No se entrega una base de datos previamente poblada.
•	No se entrega la solución de importación del Excel.
•	No se entrega la arquitectura de código terminada.
•	El equipo debe decidir cómo organizar el proyecto.
•	El equipo debe determinar cómo validar y manejar los registros problemáticos.

11. Entregables
•	Repositorio GitHub con el código fuente.
•	Dataset original y/o documentación sobre el proceso de carga.
•	API funcional.
•	Base de datos con los datos procesados.
•	Archivos Terraform.
•	Pruebas.
•	Documentación básica de arquitectura y ejecución.
•	Sistema desplegado en Azure.
•	Configuración de observabilidad en Dynatrace.

12. Pruebas finales sugeridas
•	Consultar todos los vuelos.
•	Consultar un vuelo inexistente.
•	Crear un vuelo válido.
•	Intentar crear un vuelo inválido.
•	Actualizar el estado de un vuelo.
•	Enviar una solicitud mal formada.
•	Provocar una respuesta lenta y observarla.
•	Provocar un error del servidor y localizarlo mediante observabilidad.
•	Modificar infraestructura mediante Terraform y comprobar el resultado.

13. Criterio de finalización
El reto se considera completado cuando el equipo puede demostrar el recorrido completo: datos iniciales → validación → base de datos → API REST → despliegue en Azure → infraestructura reproducible con Terraform → observabilidad con Dynatrace → pruebas e identificación de fallos.

14. Preguntas que el equipo debe resolver
•	¿Cómo estructuraremos el proyecto?
•	¿Cómo identificaremos y validaremos los datos incorrectos?
•	¿Cómo pasaremos los datos del Excel a PostgreSQL?
•	¿Qué recursos de Azure necesitamos?
•	¿Cómo haremos reproducible la infraestructura?
•	¿Qué información necesitamos observar?
•	¿Cómo dividiremos el trabajo sin crear componentes aislados?
•	¿Cómo integraremos y probaremos todo antes de considerarlo terminado?

***Nota para el equipo: El propósito de este documento es plantear el problema. No existe una única forma correcta de implementarlo. Las decisiones de arquitectura forman parte del ejercicio.***
