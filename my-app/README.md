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






ztt建议看一下axios封装前端的请求！

功能想法：长按头像关注，关注的用户头像有边框，第一次注册的用户进网站有提示，enjoy your journey to the ricebook，然后一个提示长按头像关注，点一下是profile，展示的部分用开发者我的账号做例子，所有人都要关注我。