import React, { useState } from 'react';
import './Login.css'; // Import the CSS file
import axios from 'axios'
const Login = () => {
  const [login, setLogin] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [userType, setUserType] = useState('');

  const handleLoginToggle = () => {
    setLogin(!login);
    setCompanyName('');
    setPassword('');
    setCompanyAddress('');
    setUserType('');
  };

  const handleSubmit = (e) => {  
    if(login===true)
    {
      axios({
        method:'POST',
        url:'http://localhost:5000/Login',
        data:{
          CompanyName:companyName,
          Password:password,
          
        },
       
      }).then((res)=>{
        
        if(res.data.status==="ok")
        {
          localStorage.setItem("CompanyName",companyName)
          window.location=`/${res.data.type}`
        }
        
      })
    } 
    if(login===false)
    {
     
      axios({
        method:'POST',
        url:'http://localhost:5000/Register',
        data:{
          CompanyName:companyName,
          Password:password,
          CompanyAddress:companyAddress,
          UserType:userType
        },
       
      }).then((res)=>{console.log(res.data)})
    }
   
   
  };

  return (
    <div className="container">
      <div className="form">
        <h2>{login ? 'Login' : 'Register'}</h2>
        <div>
          {login ? (
            <>
              <label htmlFor="companyName">Company Name:</label>
              <input
                type="text"
                id="companyName"
                className="input-field"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <br />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <label htmlFor="companyName">Company Name:</label>
              <input
                type="text"
                id="companyName"
                className="input-field"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <br />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              <label htmlFor="companyAddress">Company Address:</label>
              <input
                type="text"
                id="companyAddress"
                className="input-field"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                required
              />
              <br />
              <label htmlFor="userType">User Type:</label>
              <select
                id="userType"
                className="input-field"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="">Select User Type</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Transporter">Transporter</option>
              </select>
            </>
          )}
          <br />
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </div>
        <br />
        <span onClick={handleLoginToggle} className="toggle-button">
          {login ? 'Register' : 'Login'}
        </span>
        
      </div>
    </div>
  );
};

export default Login;
