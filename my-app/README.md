# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


遇到的典型的困难：
1. 前后端分离开发的端口冲突
2. 谷歌的cors问题，前后端测试跨域传输内容CORS报错，用的库cors或者设置google解决
3. signup表单验证过程的逻辑顺序问题，一次返还很多message打包的object，怎么匹配对应的位置，怎么让对应的提示显示在对应的textfield的helpertext上
4. 以及密码的特殊性，因为要处理成hash，在密码进入后端验证的时候已经变hash了，所以永远过不了validate，因此要在controller这一步就处理这个message
，这样的话又带来了另一个问题，因为其他的验证在数据库，pwd在controller，所以pwd优先级更高，表单为空也是同理，即便别的输入有问题，如果controller这一步检测到了密码强度和有空的话，也不会提示除此之外的message。



一些特性：
使用MUI
前端使用firebase谷歌认证OAuth登录
前后端分离，API test用的是insomnia
结构清晰，严格组件化复用，route controller model分离
前端利用Redux Toolkit实现global的数据传输，结合token登录获取用户数据
用redux toolkit+redux persist实现刷新页面等操作的情况下的跨全局存储和调用当前用户数据（本地存储与验证）
用redux useSelector控制用户的可见范围和隐私保护，以及全局的深色模式切换
redux的问题：更新用户信息，提交，数据库改变，但是redux导致页面显示不变，所以在userSlice里加上update，然后controller把新的user返还过来，让前端在handlesubmit的时候更新redux
前后端均使用env保护信息，包括firebase的apikey（没成，因为dotenv引用env里面的东西的时候报错了），JWT_SECRET，mongo的api链接等等
使用react quill集成富文本区域编辑和展示
html-react-parser切割html文本隐藏展示内容，展开卡片

传post这种复杂的多媒体文件的时候用formData，在后端处理包含文件的FormData请求时使用multer中间件，但是出现了前后端跨端口不能简单轻松的调用和存储图片的问题，例如后端将图片存入根目录，前端子文件无权限调用另一个端口的文件。最后用的google的firebase存储到云上。数据库只保留云的链接。

用dispatch的时候，payload设置一定要小心，就像post的avatar关注这块，如果直接redux掉整个user就直接换人了，只redux掉following就好

难点一：实现长按头像关注用户并且刷新绿点。
1. 刚才提到的dispatch小心刷过头了
2. 不刷新页面的情况下直接出绿点没绿点:使用 setIsFollowing 更新状态。在 handleFollowToggle 函数内，你可以在成功关注/取消关注用户后立即更新 isFollowing 的状态。由于 React 是基于状态的 UI 框架，状态的改变会触发重新渲染当前组件。将 setIsFollowing 放在成功响应后，立即更新 UI。确保 Redux 状态变更触发重新渲染
当前代码中，你已经通过 dispatch 更新了 Redux 中的 following 列表，确保 currentUser 更新后，useEffect 中的依赖项会监听到 currentUser 的变化。
3. 整体原理：当 handleFollowToggle 成功执行时，setIsFollowing 立即更新本地状态，触发当前组件的重新渲染。
依赖 currentUser 的变化，通过 useEffect 自动监听 currentUser.following 的变化，确保状态同步。
4. 动画原理：
在按下头像时，使用 useState 来触发一个动画类，逐步放大头像。
当长按计时结束后（800 毫秒），将头像恢复到原来的大小。
无论是否触发了关注或取消关注操作，鼠标松开时都会移除动画。
延迟动画恢复：我们使用 setTimeout 控制动画在 800 毫秒时到达最大尺寸，完成后再缩回到原来的大小。
延迟设置恢复动画：当达到 800 毫秒后，头像会自动恢复到原始大小。为此，我们可以用一个新的 timeoutRef 来控制恢复时间。

这个长按关注是很典型的redux，有个challenge就是，follow和redux的问题，现在的问题就是，用户长按别的用户的头像之后，各种动画还有follow和取消follow的功能都挺正常，然后远程的数据库也能及时变化，但是唯一的问题是，用户自己本地的redux的的following的内容实际上没有变，就一直都是一个固定的状态不变。这就需要userreducer里面针对UPDATE_USER_FOLLOWING要能够正确处理，在userSlice里面加上针对dollowing的更新语句，然后在Post组件调用action才可以。

Redux 更新后的工作流程
当用户长按头像并成功关注或取消关注时，后端会返回更新后的 following 列表。
然后你通过 dispatch(updateFollowingSuccess) 更新 Redux 中的 currentUser.following 列表。
组件中本地的 isFollowing 状态也会被同步更新，以便立即显示新的关注状态。

关于自动刷新：关注用户自动局部刷新，靠的是react自身特性。add post之后成功之后局部刷新feed靠的：
1 在 Home 组件中传递一个更新 Feed 的回调函数（refreshFeed）给 Add 组件。
2 在 Add 组件中，帖子上传成功后，调用传递的回调函数来更新 Feed。接受 onPostSuccess 作为一个回调函数。帖子创建成功后，调用该回调函数来触发 Feed 刷新。
3 在 Feed 组件中，当收到更新信号时重新获取数据，刷新帖子列表。Feed 组件会根据 key 变化重新获取帖子并渲染，确保页面自动刷新新发布的帖子。

路由冲突：main里面如果把
router.get("/recent-posts", getRecentPosts);
放在
router.get("/:postId", getPostById);
后面就会报错，优先匹配到哪一个的问题。
/recent-posts 路由是在 /:postId 之后定义的。当 Express 匹配到路径 /:postId 时，它会优先认为 "recent-posts" 是一个 postId，因此导致了错误。

stream react chat sdk整合聊天室

ztt建议看一下axios封装前端的请求！

功能想法：长按头像关注，关注的用户头像有边框，第一次注册的用户进网站有提示，enjoy your journey to the ricebook，然后一个提示长按头像关注，点一下是profile，展示的部分用开发者我的账号做例子，所有人都要关注我。

聊天室：firebase
保持现有的 MongoDB 作为主要的存储方式，同时在用户注册时，将用户数据也同步存储到 Firebase 中。我将为您提供一个改进的方案，不影响现有的后端逻辑，只是额外增加 Firebase 的调用来存储用户数据。
并行登录/登出 MongoDB 和 Firebase：在 handleSubmit 和 handleLogout 函数中，我们并行调用 MongoDB 和 Firebase 的认证操作。如果其中一个成功，主流程继续进行。如果有错误发生，单独捕获并记录，而不会阻碍整个流程。

登录时的错误处理：首先登录 MongoDB，成功后再登录 Firebase。即使 Firebase 登录失败，主流程（如跳转到首页）依然继续。

登出时的同步处理：通过 Promise.all 并行执行 MongoDB 和 Firebase 的登出操作，如果 MongoDB 或 Firebase 的登出失败，依然会处理其他的登出流程。

聊天室和用户和关注列表等核心信息在firebase上模型，

思路和大致步骤
用户身份验证：

用户可以使用电子邮件和密码登录，而不强制使用 Google 登录。你可以使用 Firebase Authentication 来支持电子邮件注册和登录。
为了方便聊天功能，你还需要在用户数据中保存每个用户的唯一标识符（UID），这个 UID 会作为消息和聊天室的关键字段。
数据库设计：

使用 Firebase Firestore（或 Realtime Database）存储聊天消息和用户聊天关系。Firestore 是一个文档型数据库，适合用来存储聊天消息。
你可以设计两个主要的集合：
Users：存储用户信息，包括 UID 和关注列表（被关注的人和关注自己的人）。
Chats：每个一对一聊天室会有一个独立的文档，里面包含聊天双方的 UID 和消息记录。
实时消息推送：

Firebase Firestore 可以帮助你监听数据库的实时更新，任何聊天信息的更新都可以自动推送到前端。
消息界面：

创建一个简单的聊天界面，让用户可以查看消息历史和实时接收新消息。
发送消息时，将新消息存储到 Firestore 并通知对方用户。

前后端firebase不能互相调用，后端用firebaseAdmin.js是，用于在后端使用 Firebase Admin SDK，这样你就可以在后端直接管理 Firebase 数据库。

fuck fire base 我用mongo了

关于登出的各种报错，基本都是来自于currentUser 变为了 null，但是在 PostDetailMain 之类的各种组件的 useEffect 中和 handleLike 函数中，你仍然在尝试访问 currentUser._id，导致 TypeError: Cannot read properties of null (reading '_id') 错误。所以要添加检查，每个页面都是，只要用户能在这里登出就要检查。

全是放屁，直接自己实现了不用firebase了。

不改变内容，把里面的中文注释改成英文，调整注释使代码更清晰