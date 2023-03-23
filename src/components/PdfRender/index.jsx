import jsPDF from "jspdf";

// Create Document Component
const PdfRender = ({content, filename}) => {
    const downloadFileDocument = () => {
          
    }
    return(
        <>
        <button
        onClick={downloadFileDocument}
        className="btn-custom btn-border btn-pill warning-border"
        ><i className="fa fa-file"></i>PDF
        </button>
        </>
    );
}

export default PdfRender;