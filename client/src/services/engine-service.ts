import { Iengine } from '../interfaces/engine-interface';

class EngineService {
  url = 'http://127.0.0.1:3000/engine';

  async startStopEngine(id = 0, status = 'started') {
    let time = 0;
    await fetch(`${this.url}?id=${id}&status=${status}`, {
      method: 'PATCH',
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Car with such id was not found in the garage.');
          }
          if (response.status === 400) {
            throw new Error(
              'Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"',
            );
          }
        }
        return response.json();
      })
      .then((data: Iengine) => {
        time = data.distance / data.velocity;
      });
    return time;
  }

  async switchEngineDriveMode(id = 0, status = 'drive') {
    const response = await fetch(`${this.url}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?',
        );
      }
      if (response.status === 400) {
        throw new Error(
          'Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"',
        );
      }
      if (response.status === 429) {
        throw new Error(
          'Drive already in progress. You can\'t run drive for the same car twice while it\'s not stopped.',
        );
      }
      if (response.status === 500) {
        throw new Error("Car has been stopped suddenly. It's engine was broken down.");
      }
    }
    return response.json();
  }
}

export default EngineService;
