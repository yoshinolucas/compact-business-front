import Footer from '../../includes/Footer';
import Header from '../../includes/Header';
import Layout from '../../includes/Layout';
import './Home.css';

const Home = () => {
    return(
        <>
            <Layout hasSidebar={true} background={'var(--panel)'}>
                <div className='panel-header'>
                    <div className='panel-header-wrapper'>
                        <div className='panel-title'>
                            <h4>Início</h4>
                        </div>
                    </div>
                    
                    <hr />
                </div>
                <div className='panel-body home'>    
                    <div className='cards1'>
                        <div className='card primary02'>
                        </div>
                        <div className='card info'>                  
                        </div>
                        <div className='card primary'>                  
                        </div>
                    </div>
                    <div className='cards2'>
                        <div className='card'>
                            <div className='card-header'>
                                <h4>Minhas tarefas</h4>
                            </div>

                        </div>
                        <div className='card'>     
                            <div className='card-header'>
                                <h4>Minha conta</h4>
                            </div>             
                        </div>
                    </div>
                </div>

            </Layout>
        
        </>
    );
}

export default Home;