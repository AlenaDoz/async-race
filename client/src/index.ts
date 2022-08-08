import './style.css';
import MainPage from './components/pages/main';
(async () => {
  await new MainPage().drawPage();
})()
  .then(() => console.log('success'))
  .catch(() => console.log('error'));
