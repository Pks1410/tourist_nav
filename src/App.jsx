import "./App.css";
import "leaflet/dist/leaflet.css";
import MapView from "./components/MapView";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <MapView />
    </>
  );
}

export default App;
