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