import React from "react";
import not_found_404 from "../../assets/404 Error Page.svg";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import NavBar from "../../components/Navbar/NavBar";


const NotFound404 = () => {
    const navigate = useNavigate();
    return (
        <>
            <NavBar />
            <div className="NotFound404_parent">
                <div className="NotFound404_child">
                    <img src={not_found_404} style={{ height: 400 }} />
                    <Button
                        sx={{
                            borderRadius: "20px",
                            background: "var(--secondaryColor)",
                            color: "white",
                            width: "200px",
                        }}
                        className="explore_button_404"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </div>
            </div>

        </>
    );
};

export default NotFound404;