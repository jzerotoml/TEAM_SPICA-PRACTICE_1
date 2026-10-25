# Flight PTY frontend

Interfaz pública de consulta de vuelos construida con React, TypeScript y Vite.
No incluye acceso de administración.

## Comandos

- `npm run dev`: inicia Vite.
- `npm test`: ejecuta las pruebas del cliente HTTP con Node 24.
- `npm run typecheck`: verifica los tipos TypeScript.
- `npm run build`: verifica tipos y compila para producción.
- `npm run preview`: sirve el build local.

## API y navegación

Vite reenvía `/flights` a FastAPI en `http://127.0.0.1:8000`. El tablero consulta
`GET /flights/` y cada detalle consulta `GET /flights/{flight_number}`. En
producción, el proxy del hosting debe enviar `/flights/` al backend y el resto
de rutas de la interfaz al fallback de la SPA.

El tablero usa `/` con parámetros opcionales `q` y `status`. Los detalles usan
`/flight?number=…`; así la interfaz no ocupa el prefijo `/flights` reservado a
la API. El detalle se vuelve a consultar al abrir su URL.
