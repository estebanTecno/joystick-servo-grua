let ejeFiltrado = 0
let ejeY = 0
let valorPot = 0
let anguloGrúa = 90
let anguloRotacion = 90
// Conectar pantalla LCD
makerbit.connectLcd(39)
// Posición inicial de los servos
// Servo grúa (sube/baja)
pins.servoWritePin(AnalogPin.P0, anguloGrúa)
// Servo rotación (estructura)
pins.servoWritePin(AnalogPin.P1, anguloRotacion)
// Servo rotación (estructura)
basic.forever(function () {
    // Leer potenciómetro en P2
    valorPot = pins.analogReadPin(AnalogPin.P2)
    valorPot = Math.constrain(valorPot, 0, 1023)
    // Mapear invertido para que gire en sentido opuesto
    anguloRotacion = Math.map(valorPot, 0, 1023, 180, 0)
    anguloRotacion = Math.constrain(anguloRotacion, 0, 180)
    // Enviar al servo de rotación
    pins.servoWritePin(AnalogPin.P1, anguloRotacion)
    // Leer joystick eje Y en P3
    ejeY = pins.analogReadPin(AnalogPin.P3)
    // Zona muerta: mantener servo en 90° si el valor es cercano al centro
    if (ejeY > 700 && ejeY < 800) {
        anguloGrúa = 90
    } else {
        ejeFiltrado = Math.constrain(ejeY, 400, 850)
        // Invertido y con mayor rango: 400 → 130°, 850 → 50°
        anguloGrúa = Math.map(ejeFiltrado, 400, 850, 130, 50)
        anguloGrúa = Math.constrain(anguloGrúa, 50, 130)
    }
    // Enviar al servo de la grúa
    pins.servoWritePin(AnalogPin.P0, anguloGrúa)
    // Mostrar valores en pantalla
    makerbit.showStringOnLcd1602("JoyY:", makerbit.position1602(LcdPosition1602.Pos1), 16)
    makerbit.showStringOnLcd1602("" + (ejeY), makerbit.position1602(LcdPosition1602.Pos6), 16)
    makerbit.showStringOnLcd1602("Pot:", makerbit.position1602(LcdPosition1602.Pos17), 16)
    makerbit.showStringOnLcd1602("" + (valorPot), makerbit.position1602(LcdPosition1602.Pos22), 16)
    basic.pause(100)
})
