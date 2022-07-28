import "./style.css";
//import CarService from "./services/car-service";
import EngineService from "./services/engine-service";
//const carService = new CarService();
const engineService = new EngineService();
engineService.startStopEngine(9);
