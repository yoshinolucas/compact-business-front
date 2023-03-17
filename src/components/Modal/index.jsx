import './Modal.css';
const Modal = ({ children, isOpen, id="modal", setIsOpen, windowClose = true }) => {
    if(!isOpen) return null;

    const handleWindowsClose = (e) => {
        if(e) e.preventDefault();
        if(e.target.id !== id) return;
        setIsOpen(false);
    };
    
    return(
        <div id={id} className="background-modal-shadow" onClick={handleWindowsClose}>
            <div className="modal">
                <div className="modal-header">
                    <button className='transparent' onClick={() => setIsOpen(false)}><i className='fa fa-arrow-left'></i></button>
                </div>
                {children}
            </div>
        </div>
    )
}
export default Modal;