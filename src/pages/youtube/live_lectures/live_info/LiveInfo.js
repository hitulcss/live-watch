import React from "react";
import "./LiveInfo.css"

const LiveInfo = ({ lectureDetails }) => {
  return (
    <>
      <div className="live_info_wrapper">
        <div className="live_info_upper">
          {" "}
          <h3>{lectureDetails?.lectureTitle}</h3>
          <p>
            <span>By :</span> {lectureDetails?.teacher?.name}
          </p>
        </div>

        <div className="live_info_lower">
          <ol>
            <div
              dangerouslySetInnerHTML={{ __html: lectureDetails?.description }}
            />
          </ol>
        </div>
      </div>
    </>
  );
};

export default LiveInfo;
