import React, { useContext, useEffect, useRef, useState } from "react";
// import login_bg from '../../../assets/login/otp_bg.png';
import login_bg from "../../assets/login/login_bg.png";
import otp_img from "../../assets/login/otp_img.png";
import "./OTP.css";
import { Button, Typography } from "@mui/material";

import OutlinedInput from "@mui/material/OutlinedInput";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { set } from "js-cookie";
// import { StoreData } from '../../../context/Store';
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
// import { CoursesData } from "../../../context/courses/Courses";

let correctOTP = 123456;
const OTP = () => {
    // const [searchParams, setSearchParams] = useSearchParams();
    // const ref = searchParams.get("ref");
    const { email } = useParams()

    const [otpValue, setOtpValue] = useState();
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [otpError, setOtpError] = useState(null);
    const otpBoxReference = useRef([]);
    const [details, setDetails] = useState()

    function handleChange(value, index) {
        let newArr = [...otp];
        newArr[index] = value;
        setOtp(newArr);
        //console.log(value)
        if (value && index < 6 - 1) {
            otpBoxReference.current[index + 1].focus();
        }
    }

    function handleBackspaceAndEnter(e, index) {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            otpBoxReference.current[index - 1].focus();
        }
        if (e.key === "Enter" && e.target.value && index < 6 - 1) {
            otpBoxReference.current[index + 1].focus();
        }
    }

    useEffect(() => {
        // if (location?.state?.from !== "signup") {
        //     navigate("/");
        // }
        // if (otp.join("") !== "" && otp.join("") !== correctOTP) {
        //     setOtpError("❌ Wrong OTP Please Check Again");
        // } else {
        //     setOtpError(null);
        // }
    }, [otp]);

    // console.log(otp.join(""))

    // const { verifyOtp, resendOtp } = useContext(CoursesData);

    const location = useLocation();
    // console.log('LOCATION', location)
    // const [otp, setOtp] = useState({
    //     hundredthousands: 0,
    //     tenthousands: 0,
    //     thousands: 0,
    //     hundreds: 0,
    //     tens: 0,
    //     ones: 0
    // })
    // console.log(location)
    const handleVerify = () => {
        let digit =
            // 100000 * otp?.hundredthousands +
            // 10000 * otp?.tenthousands +
            1000 * otp.thousands +
            100 * otp?.hundreds +
            10 * otp?.tens +
            1 * otp?.ones;
        // console.log(digit)
        // verifyOtp(otp.join(""), ref);
        const config = {
            headers: {
                "content-type": "application/json",
                // Authorization: `Bearer ${authToken}`,
            },
        };


        // axios.post('http://localhost:3001/api/v1/adminTeacher/verify2FA', { email: email, otp: otpValue },
        axios.post('https://stage-backend.sdcampus.com/api/v1/adminTeacher/verify2FA', { email: email, otp: otpValue },
            config).then((data) => {
                
                if (data.data.status) {
                    setDetails(data.data)
                    localStorage.setItem('token', data.data.data)
                    navigate('/teachers')
                }
                else {
                    toast.error('Invalid email/password')
                }

            })
    };
  
    const handleResend = () => {
        // resendOtp(location?.state?.phone);
    };

    const navigate = useNavigate();
    return (
        <div className="otp_wrapper">
            <div className="otp_container">
                {/* <Toaster /> */}
                <div className="otp_left">
                    <img src={login_bg} />
                </div>
                <div className="otp_right">
                    <div className="otp_right_img">
                        <img
                            src={otp_img}
                            alt="otp"
                            style={{
                                objectFit: "cover",
                                height: "200px",
                                width: "100%",
                                marginTop: "50px",
                            }}
                        />
                    </div>
                    <Typography
                        className="otp_right_title"
                        mb={4}
                        sx={{ fontWeight: "600", fontSize: "28px" }}
                    >
                        Enter OTP
                    </Typography>
                    <div className="otp_right_input_container">
                        <input type="number" onChange={(e) => setOtpValue(e.target.value)} />
                        {/* {otp.map((digit, index) => (
                            <input
                                key={index}
                                value={digit}
                                maxLength={1}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                                ref={(reference) =>
                                    (otpBoxReference.current[index] = reference)
                                }
                                className="otp_input"
                            />
                        ))} */}

                        {/* <OutlinedInput className='otp_input' placeholder="" onChange={(e) => setOtp(prev => ({ ...prev, hundredthousands: e.target.value }))} />
                    <OutlinedInput className='otp_input' placeholder="" onChange={(e) => setOtp(prev => ({ ...prev, tenthousands: e.target.value }))} />
                    <OutlinedInput className='otp_input' placeholder="" onChange={(e) => setOtp(prev => ({ ...prev, thousands: e.target.value }))} />
                    <OutlinedInput className='otp_input' placeholder="" onChange={(e) => setOtp(prev => ({ ...prev, hundreds: e.target.value }))} />
                    <OutlinedInput className='otp_input' placeholder="" onChange={(e) => setOtp(prev => ({ ...prev, tens: e.target.value }))} />
                    <OutlinedInput className='otp_input' placeholder="" onChange={(e) => setOtp(prev => ({ ...prev, ones: e.target.value }))} /> */}
                    </div>
                    <div className="otp_right_register">
                        <p>
                            {location?.state?.otp}{" "}
                            {/* <span
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    // navigate(`/login?ref=${ref}`);
                                }}
                            >
                                Change
                            </span> */}
                        </p>
                    </div>
                    <div className="otp_right_button_cont">
                        <Button className="otp_right_button" onClick={handleVerify}>
                            Verify
                        </Button>
                    </div>
                    <div className="otp_right_register">
                        {/* <p>
                            Did not recieve the code?{" "}
                            <span
                                style={{ cursor: "pointer" }}
                                onClick={() => handleResend()}
                            >
                                {" "}
                                Try again
                            </span>
                        </p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTP;
