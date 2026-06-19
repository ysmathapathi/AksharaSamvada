import React from 'react'
import './Auth.css'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { auth, handleGitHubLogin, handleGoogleSignin } from '../../config/config';
import { signOut } from 'firebase/auth';

const Auth = () => {
    
    return (
        <>
            <center>
                <b>
                    <h1 className="htxt">@AksharaSamv<span style={{ color: "#FF5F1F" }}>ā</span>da</h1>

                    <div className="desc">
                        <p className='stxt'>Find people chat with them!</p>
                    </div>
                    <br />
                    <h2 className="stxt"><i>signin</i></h2>
                    <div className="signinoptions">
                        <button className="google btxt" onClick={handleGoogleSignin}>
                            Google
                            <FcGoogle />
                        </button>
                        <button className="github btxt" onClick={handleGitHubLogin}>Github
                            <FaGithub />
                        </button>
                    </div>
                </b>
            </center>
        </>
    )
}

export default Auth