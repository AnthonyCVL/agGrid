
import React from 'react';
import '../stylesheet/Login.css';
import App from '../App';
import { Button } from 'reactstrap'
import { useNavigate } from "react-router-dom";

function Login () {
 

    return (<LoginForm />)
};
  
export default Login;

class LoginForm extends React.Component{
  render(){
    return(
      <div id="loginform">
        <FormHeader title="Login" />
        <Form />
        <OtherMethods />
      </div>
    )
  }
}

const request_gettabledata = async (body) => {
  //const base_url='http://localhost:8080'
  const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
  const method = '/getTableData2'
  const request = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  };
  return await send_post(base_url, method, request)
}

const send_post = async (base_url, method, request) => {
  const response = await Promise.race(
    [timeoutAfter(300), fetch(base_url + method, request)]
  );
  const json = await response.json();
  return json
}

function timeoutAfter(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("request timed-out"));
    }, seconds * 1000);
  });
}


const FormHeader = props => (
    <h2 id="headerTitle">{props.title}</h2>
);



const Form = props => (
   <div>
     <FormInput description="Username" placeholder="Enter your username" type="text" />
     <FormInput description="Password" placeholder="Enter your password" type="password"/>
     <FormButton title="Log in" />
   </div>
);

const login = async function (e){
    console.log("hola")
    return (<App />)
}

const FormButton = props => {
  let navigate = useNavigate(); 
const routeChange = async () =>{ 
  console.log('routeChange')
  const data = await request_gettabledata(
    JSON.stringify({
      database: 'D_EWAYA_CONFIG',
      table: 'GD_WebUsuario',
      where: JSON.stringify({ usuario: 'avillacortal', contrasena: 'telefonica' })
    })
  )
  console.log(data)
  if(data.length>0){
    let path = `app`; 
    console.log("cambio")
    window.location.href="./app"
    navigate(path);
  }
}

  return (<div id="button" class="row">
    <Button  onClick={routeChange}>{props.title}</Button >
  </div>)
};

const FormInput = props => (
  <div class="row">
    <label>{props.description}</label>
    <input type={props.type} placeholder={props.placeholder}/>
  </div>  
);

const OtherMethods = props => (
  <div id="alternativeLogin">
    <label>Or sign in with:</label>
    <div id="iconGroup">
      <Facebook />
      <Twitter />
      <Google />
    </div>
  </div>
);

const Facebook = props => (
  <a href="#" id="facebookIcon"></a>
);

const Twitter = props => (
  <a href="#" id="twitterIcon"></a>
);

const Google = props => (
  <a href="#" id="googleIcon"></a>
);
