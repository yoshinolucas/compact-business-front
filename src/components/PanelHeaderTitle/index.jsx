import { Link } from "react-router-dom";


const PanelHeaderTitle = ({beforeTitle,title }) => {
    return(
        <div className="panel-title">
            <Link to={`/${beforeTitle}`}><h4><u>{beforeTitle}</u></h4></Link> <h4>&nbsp;&nbsp;&gt;&nbsp; </h4> <h3> {title}</h3>
        </div>       
    );
};

export default PanelHeaderTitle;