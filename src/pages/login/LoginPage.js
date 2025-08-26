import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import Wrapper from "../../components/Wrapper/Wrapper";
import logo from "../../assets/logo.png";
import loginImg from "../../assets/loginImg.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate()


  useEffect(() => {
    if (otpDisplay) {
      document.getElementById('otp')?.focus()
    } else {
      document.getElementById('email')?.focus()
    }

    if (localStorage.getItem('isLoggedIn')) {
      navigate('/teachers')
    }
  }, [])


  const [role, setRole] = useState('admin')
  const [otp, setOtp] = useState(false)
  const [otpDisplay, setotpDisplay] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userDetails, setUserDetails] = useState({
    email: '', password: ''
  })


  const login = async () => {


    setLoading(true)
    const config = {
      headers: {
        "content-type": "application/json",
        // Authorization: `Bearer ${authToken}`,
      },
    };
    let host = 'cms.sdcampus.com';

    // axios.post('http://localhost:3001/api/v1/adminTeacher/adminLogin', userDetails,
    axios.post(`${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminTeacher/adminLogin`, { ...userDetails, host: host, serverkey: 'SDEMPIRE#$%' },
      config).then((data) => {
        // console.log(data)
        if (data.data.status) {

          setotpDisplay(true)
          // navigate(`/otp/${userDetails?.email}`)
          setLoading(false)
        }
        else {
          // toast.error('Invalid email/password')
          toast.error(data.data.msg)
          setLoading(false)
        }

      }).catch((e) => toast.error(e))

  }
  const loginMod = async () => {


    setLoading(true)
    const config = {
      headers: {
        "content-type": "application/json",
        // Authorization: `Bearer ${authToken}`,
      },
    };


    // axios.post('http://localhost:3001/api/v1/adminTeacher/adminLogin', userDetails,
    axios.post(`${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminTeacher/TeacherLogin`, {
      ...userDetails,
      host: 'cms.sdcampus.com',
      serverkey: 'SDEMPIRE#$%'
    },
      config).then((data) => {
        // console.log(data)
        if (data.data.status) {
          // localStorage.setItem('isLoggedIn', true)
          // localStorage.setItem('details', JSON.stringify(data.data))
          // localStorage.setItem('token', data.data.data)
          // if (role == 'admin') {

          //   navigate('/teachers')
          // } else if (role == 'mod') {
          //   navigate(`/teachers-lecture/${data?.data?.id}`)
          // }
          setotpDisplay(true)
          // navigate(`/otp/${userDetails?.email}`)
          setLoading(false)
        }
        else {
          // toast.error('Invalid email/password')
          toast.error(data.data.msg)
          setLoading(false)
        }

      }).catch((e) => toast.error(e))

  }

  const verifyOtp = () => {

    const config = {
      headers: {
        "content-type": "application/json",
        // Authorization: `Bearer ${authToken}`,
      },
    };


    // axios.post('http://localhost:3001/api/v1/adminTeacher/verify2FA', { email: email, otp: otpValue },
    axios.post(`${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminTeacher/verify2FA`, { email: userDetails?.email, otp: otp },
      config).then((data) => {
        // console.log(data)
        if (data.data.status) {
          // setDetails(data.data)
          localStorage.setItem('isLoggedIn', true)
          localStorage.setItem('details', JSON.stringify(data.data))
          localStorage.setItem('token', data.data.data)
          if (role == 'admin') {

            navigate('/teachers')
          } else if (role == 'mod') {
            navigate(`/teachers-lecture/${data?.data?.id}`)
          }
        }
        else {
          toast.error('Invalid email/password')
          toast.error(data.data.msg)
          // navigate('/teachers')
        }

      }).catch((e) => toast.error(e))
  }
  const verifyOtpMod = () => {

    const config = {
      headers: {
        "content-type": "application/json",
        // Authorization: `Bearer ${authToken}`,
      },
    };


    // axios.post('http://localhost:3001/api/v1/adminTeacher/verify2FA', { email: email, otp: otpValue },
    axios.post(`${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminTeacher/verifyTeacher`, { email: userDetails?.email, otp: otp },
      config).then((data) => {
        // console.log(data)
        if (data.data.status) {
          // setDetails(data.data)
          localStorage.setItem('isLoggedIn', true)
          localStorage.setItem('details', JSON.stringify(data.data))
          localStorage.setItem('token', data.data.data)
          if (role == 'admin') {

            navigate('/teachers')
          } else if (role == 'mod') {
            navigate(`/teachers-lecture/${data?.data?.id}`)
          }
        }
        else {
          toast.error('Invalid email/password')
          toast.error(data.data.msg)
          // navigate('/teachers')
        }

      }).catch((e) => toast.error(e))
  }


  //handling enter input
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (userDetails?.email !== '' && userDetails?.password !== '') { login() }
      else {
        toast.error('Email/Password are required...')
      }
    }
  }



  return (
    <>
      {/* <Toaster /> */}
      <div className="login_nav">
        <img src={logo} alt="logo" />
      </div>
      <Wrapper>
        <div className="loginpage_wrapper">
          <div className="loginpage_container">
            <div className="loginpage_left">
              <img src={loginImg} alt="img" />
            </div>
            <div className="loginpage_right">
              <div className="loginright_input_container">
                {" "}
                <h1>Hi, Welcome Back</h1>
                <h2>
                  Sign in as{" "}
                  <span style={{ color: "var(--secondaryColor)" }}>
                    {role == 'admin' ? 'Admin' : 'Moderator'}</span>
                </h2>
                {otpDisplay ? <div className="input_lower">
                  <input id='otp' placeholder={`Enter OTP `} type="number" onChange={(e) => setOtp(e.target.value)} />
                  <button onClick={() => {
                    if (role == 'admin') { verifyOtp() }
                    else if (role == 'mod') {
                      verifyOtpMod()
                    }
                  }}>Verify OTP</button>

                </div> : <div className="input_lower">
                  <input id='email' placeholder="Enter Your Mail*" onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      document.getElementById('password')?.focus()
                    }
                  }} onChange={(e) => setUserDetails((prev) => ({ ...prev, email: e.target.value }))} />
                  <input type="password" id="password" onKeyDown={handleKeyDown} placeholder="Password*" onChange={(e) => setUserDetails((prev) => ({ ...prev, password: e.target.value }))} />
                  <div className="forget_pass">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {/* <input type="checkbox" style={{ cursor: "pointer" }} /> */}
                      {/* <p>Remember me</p> */}
                    </div>
                    {/* <p
                      style={{
                        color: "var(--secondaryColor)",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      Forgot Password?
                    </p> */}
                  </div>
                  <button onClick={() => {
                    if (userDetails?.email !== '' && userDetails?.password !== '') {
                      if (role == 'admin') { login() }
                      else if (role == 'mod') {
                        loginMod()
                      }
                    }
                    else {
                      toast.error('Email/Password are required...')
                    }
                  }
                  }>Continue</button>
                </div>}
                {!otpDisplay && <h2 style={{ fontSize: '15px', marginTop: '10px' }}>
                  Not {" "}{role == 'admin' ? 'an Admin' : 'a Moderator'}?{" "}
                  <br />Login as
                  <span style={{ color: "var(--secondaryColor)", cursor: 'pointer' }} onClick={() => {
                    if (role == 'admin') setRole('mod')
                    else if (role == 'mod') {
                      setRole('admin')
                    }
                  }}>
                    {" "} {role == 'admin' ? 'a Moderator' : 'an Admin'}</span>
                </h2>}

                {loading && <CircularProgress />}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default LoginPage;
