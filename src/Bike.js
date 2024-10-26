import './Bike.css'

export function Bike({crank_angle, wheel_angle, initial}) {
    const nothing = (e) => {e.stopPropagation()}
    const display_crank_angle = crank_angle * -1;
    return (
        <div style={{width: "80vw", height: "60vw", backgroundColor: "transparent", position: "relative"}}>
        <img draggable={false} style={{position: "absolute", top: 0, left: 0, width: "80vw", height: "60vw", zIndex: 3, display: initial ? "block" : "none", touchAction: "none"}} src="/assets/spinner/instructions.webp" />
        <img className="spinner" src="/assets/spinner/spinner.webp" style={{transform: `rotate(${wheel_angle}deg)`}} />
        <img draggable={false} style={{position: "absolute", top: 0, left: 0, width: "80vw", height: "60vw", zIndex: 2, touchAction: "none"}} src="/assets/spinner/bike.webp" />
        <img draggable={false} style={{position: "absolute",
                top: "33vw", left: "35vw", width: "18vw",
                zIndex: "10", touchAction: "none",
                transform: `rotate(${display_crank_angle}deg)`}} src="/assets/spinner/crank.webp" />
        </div>
    )
}

