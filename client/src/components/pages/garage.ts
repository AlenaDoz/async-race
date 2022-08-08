//import { Iengine } from '../../interfaces/engine-interface';
import CarService from '../../services/car-service';
import EngineService from '../../services/engine-service';
import WinnerService from '../../services/winner-service';

class GaragePage {

  namesOfCars = ['BMW', 'Mersedes', 'Mazda', 'Toyota', 'Tesla', 'Volvo', 'VW', 'Opel', 'Jaguar', 'Shkoda'];

  namesOfModels = ['X5', 'SLS', 'CX7', 'Land Cruiser', 'modelX', 'XC90', 'Polo', 'Omega', 'XJ', 'Rapid'];

  colors = ['red', 'pink', 'blue', 'black', 'teal', 'purple', 'yellow', 'green', 'brown', 'grey', 'salmon', 'black', 'fuchsia', 'gold', 'olive', 'crimson', 'cyan'];

  static page = 1;

  carsPerPage = 7;

  onPrevNextClick(parentElement: HTMLElement) {
    parentElement.querySelector('#garage-next')?.addEventListener('click', () => {
      (async () => {
        GaragePage.page++;
        await this.reDrawPage();
      })()
        .then(() => console.log('success'))
        .catch(() => console.log('error'));
    });
    parentElement.querySelector('#garage-prev')?.addEventListener('click', () => {
      (async () => {
        GaragePage.page--;
        await this.reDrawPage();
      })()
        .then(() => console.log('success'))
        .catch(() => console.log('error'));
    });
  }

  async drawPage() {
    const garagePage = document.createElement('div');
    const carsInfo = await new CarService().getCars(this.carsPerPage, GaragePage.page);
    const totalCars = carsInfo[0];
    const cars = carsInfo[1];
    const pagesCount = Math.ceil(totalCars / this.carsPerPage);
    garagePage.classList.add('garage');
    garagePage.innerHTML = `<h2>Garage <span>${totalCars}</span></h2>
    <h3>Page ${GaragePage.page}</h3>
    <ul class="car-list"></ul>
    <div
      class="pagination">
      <button
        class="btn" id='garage-prev'>Prev</button>
      <button
        class="btn" id='garage-next'>Next</button>
    </div>`;
    const carList = garagePage.querySelector('.car-list');
    if (carList) {
      cars.forEach((item) => {
        carList.append(this.drawCar(item.name, item.color, item.id));
      });
    }
    if (GaragePage.page === 1) {
      (garagePage.querySelector('#garage-prev') as HTMLButtonElement).disabled = true;
    }
    if (GaragePage.page === pagesCount) {
      (garagePage.querySelector('#garage-next') as HTMLButtonElement).disabled = true;
    }
    garagePage.prepend(this.drawCarCreator());
    document.body.append(garagePage);
  }

  async reDrawPage() {
    const garage = document.querySelector('.garage');
    if (garage) garage.remove();
    await this.drawPage();
  }

  onSelectClick(parentElement: HTMLElement) {
    parentElement.querySelector('#select-btn')?.addEventListener('click', () => {
      const text = document.querySelector<HTMLInputElement>('.update-cars input[type =\'text\']');
      const carName = parentElement.querySelector<HTMLElement>('.car-name');
      const carImage = parentElement.querySelector<SVGElement>('.car');
      if (!text) return;
      if (!carName) return;
      text.value = carName.innerText;
      const oldColor = document.querySelector<HTMLInputElement>('.update-cars input[type =\'color\']');
      if (!oldColor) return;
      if (!carImage) return;
      oldColor.value = carImage.getAttribute('fill')!;
      const prevCarId = document.querySelector<HTMLInputElement>('.update-cars input[type =\'hidden\']');
      const carId = parentElement.querySelector<HTMLInputElement>('.current-car-id');
      if (!prevCarId) return;
      if (!carId) return;
      prevCarId.value = carId.value;
    });
  }

  onRemoveClick(parentElement: HTMLElement, id: number) {
    parentElement.querySelector('#remove-btn')?.addEventListener('click', () => {
      (async () => {
        {
          const carId = parentElement.querySelector<HTMLInputElement>('.current-car-id');
          if (!carId) return;
          await new CarService().deleteCar(id);
          await this.reDrawPage();
        }
      })()
        .then(() => console.log('success'))
        .catch(() => console.log('error'));
    });
  }

  onABBtnClick(aBtn: HTMLButtonElement, bBtn: HTMLButtonElement, id: number, carImage: SVGElement) {
    let requestId = 0;
    aBtn.addEventListener('click', () => {
      aBtn.disabled = true;
      bBtn.disabled = false;
      (async () => {
        const engineService = new EngineService();
        const duration = await engineService.startStopEngine(id, 'started');
        function moveAnimate() {
          const prev = performance.now();
          requestAnimationFrame(function animate(time) {
            const timeFraction = (time - prev) / duration;
            if (carImage) {
              const carWidth = carImage.getBoundingClientRect().width;
              const left = carImage.getBoundingClientRect().left;
              const length = document.querySelector<HTMLElement>('.road')?.getBoundingClientRect().width;
              carImage.style.left = `${75 + timeFraction * (length! - carWidth)}px`;
              if (timeFraction < 1) {
                if (left < (length! - carWidth))
                  requestId = requestAnimationFrame(animate);
              }
            }
          });
        }
        requestId = requestAnimationFrame(moveAnimate);
        await engineService.switchEngineDriveMode(id, 'drive')
          .then(
            () => console.log(duration))
          .catch(
            () => cancelAnimationFrame(requestId),
          );
      }
      )()
        .then(() => console.log('success'))
        .catch(() => console.log('error'));
    });
    bBtn.addEventListener('click', () => {
      aBtn.disabled = false;
      bBtn.disabled = true;
      (async () => {
        const engineService = new EngineService();
        await engineService.startStopEngine(id, 'stopped');
        cancelAnimationFrame(requestId);
        if (carImage) {
          carImage.style.left = '75px';
        }
      }
      )()
        .then(() => console.log('success'))
        .catch(() => console.log('error'));
    });
  }

  drawCar(name = 'BMW', color = '#6edf64', id = 0) {
    const car = document.createElement('li');
    car.classList.add('car-item');
    car.innerHTML = `
    <div>
      <button id='select-btn' class="btn">Select</button>
      <button id='remove-btn' class="btn">Remove</button>
      <input class='current-car-id' type='hidden' value=${id}>
      <input class='current-car-color' type='hidden' value=${color}>
      <span class='car-name'>${name}</span>
    </div>
    <div class="car-interactivity">
      <div class="road">
        <div class="engine-buttons">
          <button id='a-btn' class="btn">A</button>
          <button id='b-btn' class="btn">B</button>
        </div>
        <svg class="car" fill="${color}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 511 511" style="enable-background:new 0 0 511 511;" xml:space="preserve"><g><path d="M160,307.5h133.538c14.182,0,27.524-7.554,34.82-19.715l14.501-24.169c2.273-3.789,1.045-8.703-2.744-10.976 c-3.788-2.273-8.702-1.045-10.976,2.744l-14.501,24.169c-4.421,7.369-12.507,11.947-21.101,11.947H160c-4.418,0-8,3.582-8,8 S155.582,307.5,160,307.5z" /> <path d="M504,323.569V299.5c0-48.523-39.477-88-88-88h-44.209c-12.392-9.747-62.874-48-91.791-48h-54 c-11.001,0-21.904,1.664-32.403,4.945c-0.204,0.063-0.404,0.135-0.602,0.215l-73.691,29.675 c-11.071,3.427-22.56,5.165-34.152,5.165H58.687c-0.379-0.778-0.884-1.51-1.53-2.157l-7.772-7.772 C57.969,189.897,64,181.368,64,171.455V163.5c0-4.418-3.582-8-8-8H8c-4.418,0-8,3.582-8,8v7.955 C0,184.713,10.787,195.5,24.045,195.5h4.642l8,8h-6.685C17.87,203.5,8,213.37,8,225.502V291.5c0,18.508,13.298,34.094,33.88,39.714 C51.989,345.87,68.888,355.5,88,355.5c15.22,0,29.034-6.112,39.138-16h249.723c10.104,9.888,23.918,16,39.138,16 s29.034-6.112,39.138-16H503c4.418,0,8-3.582,8-8C511,327.421,507.945,324.062,504,323.569z M16,171.5h32 c-0.024,4.416-3.624,8-8.045,8h-15.91C19.624,179.5,16.024,175.916,16,171.5z M356.287,219.763 c-3.571,2.505-6.227,5.165-8.059,7.339l-150.98-14.465C204.31,199.968,218.975,179.5,240,179.5h40 C298.891,179.5,336.321,204.724,356.287,219.763z M24,291.5v-65.998c0-3.31,2.692-6.002,6.002-6.002h55.15 c13.317,0,26.514-2.014,39.225-5.986c0.204-0.063,0.404-0.135,0.602-0.215l73.433-29.571c-1.999,2.142-3.953,4.431-5.85,6.899 c-9.799,12.756-14.805,25.43-15.014,25.963c-0.913,2.336-0.677,4.965,0.638,7.102c1.314,2.136,3.554,3.533,6.051,3.772l167,16 c0.28,0.027,0.559,0.041,0.835,0.041c2.931,0,5.573-1.5,6.942-4.153c0.559-0.939,7.435-11.851,24.986-11.851h32 c39.701,0,72,32.299,72,72v24h-21.414c3.467-7.279,5.414-15.415,5.414-24c0-30.878-25.122-56-56-56s-56,25.122-56,56 c0,8.585,1.947,16.721,5.414,24H138.586c3.467-7.279,5.414-15.415,5.414-24c0-30.878-25.122-56-56-56s-56,25.122-56,56 c0,3.313,0.306,6.554,0.86,9.711C27.217,304.609,24,298.428,24,291.5z M48,299.5c0-22.056,17.944-40,40-40s40,17.944,40,40 s-17.944,40-40,40S48,321.556,48,299.5z M416,339.5c-22.056,0-40-17.944-40-40s17.944-40,40-40s40,17.944,40,40 S438.056,339.5,416,339.5z" /><path  d="M112,291.5c-4.418,0-8,3.582-8,8c0,8.822-7.178,16-16,16s-16-7.178-16-16s7.178-16,16-16c4.418,0,8-3.582,8-8s-3.582-8-8-8  c-17.645,0-32,14.355-32,32s14.355,32,32,32s32-14.355,32-32C120,295.082,116.418,291.5,112,291.5z"  />  <path    d="M440,291.5c-4.418,0-8,3.582-8,8c0,8.822-7.178,16-16,16s-16-7.178-16-16s7.178-16,16-16c4.418,0,8-3.582,8-8s-3.582-8-8-8    c-17.645,0-32,14.355-32,32s14.355,32,32,32s32-14.355,32-32C448,295.082,444.418,291.5,440,291.5z"    />  </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                <div class="finish"></div>
              </div>
            </div>`;
    const carImage = car.querySelector<SVGElement>('.car');
    this.onSelectClick(car);
    const aBtn = car.querySelector<HTMLButtonElement>('#a-btn');
    const bBtn = car.querySelector<HTMLButtonElement>('#b-btn');
    if (aBtn && bBtn && carImage) {
      bBtn.disabled = true;
      this.onABBtnClick(aBtn, bBtn, id, carImage);
    }
    this.onRemoveClick(car, id);
    return car;
  }

  onRaceClick(parentElement: HTMLElement, requestIds: number[]) {
    parentElement.querySelector('#race-btn')?.addEventListener('click', () => {
      let winner = false;
      document.querySelectorAll('.car-item').forEach((car, index) => {
        (async () => {
          const aBtn = car.querySelector<HTMLButtonElement>('#a-btn');
          const bBtn = car.querySelector<HTMLButtonElement>('#b-btn');
          if (aBtn && bBtn) {
            aBtn.disabled = true;
            bBtn.disabled = false;
          }
          const carName = car.querySelector<HTMLElement>('.car-name')?.innerHTML || '';
          const id = +car.querySelector<HTMLInputElement>('.current-car-id')!.value;
          const carImage = car.querySelector<SVGElement>('.car');

          const engineService = new EngineService();
          const duration = await engineService.startStopEngine(id, 'started');
          function moveAnimate() {
            const prev = performance.now();
            requestAnimationFrame(function animate(time) {
              const timeFraction = (time - prev) / duration;
              if (carImage) {
                const carWidth = carImage.getBoundingClientRect().width;
                const left = carImage.getBoundingClientRect().left;
                const length = document.querySelector<HTMLElement>('.road')?.getBoundingClientRect().width;
                carImage.style.left = `${75 + timeFraction * (length! - carWidth)}px`;
                if (timeFraction < 1) {
                  if (left < (length! - carWidth))
                    requestIds[index] = requestAnimationFrame(animate);
                }
              }
            });
          }
          requestIds[index] = requestAnimationFrame(moveAnimate);
          await engineService.switchEngineDriveMode(id, 'drive')
            .then(
              async () => {
                if (!winner) {
                  winner = true;
                  const garagePage = document.querySelector('.garage');
                  const winnerDeclaration = document.createElement('h2');
                  winnerDeclaration.classList.add('winner-declaration');
                  winnerDeclaration.innerText = `Winner is ${carName}, ${(Math.floor(duration / 10)) / 100}`;
                  if (garagePage) garagePage.append(winnerDeclaration);
                  const winnerService = new WinnerService();
                  try {
                    await winnerService.createWinner(id, 1, (Math.floor(duration / 10)) / 100);
                  } catch (e) {
                    const winnerInfo = await winnerService.getWinner(id);
                    if (winnerInfo) {
                      const wins = winnerInfo.wins;
                      const bestTime = winnerInfo.time < (Math.floor(duration / 10) / 100) ? winnerInfo.time : Math.floor(duration / 10) / 100;
                      await winnerService.updateWinner(id, wins + 1, bestTime);
                    }
                  }
                }
              })
            .catch(
              () => cancelAnimationFrame(requestIds[index]),
            );
        }
        )()
          .then(() => console.log('Car has successfully arrived!'))
          .catch(() => console.log('error'));
      });
    });
  }

  onResetClick(parentElement: HTMLElement, requestIds: number[]) {
    parentElement.querySelector('#reset-btn')?.addEventListener('click', () => {
      document.querySelector('.winner-declaration')?.remove();
      document.querySelectorAll('.car-item').forEach((car, index) => {
        const aBtn = car.querySelector<HTMLButtonElement>('#a-btn');
        const bBtn = car.querySelector<HTMLButtonElement>('#b-btn');
        if (aBtn && bBtn) {
          aBtn.disabled = false;
          bBtn.disabled = true;
        }
        const id = +car.querySelector<HTMLInputElement>('.current-car-id')!.value;
        const carImage = car.querySelector<SVGElement>('.car');
        (async () => {
          const engineService = new EngineService();
          await engineService.startStopEngine(id, 'stopped');
          cancelAnimationFrame(requestIds[index]);
          if (carImage) {
            carImage.style.left = '75px';
          }
        }
        )()
          .then(() => console.log('success'))
          .catch(() => console.log('error'));

      });
    });
  }

  onCreateClick(parentElement: HTMLElement, carService: CarService) {
    parentElement.querySelector('#create-btn')?.addEventListener('click', () => {
      (async () => {
        {
          const nameInput = parentElement.querySelector<HTMLInputElement>('#create-name');
          if (!nameInput) return;
          const name = nameInput.value;
          const colorInput = parentElement.querySelector<HTMLInputElement>('#create-color');
          if (!colorInput) return;
          const color = colorInput.value;
          await carService.createCar(name, color);
          await this.reDrawPage();
        }
      })()
        .then(() => console.log('success'))
        .catch(() => console.log('error'));
    });
  }

  onUpdateClick(parentElement: HTMLElement, carService: CarService) {
    parentElement.querySelector('#update-btn')?.addEventListener('click', () => {
      (async () => {
        {
          const idInput = parentElement.querySelector<HTMLInputElement>('.update-cars input[type=\'hidden\']');
          const nameInput = parentElement.querySelector<HTMLInputElement>('.update-cars input[type=\'text\']');
          const colorInput = parentElement.querySelector<HTMLInputElement>('.update-cars input[type=\'color\']');
          if (!idInput || !nameInput || !colorInput) return;
          await carService.updateCar(+idInput.value, nameInput.value, colorInput.value);
          await this.reDrawPage();
        }
      })()
        .then(() => console.log('success'))
        .catch(() => console.log('error'));
    });
  }

  drawCarCreator() {
    const carService = new CarService();
    const carCreator = document.createElement('div');
    carCreator.classList.add('create');
    carCreator.innerHTML = ` <div class="create-cars">
    <input id="create-name" type="text">
    <input id="create-color" type="color">
    <button id="create-btn" class="btn">Create</button>
  </div>
  <div class="update-cars">
    <input type="text">
    <input type="color">
    <input type='hidden'>
    <button  id="update-btn" class="btn">Update</button>
  </div>
  <div class="interactivity-cars">
    <button id='race-btn' class="btn">Race</button>
    <button id='reset-btn' class="btn">Reset</button>
    <button id='generate' class="btn">Generate</button>
  </div>`;
    const requestIds: number[] = [];
    this.onRaceClick(carCreator, requestIds);
    this.onResetClick(carCreator, requestIds);
    this.onCreateClick(carCreator, carService);
    this.onUpdateClick(carCreator, carService);
    carCreator.querySelector('#generate')?.addEventListener('click', () => {
      (async () => {
        await this.generateCars();
      })()
        .then(() => console.log('success'))
        .catch(() => console.log('error'));
    });
    return carCreator;
  }

  async generateCars() {
    const carService = new CarService();
    for (let i = 0; i < 100; i++) {
      const color = this.colors[Math.ceil(Math.random() * this.colors.length) - 1];
      const carName = this.namesOfCars[Math.ceil(Math.random() * this.namesOfCars.length) - 1];
      const carModel = this.namesOfModels[Math.ceil(Math.random() * this.namesOfModels.length) - 1];
      await carService.createCar(`${carName} ${carModel}`, color);
    }
    document.querySelector('.garage')?.remove();
    await this.drawPage();
  }

}
export default GaragePage;