function UNLOAD_BALL () {
    Quadruped.Reset()
    Quadruped.Stand()
    Quadruped.Control_a(Mov_ang.R_swing, 10, 1)
    Quadruped.Steering_gear(1, 500, 1)
    Quadruped.Control_a(Mov_ang.R_swing, 10, 4)
    Quadruped.Control_a(Mov_ang.R_swing, 0, 2)
    Quadruped.Steering_gear(1, 1500, 1)
    Quadruped.Gait(gait.S_TROT)
    Quadruped.Control_s(Mov_dir.For, 5, 8)
}
function PID_PROC () {
    x = Quadruped.Line_return(Line_Position.De_position)
    SPEED = x * KP
    if (SPEED < 0) {
        Quadruped.Control_s(Mov_dir.Turn_l, Math.abs(SPEED), 0)
    } else if (SPEED >= 0) {
        Quadruped.Control_s(Mov_dir.Turn_r, SPEED, 0)
    }
}
function PID_UNIT () {
    KP = 0.078
}
let STA = 0
let KP = 0
let SPEED = 0
let x = 0
let STA2 = 0
PID_UNIT()
Quadruped.Image_init()
serial.redirect(
SerialPin.P8,
SerialPin.P0,
BaudRate.BaudRate115200
)
Quadruped.OnToggle(FunctionID.color)
basic.pause(5000)
while (true) {
    let COLOUR = 0
    STA2 = Quadruped.Colorreturn()
    if (COLOUR == 1) {
        basic.showIcon(IconNames.Yes)
        Quadruped.TogetherOn(ColorLineID.Black, ColorID.Red)
        break;
    } else if (COLOUR == 2) {
        basic.showIcon(IconNames.Yes)
        Quadruped.TogetherOn(ColorLineID.Black, ColorID.Blue)
        break;
    } else if (COLOUR == 4) {
        basic.showIcon(IconNames.Yes)
        Quadruped.TogetherOn(ColorLineID.Black, ColorID.Yellow)
        break;
    }
    basic.showIcon(IconNames.No)
}
Quadruped.init()
Quadruped.Start()
Quadruped.Height(10)
Quadruped.Gait(gait.S_TROT)
basic.forever(function () {
    Quadruped.Heartbeat()
    STA = Quadruped.Line_return(Line_Position.status)
    if (1 == STA) {
        Quadruped.Control_s(Mov_dir.For, 6, 0)
        PID_PROC()
    } else {
        Quadruped.Heartbeat()
        Quadruped.Control_s(Mov_dir.For, 0, 0)
    }
    Quadruped.Heartbeat()
    STA = Quadruped.Shapereturn()
    if (STA2 != 0) {
        UNLOAD_BALL()
        STA2 = 0
    }
    Quadruped.Heartbeat()
})
