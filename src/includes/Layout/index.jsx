import { useEffect } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";

const Layout = ({
    children,
    hasSubtop, 
    background, 
    backgroundPanel,
    hasSidebar}) => {
    return(
        <>
        <Header hasSubtop={hasSubtop}/>   
        {hasSidebar && <Sidebar />} 
        <main>
            <div className='container' style={{backgroundColor:background,marginLeft: hasSidebar ? "90px" : '0px'}}>
                <div className='panel' style={{backgroundColor:backgroundPanel}}>  
                    {children}
                </div>
            </div>
        </main>
        <Footer />
        </>
    )
}

export default Layout;