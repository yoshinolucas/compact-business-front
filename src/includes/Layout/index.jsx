import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";

const Layout = ({
    children,
    background, 
    backgroundPanel}) => {
    return(
        <>
        <Header/>   
        <Sidebar />
            <main>
                <div className='panel'>  
                    {children}
                </div>
            </main>
        <Footer />
        </>
    )
}

export default Layout;