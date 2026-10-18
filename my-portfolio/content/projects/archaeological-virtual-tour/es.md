## Acercar un yacimiento de difícil acceso

Cova Bonica, en Vallirana, cerca de Barcelona, conserva evidencias de las primeras comunidades neolíticas. El acceso físico es limitado y sus restos arqueológicos pueden resultar difíciles de interpretar sin conocimientos especializados. El proyecto de digitalización reúne documentación científica, conservación preventiva y divulgación: un registro fotogramétrico detallado conserva el estado de la cueva y las experiencias digitales ayudan a explorarla y comprenderla.

Mi contribución se centró en la **experiencia web interactiva**, desarrollada en colaboración con el Grup de Recerca del Quaternari (GRQ–SERP) de la Universitat de Barcelona. A partir de la digitalización realizada por el equipo, desarrollé un entorno que se puede explorar desde el navegador sin instalar software adicional.

## Explorar más allá de los puntos de vista fijos

El recorrido permite explorar en primera persona con controles de escritorio y táctiles. Cada visitante puede desplazarse por la cueva y abrir puntos de interés sobre los materiales arqueológicos, eligiendo su propio itinerario y ritmo.

Una malla de colisión delimita las zonas transitables y unas pasarelas modeladas digitalmente guían el desplazamiento. Una estructura de navegación define rutas para personajes virtuales, cuyos comentarios aportan una capa narrativa a la visita. La aplicación mantiene los contenidos interpretativos separados de la visualización y la interacción para poder actualizarlos de forma independiente.

## Llevar la fotogrametría al navegador

Los modelos arqueológicos detallados requieren un tratamiento cuidadoso para funcionar en dispositivos de uso cotidiano. La experiencia combina:

- **Niveles de detalle según la distancia**, con un flujo automatizado propio en Blender para generar versiones simplificadas de los modelos.
- Carga progresiva y caché del navegador, evitando descargas repetidas y repartiendo el uso de recursos durante la visita.
- Texturas optimizadas y reutilización de elementos para reducir el consumo de memoria.
- Un visor de objetos que carga primero una versión optimizada y permite solicitar mayor resolución, liberando recursos gráficos cuando dejan de utilizarse.

La aplicación descarga inicialmente unos **20 MB**, con contenidos adicionales que se cargan progresivamente hasta unos **30 MB** a medida que se explora el entorno.

## Comprender cómo se utiliza el recorrido

La aplicación incorpora analíticas anónimas sobre acciones como abrir puntos de interés, utilizar controles de la interfaz y el tiempo dedicado a la experiencia. Los mapas de calor muestran qué zonas despiertan más interés y cómo se reparte el tiempo entre explorar y leer, sin recopilar datos personales.

## Investigación y colaboración

Compartimos este trabajo mediante un **artículo breve y un póster** en la [XVIII Reunión Técnica de Conservación-Restauración](https://reuniotecnicacrac.com/en/), organizada por Conservadors-Restauradors Associats de Catalunya (CRAC) en CaixaForum Barcelona los días **19 y 20 de noviembre de 2026**.

La contribución, *La digitalització com a eina de conservació i divulgació de jaciments arqueològics. El cas de Cova Bonica (Vallirana, Barcelona)*, fue firmada por **Laura Gómez-Morgado, Nadina Carla Cardillo Garreta, Montserrat Sanz y Joan Daura**.

El proyecto reúne la documentación fotogramétrica, la investigación arqueológica, la conservación y el recorrido audiovisual realizados por el equipo, junto con mi contribución a la aplicación web inmersiva.

El prototipo utiliza algunos modelos de objetos arqueológicos de la **Cova del Rinoceront** como material de referencia para desarrollar las técnicas de interacción y optimización. Las próximas incorporaciones incluyen objetos de la propia Cova Bonica, nuevos descubrimientos y más idiomas.
