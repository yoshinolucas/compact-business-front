import { Link } from "react-router-dom";
import Divisor from "../Divisor";
import MsgText from "../MsgText";


const PanelHeader = ({children,msg, title }) => {
    return(
        <div className="panel-header">
            <div className="wrapper-sb">
                <div className="panel-title">
                <Link to="/home"><h4><u>Início</u></h4></Link> <h4>&nbsp;&nbsp;&gt;&nbsp; </h4> <h3> {title}</h3>
                </div>
                {children}
            </div>
            <MsgText show={msg.show} style={msg.style} content={msg.content}/>
            
            <Divisor margin={12}/>
        </div>
    )
}

export default PanelHeader;