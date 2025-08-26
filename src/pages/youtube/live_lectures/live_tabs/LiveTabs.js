import * as React from "react";
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
import LiveInfo from "../live_info/LiveInfo";
import pdfIcon from "../../../../assets/live/pdf.png";
import downloadIcon from "../../../../assets/live/downloadpdf.png";



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

export default function LiveTabs({ lectureDetails }) {
  const [value, setValue] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{}}>
      <Box sx={{ padding: "20px", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          style={{ display: "flex", justifyContent: "space-between" }}
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

        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <LiveInfo lectureDetails={lectureDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {(lectureDetails?.material?.fileLoc ||
          lectureDetails?.dpp?.fileLoc) ? (
          <div className="live_dpp_pdf">
            {lectureDetails?.material?.fileName && (
              <div className="dpp_notes_download">
                <img src={pdfIcon} alt="pdficon" />
                {lectureDetails?.material?.fileName}
                <img src={downloadIcon} alt="downloadpdf" />
              </div>
            )}
            {lectureDetails?.dpp?.fileName && (
              <div className="dpp_notes_download">
                <img src={pdfIcon} alt="pdficon" />
                {lectureDetails?.dpp?.fileName}
                <img src={downloadIcon} alt="downloadpdf" />
              </div>
            )}
          </div>
        ) : <div className="live_dpp_pdf">

          <div className="dpp_notes_download">
            No Resources Available
          </div>


        </div>}
      </CustomTabPanel>

    </Box >
  );
}
