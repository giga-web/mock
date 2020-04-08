
import React from 'react';

import RouterWrapper from '@/router'

import './App.css';

function App() {
  return (
    <RouterWrapper />
  );
}

export default App;


// class App extends React.Component {

//     componentDidMount() {
//       dispatch({
//         type: namespace + '/rPostLogin',
//         payload: {
//           account: 'admin',
//           password: 'Qwe123456',
//         }
//       });
//     }
  
//     render() {
//       return (
//         <Provider store={store}>
//           <ConfigProvider locale={zhCN}>
//             <RouterWrapper />
//           </ConfigProvider>
//         </Provider>
//       );
//     }
//   }
  
//   ReactDOM.render(<App />, document.getElementById('root'));
  