# Scrapiffy

Hecho por:
- Pedro Bereilh
- David Gilarranz
- Pablo Muñoz
- Gonzalo Álvarez

## ¿Qué es Scrapiffy?
- Scrapiffy es una API que permite comprobar si el contenido introducido ha sido pasteado en internet​.

- Actualmente permite comprobar tanto correos electrónicos como número de teléfonos.

## Tecnologías 
- Base de Datos: NoSQL (MongoDB)
- Api web: serapi
- Api xml: microservicio propio
- Entorno de ejecución: Node.js
- Archivo OpenAPI con descripción del servicio
- README con la información del funcionamiento y servicios

## Funcionamineto 
- Existen dos roles:
    - admin
    - usuario

### Servicios 

### cliente
- Usuario introduce en el buscador un email o un teléfono:
    - Si el contenido introducido es encontrado devuelve un mensaje de error
    - Si no lo encuentra, devuelve un mensaje de enhorabuena 

### apiDTD
- Validar usando dtd documentos XML 

### apiScrapiffy
- Api que nos da todas las rutas y nos permite usar el cliente 

### scraper
- Ayuda a scrapear la web y conseguir datos como emails y números de teléfonos

