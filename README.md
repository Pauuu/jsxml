# jsxml

v.3
Se ha añadido un div en el que se cargan todas las opciones de tipo checkbox. Se han creado funciones para corregir cada tipo de pregunta. La presentación de los resultados se hace en un div.

v.2
Se ha añadido un elemento select al html y código js para leer el título y las opciones de tipo select y rellenar el select html. Además guarda la respuesta correcta para poder comprobar que la opción seleccionada es la correcta.

v.1
Primero carga el fichero html que contiene la referencia a un js, al cargar (window.onload), js pide los datos a preguntas.xml, el título y el número secreto, los _parsea_ y luego pone dentro del html el título y guarda en una variable _secret_ el valor suministrado.

Al ejecutarse la aplicación da una respuesta en función de lo que ponemos, si es mayor, menor o coincide con el número secreto.
