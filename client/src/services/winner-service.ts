import { Iwinner } from '../interfaces/winner-interface';

class WinnerService {
  url = 'http://127.0.0.1:3000';

  async getWinners(page = 1, limit = 3, sort = 'win', order = 'ASC') {
    let count = 0;
    let winners: Iwinner[] = [];
    await fetch(`${this.url}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`)
      .then((response) => {
        if (response.ok) {
          const totalCount = response.headers.get('X-Total-Count');
          if (totalCount) {
            count = +totalCount;
          }
          return response;
        }
        throw new Error('No such car');
      })
      .then((data) => data.json())
      .then((data: Iwinner[]) => winners = data);
    return [winners, count];
  }

  async getWinner(id = 6) {
    await fetch(`${this.url}/winners/${id}`)
      .then((data) => data.json())
      .then((data) => console.log(data));
  }

  async createWinner(id = 0, wins = 2, time = 2.3) {
    await fetch(`${this.url}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        wins,
        time,
      }),
    })
      .then((response) => {
        if (response.status === 500) {
          throw new Error('Error: Insert failed, duplicate id');
        }
        return response;
      })
      .then((data) => data.json())
      .then((data) => console.log(data));
  }

  async deleteWinner(id = 0) {
    await fetch(`${this.url}/winners/${id}`, {
      method: 'DELETE',
    })
      .then((data) => data.json())
      .then((data) => console.log(data));
  }

  async updateWinner(id = 0, wins = 1, time = 2.5) {
    await fetch(`${this.url}/winners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wins,
        time,
      }),
    })
      .then((data) => data.json())
      .then((data) => console.log(data));
  }
}
export default WinnerService;
