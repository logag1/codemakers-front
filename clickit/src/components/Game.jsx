import { useState, useRef } from 'react';
import style from './css/game.module.css';
import clickedButton from './button_click.png';
import { useLocation } from 'react-router';

let last_cc = 0;

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

  const handleClick = () => {
    if (!started) {
      startTimer();
      setStarted(true);
    }
    if (started) {
      last_cc += 1;
      setClickCount(clickCount + 1);
      rotateImg();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  };

  const startTimer = () => {
    let hasAlerted = false;

    const countdown = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(countdown);
          if (!hasAlerted) {
            setTimeLeft('TIMEOVER!');
            setStarted(false);
            alert(`${studentId} ${nickname} [${last_cc}]`);
            if (localStorage.getItem('top') < last_cc) {
              localStorage.setItem('top', last_cc);
              localStorage.setItem('name', `${studentId} ${nickname}`);
            }
            hasAlerted = true;
            window.location.href = '/';
          }
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
  };

  return (
    <div className={style.container}>
      <div className={style.game_main}>
        <div className={style.timer}>
          <span>00:00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft }</span>
        </div>
        <span className={style.click_count}>클릭횟수: <a>{clickCount}</a>회</span>
        <button onClick={handleClick} style={{ transform: `rotate(${rotation}deg)` }} className={style.btn_main}>
          <img src={clickedButton} alt='' className={style.button_img} />
        </button>
        <audio ref={audioRef} src="https://soundbible.com/mp3/Mario_Jumping-Mike_Koenig-989896458.mp3" />
      </div>
      <div className={style.main_bottom}>
        <button className={style.go_back} onClick={() => window.location.href = '/' }>돌아가기</button>
      </div>
      {ranking && isRankingOpen && (
        <div className={style.ranking_content}>
          {
            ranking.map(e => (
              <div className={style.ranking_user} key={e.studentId}>
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
