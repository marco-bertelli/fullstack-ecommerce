import React from "react";
import Button from "../Button";

import { useForm } from "react-hook-form";
import Input from "../Input";
import { SignupData } from "../../types";
//hooks personalizzati
import { useAuthenticate } from "../../hooks/Index";
import { useModalContext } from "../../state/modal-context";
import SocialMediaLogin from "./SocialMediaLogin";
import { useHistory } from "react-router";




interface Props {}

/**
 * ? per migliorare la lunghezza del codice spezzo la form dal singolo input e creo un nuovo 
 * ? componente custom (Input)
 * ? le ref sono i controlli lati front-end
 *  ! per i controlli uso i react-hooks 
 */

const Signin: React.FC<Props> = () => {
  const {signin,socialLogin,loading,error} = useAuthenticate();
  //react form hooks con gestione degli errori ecc
  const { register, errors,handleSubmit } = useForm<Omit<SignupData, 'username'>>();
  const history = useHistory();
  //state per il modal con
  const {setModalType} = useModalContext();

  const handleSignin = handleSubmit(async (data) => {
    const response =  await signin(data);
    if(response) setModalType('close');
  });

  return (
    <>
      <div className="backdrop" onClick={()=>{
        history.replace('/',undefined)
        setModalType('close')
        }}></div>

      <div className="modal modal--auth-form">

        <div className="modal-close" onClick={()=>{
          history.replace('/',undefined)
          setModalType('close')
          }}>&times;</div>

        <h3 className="header--center paragraph--orange">
          Sign In to React-M-Shop
        </h3>
       
        <SocialMediaLogin socialLogin={socialLogin} loading={loading}/>
        
        <form className="form" onSubmit={handleSignin}>
        
        <Input
          name='email'
          label="Email" 
          error={errors.email?.message}
          placeholder='Your Email'
  
            ref={register({
              required: "L'email è obbligatoria"
            })}

          />

        <Input
        type='password'
          name='password'
          label="Password" 
          error={errors.password?.message}
          placeholder='Your Username'
  
            ref={register({
              required: "La Password è obbligatoria"
            })}
          />
          
          <Button loading={loading} width="100%" style={{ margin: "0.5rem 0" }}>
            Invia
          </Button>

          {error && <p className='paragraph paragraph--error'>{error}</p>}
        </form>

          <p className="paragraph paragraph--focus paragraph--small">
            Non hai un account? 
            <span className="paragraph--orange paragraph--link"
            onClick={()=>setModalType('signup')}
            >Registrati</span>{' '} 
          </p>

          <p className="paragraph paragraph--focus paragraph--small">
            Password Dimenticata? Clicca <span
            className="paragraph--orange paragraph--link"
            onClick={() => setModalType('reset_password')}
            >qui</span>
          </p>
      </div>
    </>
  );
};

export default Signin;
