import React, { useState } from "react";
import "./LiveTabs.css";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { TbFileDescription } from "react-icons/tb";
import { MdOutlineSnippetFolder } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { CiSquareQuestion } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function LiveTabs({
  permissionResponseModal,
  allReq,
  answerForPermission,
  updatePermission
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Box className="tabs_container" sx={{ width: "100%" }}>
      <Box
        className="tabs_container_inner"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="tabs_main"
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<TbFileDescription className="tab_icon" />}
            label="Info"
            {...a11yProps(0)}
          />
          <Tab
            icon={<MdOutlineSnippetFolder className="tab_icon" />}
            label="Resources"
            {...a11yProps(1)}
          />
          <Tab
            icon={<CiSquareQuestion className="tab_icon" />}
            label="Doubts"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Live Info
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        RESOURSES
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {/* {permissionResponseModal &&
                    <div id='permission_parent'>
                        {allReq?.map((item) => {
                            return <div className='permission-box'>
                                <h6> {item?.name} is asking for video permission for some doubt!!!
                                   
                                    Do you want to allow??</h6>

                                <div className="permission-buttons">
                                    <button style={{ backgroundColor: 'green' }} onClick={() => {
                                        answerForPermission(true, item)
                                    }}>Accept</button>
                                    <button style={{ backgroundColor: 'red' }} onClick={() => {
                                        answerForPermission(false, item)
                                    }}>Deny</button>
                                </div>
                            </div>
                        })}
                    </div>
                } */}

        <div className="switch_tabs">
          <div className="tab-buttons">
            <button
              className={activeTab === "tab1" ? "active" : ""}
              onClick={() => handleTabClick("tab1")}

              style={{ background: activeTab == 'tab1' ? 'var(--secondaryColor)' : 'white', color: activeTab == 'tab1' ? 'white' : 'black' }}
            >
              Request(Audio/Video)
            </button>
            <button
              className={activeTab === "tab2" ? "active" : ""}
              style={{ background: activeTab == 'tab2' ? 'var(--secondaryColor)' : 'white', color: activeTab == 'tab2' ? 'white' : 'black' }}
              onClick={() => handleTabClick("tab2")}
            >
              All Doubt
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "tab1" && (
              allReq?.length > 0 ? allReq?.map((item, index) => {
                // console.log('Requests', item)
                return < div className="request_audio_video_wrapper">
                  <div className="request_video_audio">
                    <div className="requests">
                      <div className="requests_upper">
                        <p>
                          {item?.name} from{" "}
                          <span style={{ color: "var(--secondaryColor)" }}>
                            {item?.batch}
                          </span>{" "}
                          in{" "}
                          <span style={{ color: "var(--secondaryColor)" }}>
                            {" "}
                            {item?.room}
                          </span>{" "}
                          {/* Mentor {">"} Harsh singh{" "} */}
                        </p>
                      </div>
                      <p style={{ border: "1px solid #efefef" }}></p>
                      <div className="requests_lower">
                        <h2>Request For Camera & Mic Discussion some topics </h2>
                        <div className="right_req_buttons">
                          <button className="request_accept_btn" onClick={() => {
                            answerForPermission(true, item)
                            updatePermission(item?.userId, 'accept')
                          }}>Accept</button>
                          <button className="request_decline_btn" onClick={() => {
                            answerForPermission(false, item)
                            updatePermission(item?.userId, 'delete')
                          }}>Decline</button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              }) : <>No Requests</>

            )}
            {activeTab === "tab2" && (
              <div className="doubts_wrapper">
                <div className="doubts_box">
                  <div className="doubts_upper">
                    {" "}
                    <p>
                      Dinesh from{" "}
                      <span style={{ color: "var(--secondaryColor)" }}>
                        Batch-1
                      </span>{" "}
                      in{" "}
                      <span style={{ color: "var(--secondaryColor)" }}>
                        {" "}
                        Room-1
                      </span>{" "}
                      Mentor {">"} Harsh singh{" "}
                    </p>
                    <div className="doubt_rightside">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <IoMdTime /> <p>05:09</p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <FaCheckCircle /> <p>Resolved</p>
                      </div>
                    </div>
                  </div>
                  <p style={{ border: "1px solid #efefef" }}></p>
                  <div className="doubts_lower">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.1500s, when an unknown printer.Lorem
                      Ipsum is simply dummy text of the printing and typesetting
                      industry.{" "}
                    </p>

                    <p style={{ border: "1px solid #efefef" }}></p>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.1500s, when an unknown printer.Lorem
                      Ipsum is simply dummy text of the printing and typesetting
                      industry.{" "}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CustomTabPanel>
    </Box >
  );
}
