import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import MediaSoup from "./Medisoup/MediaSoup";
import HomePage from "./pages/HomePage.jsx";
import PollContainer from "./components/poll/PollContainer.jsx";
import LoginPage from "./pages/login/LoginPage.js";
import TeacherLectures from "./pages/teacher_detail/TeacherLectures";
import TeachersPage from "./pages/teachers/TeachersPage.js";
import OTP from "./pages/otp/OTP.js";
import MeetEnd from "./pages/MeetEnd/MeetEnd.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NotFound404 from "./pages/NotFound404/NotFound404.jsx";

import LiveLecture from "./pages/youtube/live_lectures/LiveLecture.js";
import ChatPage from "./pages/Chat/ChatPage.js";

function App() {

  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage?.getItem('isLoggedIn')) {
      navigate('/')
    }
  }, [])


  if (localStorage.getItem("token")) {
    let token = localStorage.getItem("token");
    let decodedToken = jwtDecode(token ? token : "");
    // console.log("Decoded Token", decodedToken);
    let currentDate = new Date();

    // JWT exp is in seconds
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      // console.log("Token expired.");
      toast.success("Session Expired..");
      localStorage.clear();
    } else {
      console.log("Valid token");
      // result = true;
    }
  }

  return (
    <div className="App" id="app">
      <Toaster />
      <Routes>
        {/* <Route exact path="/:commonname" element={<HomePage />} /> */}
        <Route exact path="/poll" element={<PollContainer />} />
        <Route
          exact
          path="/live/:roomName2"
          element={<MediaSoup />}
        />
        <Route
          exact
          path="/chat-page/:roomName2"
          element={<ChatPage />}
        />
        <Route
          exact
          path="/live-lecture/:batchSlug/:hashId"
          element={<LiveLecture />}
        />
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/meet-end" element={<MeetEnd />} />
        <Route exact path="/otp/:email" element={<OTP />} />
        <Route exact path="/teachers" element={<TeachersPage />} />
        <Route exact path="/teachers-lecture/:teacher_id" element={<TeacherLectures />} />
        <Route path="*" exact={true} element={<NotFound404 />} />
      </Routes>
      {/* <MediaSoup /> */}
    </div>
  );
}

export default App;
