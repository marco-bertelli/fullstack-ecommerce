import React from "react";
import Button from "../Button";

import { useForm } from "react-hook-form";
import Input from "../Input";
import { SignupData } from "../../types";
//hooks personalizzati
import { useAuthenticate } from "../../hooks/Index";
import { useModalContext } from "../../state/modal-context";
import SocialMediaLogin from "./SocialMediaLogin";

interface Props {}

/**
 * ? per migliorare la lunghezza del codice spezzo la form dal singolo input e creo un nuovo 
 * ? componente custom (Input)
 * ? le ref sono i controlli lati front-end
 *  ! per i controlli uso i react-hooks 
 */

const Signup: React.FC<Props> = () => {
  const {signup,socialLogin,loading,error} = useAuthenticate();
  //react form hooks con gestione degli errori ecc
  const { register, errors,handleSubmit } = useForm<SignupData>();
  //state per il modal con
  const {setModalType} = useModalContext();


  const handleSignup = handleSubmit(async (data) => {
    const response =  await signup(data);
    if(response) setModalType('close');
  });


  return (
    <>
      <div className="backdrop" onClick={()=>setModalType('close')}></div>

      <div className="modal modal--auth-form">

        <div className="modal-close" onClick={()=>setModalType('close')}>&times;</div>

        <h3 className="header--center paragraph--orange">
          Sign Up to React-M-Shop
        </h3>
        <SocialMediaLogin socialLogin={socialLogin} loading={loading}/>
        <hr/>

        <p className="paragraph--center paragraph--focus paragraph--small">
           O effettua la login con email e password
        </p>

        <form className="form" onSubmit={handleSignup}>
        
          <Input
          name='username'
          label="Username" 
          error={errors.username?.message}
          placeholder='Your Username'
  
            ref={register({
              required: "Il nome utente è obbligatorio",
              minLength: {
                value: 3,
                message: "Username deve avere almeno 3 caratteri",
              },
              maxLength: {
                value: 20,
                message: "Username può avere al massimo 20 caratteri",
              },
            })}
          />

        <Input
          name='email'
          label="Email" 
          error={errors.email?.message}
          placeholder='Your Email'
  
            ref={register({
              required: "L'email è obbligatoria",
              pattern:{
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Formato della mail invalido'
              }
            })}

          />

        <Input
        type='password'
          name='password'
          label="Password" 
          error={errors.password?.message}
          placeholder='Your Username'
  
            ref={register({
              required: "La Password è obbligatoria",
              minLength: {
                value: 6,
                message: "La password deve avere almeno 6 caratteri",
              },
              maxLength: {
                value: 50,
                message: "La password non può superare i 50 caratteri",
              },
            })}
          />
          
          <Button loading={loading} width="100%" style={{ margin: "0.5rem 0" }}>
            Invia
          </Button>
          {error && <p className='paragraph paragraph--error'>{error}</p>}
        </form>

        <p className="paragraph paragraph--focus paragraph--small">
            Hai già un account?
            <span className="paragraph--orange paragraph--link"
            onClick={()=>setModalType('signin')}
            >Log-in</span>{' '} 
          </p>
       

      </div>
    </>
  );
};

export default Signup;
