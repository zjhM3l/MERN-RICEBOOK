import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { About } from "./pages/About";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Friend } from "./pages/Friend";
import { Detail } from "./pages/Detail";
import { PostDetail } from "./pages/PostDetail";
import { ChatRoom } from "./pages/Chatroom"; // Import ChatRoom component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/friend" element={<Friend />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/chat/:chatId" element={<ChatRoom />} /> {/* Chat room route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
