
import React, { useEffect } from "react";
import { Spin } from "antd";
import './mainStyle.scss';
import { useAuthStore } from "../../states/authState";
import shallow from "zustand/shallow";
import { useHistory } from 'react-router-dom';

function Main() {
    let history = useHistory ();
    const [loginDetails] = useAuthStore(
        (state) => [state.loginDetails],
        shallow
    );
    if(!loginDetails)  history.push('/login')
    

    return (
        <div className="main-page">
            <Spin tip="Loading" size="large" />
        </div>
    );
}

export default React.memo(Main);
