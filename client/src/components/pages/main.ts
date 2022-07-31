import GaragePage from './garage';
import WinnersPage from './winners';
class MainPage {
  drawBtns() {
    const btns = document.createElement('div');
    btns.classList.add('view-buttons');
    btns.innerHTML = `<button id='toGarage' disabled class='btn'>To garage</button>
    <button id='toWinners' class="btn">To winners</button>`;
    btns.querySelector('#toGarage')?.addEventListener('click', () => {
      this.handlePages('.winners', 'Garage');
    });
    btns.querySelector('#toWinners')?.addEventListener('click', () => {
      this.handlePages('.garage', 'Winner');
    });

    document.body.append(btns);
  }

  drawPage() {
    this.drawBtns();
    new GaragePage().drawPage();
  }

  handlePages(selector: string, pageToDraw: string) {
    const removedPage = document.querySelector(selector);
    if (removedPage) {
      removedPage.remove();
    }
    switch (pageToDraw) {
      case 'Winner':
        document.querySelector<HTMLButtonElement>('#toWinners')!.disabled = true;
        document.querySelector<HTMLButtonElement>('#toGarage')!.disabled = false;
        new WinnersPage().drawPage();
        break;
      case 'Garage':
        document.querySelector<HTMLButtonElement>('#toWinners')!.disabled = false;
        document.querySelector<HTMLButtonElement>('#toGarage')!.disabled = true;
        new GaragePage().drawPage();
        break;
    }
  }
}
export default MainPage;