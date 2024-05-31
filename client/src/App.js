import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Modal from './Modal';

function App() {
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timerLevel, setTimerLevel] = useState(1);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    axios.get('/api/users/profile')
      .then(response => {
        setUser(response.data);
        if (response.data.nextChestOpenTime) {
          const remainingTime = new Date(response.data.nextChestOpenTime).getTime() - new Date().getTime();
          if (remainingTime > 0) {
            setTimer(remainingTime);
          }
        }
        if (response.data.timerLevel) {
          setTimerLevel(response.data.timerLevel);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1000);
      }, 1000);
    } else if (timer <= 0 && timer !== null) {
      setTimer(null);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const openChest = () => {
    if (timer === null) {
      axios.post('/api/chests/open')
        .then(response => {
          setUser(response.data);
          const remainingTime = new Date(response.data.nextChestOpenTime).getTime() - new Date().getTime();
          setTimer(remainingTime);
        })
        .catch(error => {
          console.error('Error opening chest:', error);
        });
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const openUpgradeModal = () => {
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
  };

  const upgradeChest = () => {
    if (user && user.coins >= getChestUpgradeCost()) {
      axios.post('/api/chests/upgrade')
        .then(response => {
          setUser(response.data);
          closeUpgradeModal();
        })
        .catch(error => {
          console.error('Error upgrading chest:', error);
        });
    }
  };

  const getChestUpgradeCost = () => {
    if (!user) return 0;
    const upgradeCosts = [10000, 20000, 40000, 80000, 160000, 320000, 640000];
    return upgradeCosts[user.chestLevel - 1] || 0;
  };

  const getTimerUpgradeCost = () => {
    const timerUpgradeCosts = [0, 2000, 8000, 16000, 32000, 128000];
    return timerUpgradeCosts[timerLevel] || 0;
  };

  const upgradeTimer = () => {
    const cost = getTimerUpgradeCost();
    if (user && user.coins >= cost) {
      axios.post('/api/timer/upgrade', { level: timerLevel + 1 })
        .then(response => {
          setUser(response.data);
          setTimerLevel(timerLevel + 1);
          closeUpgradeModal();
        })
        .catch(error => {
          console.error('Error upgrading timer:', error);
        });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <>
            <div className="user-info">
              <h1>Welcome, {user.username}!</h1>
              <p>Баланс: {user.coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
              <p>Chest Level: {user.chestLevel}</p>
              <p>Timer Level: {timerLevel}</p>
            </div>
            <div className="chest-container" onClick={openChest}>
              <img src={process.env.PUBLIC_URL + '/img/closed-chest.png'} alt="Chest" className="chest-image" />
            </div>
            {timer !== null && (
              <div className="timer">
                {formatTime(timer)}
              </div>
            )}
            <div className="menu-buttons">
              <button onClick={openUpgradeModal}>Улучшения</button>
              <button>Задания</button>
              <button>Кошелек</button>
              <button>Друзья</button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </header>
      <Modal isOpen={isUpgradeModalOpen} onClose={closeUpgradeModal} title="Улучшения">
        <div>
          <h2>Улучшение сундука</h2>
          <p>Улучшить сундук, чтобы увеличить доход с одного открытия.</p>
          <p>Стоимость улучшения: {getChestUpgradeCost()} монет</p>
          {user && user.coins >= getChestUpgradeCost() ? (
            <button onClick={upgradeChest}>Улучшить сундук</button>
          ) : (
            <button disabled>Недостаточно монет</button>
          )}
        </div>
        <div>
          <h2>Улучшение таймера</h2>
          <p>Улучшить таймер, чтобы увеличить время между открытиями сундука.</p>
          <p>Текущий уровень таймера: {timerLevel}</p>
          <p>Стоимость улучшения: {getTimerUpgradeCost()} монет</p>
          {user && user.coins >= getTimerUpgradeCost() ? (
            <button onClick={upgradeTimer}>Улучшить таймер</button>
          ) : (
            <button disabled>Недостаточно монет</button>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default App;
