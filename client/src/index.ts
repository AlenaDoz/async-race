import "./style.css";
import CarService from "./services/car-service";
const carService = new CarService();
carService.updateCar(8);
carService.getCars(100);
