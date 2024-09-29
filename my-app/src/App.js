import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { About } from "./pages/About";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Friend } from "./pages/Friend";
import { Detail } from "./pages/Detail";
import { PostDetail } from "./pages/PostDetail"; // 导入 PostDetail 组件

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
        <Route path="/post/:postId" element={<PostDetail />} />{" "}
        {/* 配置详情页面路由 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
