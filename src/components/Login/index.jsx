import './Login.css';
import { Form, Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { login, setUserId } from '../../services/auth';
import { ClipLoader } from 'react-spinners';
import { sleep } from '../../services/config';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginIsFailed, setLoginIsFailed] = useState({status: false,errorMsg: ""});
    const [buttonSubmitStyle, setButtonSubmitStyle] = useState(<span style={{fontSize:'20px'}}>Entrar</span>);

    const [errorLoginSubmit] = useSearchParams();
    useEffect(() => {    
        if(errorLoginSubmit.get("error") === '1') setLoginIsFailed({status:true, errorMsg: "Nome de usuário ou senha inválidos."});
        if(errorLoginSubmit.get("error") === '2') setLoginIsFailed({status:true, errorMsg: "Erro no servidor, Desculpe pelo transtorno."});
        setPassword("");
    }, [errorLoginSubmit]);

    const navigate = useNavigate();
    async function changeButtonSubmitStyle() {
        setButtonSubmitStyle(<ClipLoader color={'#fff'} loading={true} size={25}/>);
        await sleep(2000);
        setButtonSubmitStyle(<span style={{fontSize:'20px'}}>Entrar</span>);
    }

    function loginFormHandler(e) {
        e.preventDefault();

        if(username === "" || password === "") {
            setLoginIsFailed({status: true, errorMsg: "Por favor, preencher os campos obrigatórios."})
        } else {
            api.post("/auth/login", {
                username: username,
                password: password
            })
            .then((res) => {
                login(res.data);
                return navigate("/inicio");
            })
            .catch((err) => {
                if(err.response.status === 404) {
                    navigate("/login?error=1") 
                } else {
                    navigate("/login?error=2")
                }
            })
        }
        
        
    }
    return(
        <>
            <main>
                <div className='login'>
                    <div className='container'>
                        <div className='login-wrapper'>
                            <div style={{visibility: loginIsFailed.status ? 'visible' : 'hidden'}} className='error'>
                                <h5>{loginIsFailed.errorMsg}</h5>
                            </div>
                            <div className='container-wrapper'>
                                <img src="img/login-banner.jpg" alt="banner-sales"/>
                                <div className='login-form'>
                                    
                                    <div className='login-form-header'>
                                        <div className='wrapper'>
                                            <img width='190' src="img/logowhite.png"/>
                                        </div>
                                        <div>
                                            <h3>Bem vindo! Faça o seu login para entrar.</h3>   
                                        </div>
                                    </div>
                                    <div className='login-form-body'>
                                        <Form
                                        method='POST'
                                        onSubmit={loginFormHandler}>
                                            <input type="text" 
                                            placeholder="Digite o seu nome de usuário..." 
                                            value={username} 
                                            onChange={e=> setUsername(e.target.value)}
                                            style={{border: loginIsFailed.status && username === "" ? "1px solid rgb(167, 55, 90)" : "1px solid var(--black03)"}} 
                                            />
                                            <input 
                                            type="password" 
                                            placeholder="Digite a sua senha..." 
                                            value={password} 
                                            onChange={e=> setPassword(e.target.value)}
                                            style={{border: loginIsFailed.status && password === "" ? "1px solid rgb(167, 55, 90)" : "1px solid var(--black03)"}}
                                            />
                                            <button className='btn-custom' onClick={changeButtonSubmitStyle} type="submit">{buttonSubmitStyle}</button>
                                        </Form>                                                                    
                                    </div>                                                        
                                    {/* <div className='login-form-footer'>
                                        <h2>Ou</h2>
                                        <Link className='btn-custom'>Crie uma conta</Link>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;