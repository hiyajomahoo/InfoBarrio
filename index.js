/*
	index.js
	- Punto de entrada que Expo usa para registrar el componente raíz.
	- `registerRootComponent` asegura que la app se registre correctamente
		tanto en Expo Go como en una build nativa.
*/
import { registerRootComponent } from 'expo';

import App from './App';

// Registra el componente raíz de la aplicación
registerRootComponent(App);
