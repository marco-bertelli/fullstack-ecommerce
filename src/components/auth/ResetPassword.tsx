import React from "react";
import Button from "../Button";

import { useForm } from "react-hook-form";
import Input from "../Input";
import { SignupData } from "../../types";
//hooks personalizzati
import { useAuthenticate } from "../../hooks/Index";
import { useModalContext } from "../../state/modal-context";




interface Props {}

/**
 * ? per migliorare la lunghezza del codice spezzo la form dal singolo input e creo un nuovo 
 * ? componente custom (Input)
 * ? le ref sono i controlli lati front-end
 *  ! per i controlli uso i react-hooks 
 */

const ResetPassword: React.FC<Props> = () => {
  const {resetPassword,successMsg,loading,error} = useAuthenticate();
  //react form hooks con gestione degli errori ecc
  const { register, errors,handleSubmit } = useForm<Omit<SignupData, 'username' | 'password'>>();

  const handleResetPassword = handleSubmit((data) => resetPassword(data))
    
  

  //state per il modal con
  const {setModalType} = useModalContext();

  return (
    <>
      <div className="backdrop" onClick={()=>setModalType('close')}></div>

      <div className="modal modal--auth-form">

        <div className="modal-close" onClick={()=>setModalType('close')}>&times;</div>

        <h5 className="header--center paragraph--orange">
          Reimposta la password mettendo la tua mail
        </h5>

        <form className="form" onSubmit={handleResetPassword}>
        
        <Input
          name='email'
          error={errors.email?.message}
          placeholder='Your Email'
  
            ref={register({
              required: "L'email è obbligatoria"
            })}

          />
          
          <Button loading={loading} width="100%" style={{ margin: "0.5rem 0" }}>
            Invia
          </Button>
          {error && <p className='paragraph paragraph--error'>{error}</p>}
        </form>

        {successMsg && <p className='paragraph--success paragraph--small'>{successMsg}</p>}

      </div>
    </>
  );
};

export default ResetPassword;
