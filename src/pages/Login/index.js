import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Spin } from "antd";
import { useAuthStore } from "../../states/authState";
import shallow from "zustand/shallow";
import { FormLogin } from "../../components";

function Login() {
    let history = useHistory ();
    const [successLogin] = useAuthStore(
        (state) => [state.successLogin],
        shallow
    );

    useEffect(() =>{
        if(successLogin)   history.push('/documents')
    },[successLogin])

    return (
        <>
            <FormLogin />
        </>
    );
}

export default React.memo(Login);
