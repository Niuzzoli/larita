type Bezier = [number, number, number, number];

/** Llegadas: arranca rápido y frena largo. Es la curva de casi todo lo que entra. */
export const EASE_OUT: Bezier = [0.16, 1, 0.3, 1];

/** Movimiento de algo que ya está en pantalla. */
export const EASE_IN_OUT: Bezier = [0.77, 0, 0.175, 1];
