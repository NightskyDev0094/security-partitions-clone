import './App.css';

import RoutesComponents from "Routes";
import Header from 'Componenets/Header';
import SettingModal from 'Componenets/SettingModal';

function App() {
  return (
    <div className="App">
      <Header />
      <SettingModal />
      <RoutesComponents />
    </div>
  );
}

export default App;
