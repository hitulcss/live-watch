import React, { useState } from "react";
import "./NavBar.css";
import Wrapper from "../../components/Wrapper/Wrapper";
import logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineArrowDropDown } from "react-icons/md";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Avatar } from "@mui/material";

const NavBar = () => {

  const [dropdown, setDropdown] = useState(false)

  //user details

  const details = JSON.parse(localStorage.getItem('details'))
  // console.log("details", details)

  //handling Logout
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.clear()
    toast.success('Logged out...')
    setTimeout(() => {
      navigate('/')

    }, 1000)

  }

  return (
    <>
      <div className="navbar_wrapper">
        <Wrapper>
          <div className="navbar">
            <div className="nav_left" onClick={() => navigate('/')}>
              <img src={logo} alt="logo" />
            </div>
            {/* <div className="nav_mid">
              <div className="search_container">
                <input
                  type="search"
                  placeholder="Search for Teacher, Lectures"
                />
                <IoMdSearch className="search_icon" />
              </div>
            </div> */}
            <div className="nav_right">
              <div className="user_profile" onClick={() => setDropdown(!dropdown)}>
                {" "}
                {/* <RxAvatar className="nav_icon" /> */}
                <Avatar src={details?.profilePhoto} />
                <p> {details?.username}</p>
                {dropdown ? <ArrowDropUpIcon /> : <MdOutlineArrowDropDown className="nav_icon" />}
                {dropdown && <div className="dropdown">
                  <p>
                    {details?.username}
                  </p>
                  <p style={{ color: '#b042f5', borderTop: '0.5px solid lightgray' }} className="logout" onClick={handleLogout}>
                    Logout
                  </p>
                </div>}
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default NavBar;
