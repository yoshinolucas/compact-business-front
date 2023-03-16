import './MsgText.css';


const MsgText = (props) => {
    return(
        <>
        {
            props.show && 
            <div className={`msg ${props.style}`}>
                <h3>{props.content}</h3>
            </div>
        }
        </>
    )
}

export default MsgText