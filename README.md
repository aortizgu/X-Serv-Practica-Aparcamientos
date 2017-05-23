[Try me](https://aortizgu.github.io/X-Serv-Practica-Aparcamientos/index.html)
[Vídeo](https://youtu.be/yjd9lwQ6UkU)
# X-Serv-Practica-Aparcamientos
Repositorio de inicio de la práctica final - Curso 2016/2017
[enunciado](http://cursosweb.github.io/programas/IT-AT.pdf)

4.1. Aparcamientos para residentes en Madrid
(mayo 2017, borrador)
La práctica consiste en la creación de una aplicación HTML5 que permita
explorar los lugares en el municipio de Madrid que cuentan con aparcamientos
para residentes, a partir de ahora instalaciones, construida a partir de los datos
proporcionados por el propio ayuntamiento. Se trata de mostrar los datos de la
forma más atractiva posible, incluyendo el nombre del aparcamiento (campo title),
la dirección (calle, código postal), la descripción (campo organization-desc), fotos
de la zona, localización en un mapa, etc. Tambi´en se permitirá construir colecciones
personales de aparcamientos, y almacenarlas de forma persistente.
4.1.1. Enunciado
Concretamente, la aplicación mostrará al arrancar un banner (imagen) con el
nombre y/o logotipo del sitio y un panel con tres pestañas: la principal, la de
gestión de colecciones y la de gestión de instalaciones.

//PRINCIPAL
La pestaña principal contará con las siguientes zonas:
1. Una zona con un mapa, donde se mostrará la localización de las instalaciones
seleccionadas. Cuando se seleccione una instalación, se mostrará un marcador
sobre el mapa con su nombre. Cada marcador tendrá una opción para
quitarlo.
2. Una zona donde se mostrará una lista con todas las instalaciones. Cuando
arranque la aplicación, no habrá ninguna sino que en su lugar habrá un botón
para cargar el fichero JSON con todas las instalaciones (ver más adelante).
Como sin instalaciones la aplicación no puede hacer gran cosa, hasta que la
lista no haya sido cargada, las demás zonas de información de las instalaciones
estarán desactivadas. Una vez cargado el fichero JSON, como son muchas
instalaciones, se mostrarán en una tabla con scroll (barra de desplazamiento)
o similar.
3. Una zona donde se mostrará la información sobre la instalación seleccionada
(al menos su nombre, su dirección, y un carrusel con sus fotos, si las hay).
4. Una zona donde se mostrará las instalaciones de la colección seleccionada en
la pestaña de colecciones (ver más abajo).
Las instalaciones podrán seleccionarse bien picando sobre ellas en la lista de
instalaciones, en la lista de instalaciones de una colección, o sobre su marcador en
el mapa.

//GESTIÓN DE COLLECCIONES
En la pestaña de gestión de colecciones se mostrará la siguiente información:
1. Un listado de todas las instalaciones, una vez han sido cargadas (ver pestaña
principal), de forma similar a como se ven en la pestaña principal.
2. Un listado de las colecciones que se hayan creado, y un formulario para crear
una nueva colección indicando su nombre. Sobre el listado se podrá seleccionar
una colección picando sobre ella.
3. Un listado de las instalaciones en la colección seleccionada. 
Cuando haya una colección seleccionada y se visite la pestaña principal, se mostrarán las
instalaciones de esa colección en la zona creada para tal efecto.
Para añadir instalaciones a una colección, se podrá “arrastrar” una instalación
desde el listado de instalaciones al listado de la colección seleccionada.

//GESTIÓN DE INSTALACIONES
En la pestaña de gestión de instalaciones, se mostrará:
1. El nombre, la dirección, la descripción de la instalación seleccionada - la
instalación que se muestra es la que se ha seleccionado en la pestaña principal.
2. La lista de los usuarios de Google+ asignados a esa instalación. 
Para añadir usuarios a una instalación, se podrá “arrastrar” un usuario desde el listado
de usuarios al listado de la instalación seleccionada.
3. Una lista con usuarios de Google+ disponibles. 
Al principio se mostrará un botón para incluir usuarios de Google+. Al presionar el botón se abrirá una
conexión con un servidor WebSocket que irá enviando identificadores de usuarios
de Google+, que serán incluidos en esta zona según se vayan recibiendo.
No deben aparecer usuarios repetidos.

//SERVIDOR
4. El código del servidor WebSocket se podrá descargar de https://github.
com/CursosWeb/PFinalWebSocketServer y se ejecutarán de la siguiente
manera desde la línea de comandos:
$ python PFinalWebSocketServer.py --port 12345
donde el puerto podría ser cualquier otro. De hecho, depende de vuestra
configuración, puede que tengáis que poner como puerto el 80, por lo que
deb´eis lanzar el servidor con sudo.

//GENERAL
En todas las pestañas, además, se verán dos botones, con la siguiente funcionalidad:
Un botón para guardar las colecciones y las asignaciones de usuarios de Google+
a instalaciones. Cuando se pulse, aparecerá un formulario para rellenar
un token de GitHub y el nombre de un repositorio y un fichero, y se almacenará
en ´el toda la información, como un documento JSON.
Un botón para cargar la información desde un fichero en GitHub, que cargará
el contenido de un fichero JSON con colecciones y asignaciones de usuarios
de Google+ a hoteles, y las mostrará en esta pestaña.
Para la maquetación de la aplicación se utilizará Bootstrap, haciendo lo posible
para que la aplicación sea usable tanto en un navegador de escritorio (con una
ventana utilizable grande) como en un móvil (con una pantalla utilizable pequeña,
en la que no se podrán ver todos los elementos de la aplicación a la vez). Se utilizará,
en la medida de lo razonable, CSS3 para todo lo relacionado con el aspecto de
la aplicación. Se usará Leaflet para mostrar los mapas. Se podrán utilizar otras
bibliotecas JavaScript en lo que pueda ser conveniente.

//PARKINGS
El fichero JSON con la lista de instalaciones que se usará será el que proporciona
el Ayuntamiento de Madrid. Puede verse este fichero y una aplicación de prueba
de concepto muy simple de algunos aspectos de la práctica en:
Fichero con los datos abiertos de aparcamientos para residentes proporcionado
por el Ayuntamiento de Madrid:
http://datos.madrid.es/egob/catalogo/202584-0-aparcamientos-residentes.json
Descripción del fichero:
http://datos.madrid.es/portal/site/egob/menuitem.c05c1f754a33a9fbe4b2e4b284f1a5a0/?vgnextoid=e84276ac109d3410VgnVCM2000000c205a0aRCRD&vgnextchannel=374512b9ace9f310VgnVCM100000171f5a0aRCRD&gnextfmt=default

//FOTOS
Copia del fichero anterior en el repositorio CursosWeb/Code de GitHub:
Para obtener las fotos cercanas a una localización (latitud y longitud), se
podrán utilizar las que proporciona Wikimedia Commons, utlizando urls como
la siguiente:

Formato JSON:
https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=40.426687899755734|-3.6996173701222492&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200

Formato JSONP:
https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=40.426687899755734|-3.6996173701222492&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?

Explicación en StackOverflow:
http://stackoverflow.com/questions/23990161/wikimedia-commons-api-search-images-by-latitude-longitude



4.1.2. Funcionalidad optativa
En general, se podrá añadir cualquier funcionalidad a la aplicación, mientras
no perjudique o impida la funcionalidad básica descrita en el apartado anterior. A
modo de ejemplos, se proponen las siguientes ideas:
Utilización de otras APIs
Uso de LocalStorage
Funcionalidad para que funcione off-line
Realizar la autenticación en GitHub dinámicamente, usando OAuth2 de forma
que el usuario se autentique con su cuenta de GitHub, y obtenga el token
de esa forma.
Optimizar la aplicación para que cargue más rápido.
Utilización de Flickr y otros servicios como fuente de fotos.
Todas las opciones que necesitan escribir en repositorios GitHub, requerirían
autenticación previa por parte del usuario.
