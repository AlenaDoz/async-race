import { Icar } from '../interfaces/car-interface';

class CarService {
  url = 'http://127.0.0.1:3000';

  async getCars(limit = 7, page = 1) {
    let totalCount = 0;
    let cars: Icar[] = [];
    await fetch(`${this.url}/garage?_limit=${limit}&_page=${page}`)
      .then((res) => {
        totalCount = +res.headers.get('X-Total-Count')!;
        return res;
      })
      .then((data: Response) => data.json())
      .then((data: Icar[]) => cars = (data));
    const res: [number, Icar[]] = [totalCount, cars];
    return res;
  }

  async createCar(name = 'car', color = '#fff') {
    await fetch(`${this.url}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
      }),
    })
      .then((data: Response) => data.json());
  }

  async getCar(id = 0) {
    let carInfo = {} as Icar;
    await fetch(`${this.url}/garage/${id}`)
      .then((response) => {
        if (response.ok) {
          return response;
        }
        throw new Error('No such car');
      })
      .then((data: Response) => data.json())
      .then((data: Icar) => carInfo = data);
    return carInfo;
  }

  async deleteCar(id = 0) {
    await fetch(`${this.url}/garage/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          return response;
        }
        throw new Error('Car is not deleted');
      })
      .then((data: Response) => data.json());
  }

  async updateCar(id = 0, name = 'Tesla', color = '#fff') {
    await fetch(`${this.url}/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
      }),
    })
      .then((response: Response) => {
        if (response.ok) {
          return response;
        }
        throw new Error('Car is not deleted');
      })
      .then((data: Response) => data.json());
  }
}
export default CarService;
