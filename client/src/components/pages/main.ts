import GaragePage from './garage';
import WinnersPage from './winners';
class MainPage {
  drawBtns() {
    const btns = document.createElement('div');
    btns.classList.add('view-buttons');
    btns.innerHTML = `<button id='toGarage' disabled class='btn'>To garage</button>
    <button id='toWinners' class="btn">To winners</button>`;
    btns.querySelector('#toGarage')?.addEventListener('click', () => {
      (async () => {
        await this.handlePages('.winners', 'Garage');
      })()
        .then(() => console.log('succes'))
        .catch(() => console.log('error'));

    });
    btns.querySelector('#toWinners')?.addEventListener('click', () => {
      (async () => {
        await this.handlePages('.garage', 'Winner');
      })()
        .then(() => console.log('succes'))
        .catch(() => console.log('error'));
    });

    document.body.append(btns);
  }

  async drawPage() {
    this.drawBtns();
    await new GaragePage().drawPage();
  }

  async handlePages(selector: string, pageToDraw: string) {
    const removedPage = document.querySelector(selector);
    if (removedPage) {
      removedPage.remove();
    }
    const toWinnersBtn = document.querySelector<HTMLButtonElement>('#toWinners');
    const toGarageBtn = document.querySelector<HTMLButtonElement>('#toGarage');
    if (toWinnersBtn && toGarageBtn) {
      switch (pageToDraw) {
        case 'Winner':
          console.log(WinnersPage.page);
          toWinnersBtn.disabled = true;
          toGarageBtn.disabled = false;
          await new WinnersPage().drawPage();
          break;
        case 'Garage':
          toWinnersBtn.disabled = false;
          toGarageBtn.disabled = true;
          await new GaragePage().drawPage();
          break;
      }
    }
  }
}
export default MainPage;