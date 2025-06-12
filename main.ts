// Función que mueve un valor actual hacia un valor destino de a un paso (step)
function moverSuave (actual: number, destino: number, step: number) {
    if (Math.abs(destino - actual) <= step) {
        return destino
    } else if (destino > actual) {
        return actual + step
    } else {
        return actual - step
    }
}
let paso = 0
let ejeFiltrado = 0
let promedioEjeY = 0
let ejeY = 0
let anguloRotacionDeseado = 0
let promedioPot = 0
let valorPot = 0
let historialEjeY: number[] = []
// Variables para el filtro de promedio móvil
let historialPot: number[] = []
let anguloGrúa = 90
let anguloRotacion = 90
// Ángulos actuales que se irán actualizando suavemente
let anguloGrúaActual = anguloGrúa
let anguloRotacionActual = anguloRotacion
// Ajusta para mayor suavizado (más grande = más suave)
let TAMANO_BUFFER = 5
makerbit.connectLcd(39)
basic.forever(function () {
    // --- Leer potenciómetro con suavizado ---
    valorPot = pins.analogReadPin(AnalogPin.P2)
    historialPot.push(valorPot)
    if (historialPot.length > TAMANO_BUFFER) {
        historialPot.shift()
    }
    promedioPot = historialPot.reduce((sum, val) => sum + val, 0) / historialPot.length
    promedioPot = Math.constrain(promedioPot, 0, 1023)
    anguloRotacionDeseado = Math.map(promedioPot, 0, 1023, 180, 0)
    anguloRotacionDeseado = Math.constrain(anguloRotacionDeseado, 0, 180)
    // --- Leer joystick eje Y con suavizado ---
    ejeY = pins.analogReadPin(AnalogPin.P3)
    historialEjeY.push(ejeY)
    if (historialEjeY.length > TAMANO_BUFFER) {
        historialEjeY.shift()
    }
    promedioEjeY = historialEjeY.reduce((sum, val) => sum + val, 0) / historialEjeY.length
    let anguloGrúaDeseado: number
if (promedioEjeY > 700 && promedioEjeY < 800) {
        anguloGrúaDeseado = 90
    } else {
        ejeFiltrado = Math.constrain(promedioEjeY, 400, 850)
        anguloGrúaDeseado = Math.map(ejeFiltrado, 400, 850, 130, 50)
        anguloGrúaDeseado = Math.constrain(anguloGrúaDeseado, 50, 130)
    }
    // --- Suavizar movimiento de los servos (cambiar 5 grados por ciclo, más rápido) ---
    paso = 5
    anguloRotacionActual = moverSuave(anguloRotacionActual, anguloRotacionDeseado, paso)
    anguloGrúaActual = moverSuave(anguloGrúaActual, anguloGrúaDeseado, paso)
    // Enviar posición suavizada a servos
    pins.servoWritePin(AnalogPin.P1, anguloRotacionActual)
    pins.servoWritePin(AnalogPin.P0, anguloGrúaActual)
    // Mostrar valores (puedes mostrar los valores actuales o los promedios)
    makerbit.showStringOnLcd1602("JoyY:", makerbit.position1602(LcdPosition1602.Pos1), 16)
    makerbit.showStringOnLcd1602("" + (ejeY), makerbit.position1602(LcdPosition1602.Pos6), 16)
    makerbit.showStringOnLcd1602("Pot:", makerbit.position1602(LcdPosition1602.Pos17), 16)
    makerbit.showStringOnLcd1602("" + (valorPot), makerbit.position1602(LcdPosition1602.Pos22), 16)
    // Velocidad del movimiento suavizado
    basic.pause(15)
})
