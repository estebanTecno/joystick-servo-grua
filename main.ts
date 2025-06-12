function moverSuave (actual: number, destino: number, paso: number) {
    if (Math.abs(destino - actual) <= paso) {
        return destino
    }
    return actual + Math.sign(destino - actual) * paso
}
let ejeFiltrado = 0
let anguloGrúaDeseado = 0
let promedioY = 0
let ejeY = 0
let anguloRotacionDeseado = 0
let promedioPot = 0
let valorPot = 0
let historialEjeY: number[] = []
let historialPot: number[] = []
let anguloGrúaActual = 90
let anguloRotacionActual = 90
let PASO = 5
let BUFFER = 5
makerbit.connectLcd(39)
basic.forever(function () {
    // --- Potenciómetro (P2) suavizado ---
    valorPot = pins.analogReadPin(AnalogPin.P2)
    historialPot.push(valorPot)
    if (historialPot.length > BUFFER) {
        historialPot.shift()
    }
    let sumaPot = historialPot.reduce((a: number, b: number) => a + b, 0)
promedioPot = Math.constrain(sumaPot / historialPot.length, 0, 1023)
    anguloRotacionDeseado = Math.map(promedioPot, 0, 1023, 180, 0)
    // --- Joystick eje Y (P3) suavizado ---
    ejeY = pins.analogReadPin(AnalogPin.P3)
    historialEjeY.push(ejeY)
    if (historialEjeY.length > BUFFER) {
        historialEjeY.shift()
    }
    let sumaY = historialEjeY.reduce((a: number, b: number) => a + b, 0)
promedioY = sumaY / historialEjeY.length
    anguloGrúaDeseado = 90
    if (promedioY <= 700 || promedioY >= 800) {
        ejeFiltrado = Math.constrain(promedioY, 400, 850)
        anguloGrúaDeseado = Math.map(ejeFiltrado, 400, 850, 130, 50)
    }
    // --- Movimiento suave ---
    anguloRotacionActual = moverSuave(anguloRotacionActual, anguloRotacionDeseado, PASO)
    anguloGrúaActual = moverSuave(anguloGrúaActual, anguloGrúaDeseado, PASO)
    // --- Enviar a servos ---
    // Rotación
    pins.servoWritePin(AnalogPin.P1, anguloRotacionActual)
    // Brazo
    pins.servoWritePin(AnalogPin.P0, anguloGrúaActual)
    // --- Mostrar en LCD ---
    makerbit.showStringOnLcd1602("JoyY:" + ejeY + " Pot:" + valorPot, makerbit.position1602(LcdPosition1602.Pos1), 32)
    basic.pause(15)
})
