import { useEffect } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";

const Layout = ({children, hasSubtop, hasShadow, background, hasSidebar}) => {
    return(
        <>
        <Header hasSubtop={hasSubtop} hasShadow={hasShadow}/>
        
        <main style={{marginLeft: hasSidebar ? "90px" : '0px'}}>
            <div className='produtos'>
                <div className='container' style={{backgroundColor:background}}>
                    <div className='panel'>
                        {hasSidebar && <Sidebar />} 
                        {children}
                    </div>
                </div>
            </div>
        </main>
        <Footer />
        
        </>
    )
}

export default Layout;