class MainPage {
  drawPage() {
    const btns = document.createElement('div');
    btns.classList.add('view-buttons');
    btns.innerHTML = `<button id='toGarage' class='btn'>To garage</button>
    <button id='toWinners' class="btn">To winners</button>`;
    document.body.append(btns);
  }
}
export default MainPage;