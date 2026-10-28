# Visualizador de listas enlazadas

Aplicación web que muestra paso a paso, con bloques y flechas, cómo funcionan las listas enlazadas simples (LES) y doblemente enlazadas (LDE). Escribes código en un Java simplificado, lo ejecutas y el diagrama cambia línea por línea tal como ocurre en el código.

Pensada como apoyo para el curso de Estructuras de Datos (Universidad Nacional de Piura), con ejemplos basados en las diapositivas de clase.

**Demo:** https://rax-source.github.io/ed-grafico-LE/

## Cómo usarla

1. Elige un ejemplo en la lista desplegable (por ejemplo, "LDE: insertar en medio") o escribe tu propio código.
2. Pulsa **Ejecutar**.
3. Avanza o retrocede con los botones ◀ ▶ o con las flechas del teclado, o pulsa **Reproducir**.
4. La línea que se ejecuta se resalta en el código y el diagrama se actualiza en cada paso.

En el diagrama, cada nodo es un bloque `[ant | dato | sig]`. Las flechas azules son `sig` y las naranjas son `ant`. Las variables (`cab`, `p`, `q`...) aparecen como etiquetas sobre el nodo al que apuntan. Los nodos sin ninguna referencia se atenúan y se marcan como "sin referencia".

## Lenguaje soportado

Un subconjunto de Java con el estilo del curso: declaraciones al inicio y asignaciones en líneas distintas.

```java
Nodo cab;

void insInicio(Nodo p) {
  if (p != null) {
    p.sig = cab;
    cab = p;
  }
}

void main() {
  Nodo p;
  p = new Nodo(7);
  insInicio(p);
}
```

- Tipos: `Nodo` e `int`.
- Campos del nodo: `dato`, `sig`, `ant`.
- Instrucciones: asignaciones, `if` / `else`, `while`, llamadas a métodos y recursión.
- Operadores: `==`, `!=`, `<`, `>`, `&&`, `||`, `!`, `+`, `-`.
- El programa empieza en `void main()`.
- Una línea con el comentario `//@` omite de la animación los pasos de preparación anteriores.

Reglas del estilo del curso que la app valida:

- No se declara y asigna en la misma línea (`Nodo p = new Nodo();` no es válido; usa `Nodo p;` y luego `p = new Nodo();`).
- Todas las declaraciones van al inicio del método.
- No se declara dentro de `if` ni de `while`.

## Qué no incluye todavía

- Clases definidas por el usuario (`class LDE`, `class Nodo`) y constructores.
- `for`, `return`, `this`, arreglos, entrada por teclado y números aleatorios.
- Listas circulares.
- Mover los punteros arrastrándolos con el mouse.

## Estructura del proyecto

```
index.html          Página principal
css/style.css       Estilos
js/ejemplos.js      Ejemplos basados en las diapositivas
js/parser.js        Lee el código y lo convierte en instrucciones
js/interprete.js    Ejecuta y guarda el estado de cada paso
js/dibujo.js        Dibuja los nodos y las flechas
js/app.js           Botones, resaltado de línea y reproducción
```

No necesita instalación ni servidor: se puede abrir `index.html` directamente en el navegador.

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE).
