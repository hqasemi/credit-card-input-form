import "./AnimatedBackground.scss"
import skyBGPhoto from "./bg.png"

export const AnimatedBackground = () => {

    let itemsCount = Array.from(Array(100).keys())
    
    return (
        <div className="container">
            <img className="background" src={skyBGPhoto} />
            <p className="message">All your dreams can come true<br />if you have the courage to pursue them</p>
            {
                itemsCount.map(key=> <CircleContainer key={key}/>)
            }
        </div>
    )
}

const CircleContainer = () => {
    return (
        <div className="circle-container">
            <div className="circle"></div>
        </div>
    )
}
