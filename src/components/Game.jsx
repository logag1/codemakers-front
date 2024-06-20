import { useState, useRef, useEffect } from 'react';
import style from './css/game.module.css';
import clickedButton from './button_click.png';
import { useLocation } from 'react-router';

export default function Game() {
  const [started, setStarted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const audioRef = useRef(null);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [ranking, setRanking] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get('studentId');
  const nickname = queryParams.get('name');

  const getRanking = async () => {
    const res = await fetch('/api/ranking');
    const data = await res.json();

    if(!data.success) return alert(data.message);

    setRanking(data.result);
  }

  useEffect(() => {
    getRanking();
  }, []);

  const rotateImg = () => {
    for (let i = 0; i <= 10; i++) {
      setTimeout(() => {
        setRotation(i % 2 === 0 ? i : -i);
      }, i * 50);
    }
    setTimeout(() => {
      setRotation(0);
    }, 500);
  };

  const requestResult = async () => {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clickCount,
        nickname,
        studentId
      })
    });

    const data = await res.json();

    if(!data.success) return alert(data.message);
    
    window.location.href = '/';

    alert(`서버에 ${studentId}_${nickname}님의 정보를 저장했습니다`);
  }

  const startTimer = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            setStarted(false);
            requestResult();
            return;
          }
          return prevTimeLeft - 1;
        });
      }, i * 1000);
    }
  };

  const handleClick = () => {
    if(started) {
      setClickCount(clickCount + 1);
      rotateImg();
    }
    if(!started) {
      startTimer();
      setStarted(true);
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }

  const toggleRanking = () => {
    setIsRankingOpen(!isRankingOpen);
  };

  return (
    <div className={style.container}>
      {(
        <div className={style.game_main}>
          <div className={style.timer}>
            <span>00:00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft }</span>
          </div>
          <span className={style.click_count}>클릭횟수: <a>{clickCount}</a>회</span>
          <img src={clickedButton} onClick={handleClick} style={{ transform: `rotate(${rotation}deg)` }} className={style.button_img} />
          <audio ref={audioRef} src="https://soundbible.com/mp3/Mario_Jumping-Mike_Koenig-989896458.mp3" />
        </div>
      )}
      <div className={style.main_bottom}>
        <button className={style.go_back} onClick={() => window.location.href = '/' }>돌아가기</button>
        <div className={style.ranking}>
          <span>👑 랭킹 보러가기 </span>
          <svg onClick={toggleRanking} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path data-v-d2e773b6="" fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"></path></svg>
        </div>
      </div>
      {ranking && isRankingOpen && (
        <div className={style.ranking_content}>
          {
            ranking.map(e => (
              <div className={style.ranking_user}>
                <a>{e.studentId}</a>
                <span>{e.clickCount}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}