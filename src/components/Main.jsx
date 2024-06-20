import { useState } from 'react';
import style from './css/main.module.css';
import mainLogo from './main_logo.png';

export default function Main() {
  const [clickCount, setClickCount] = useState(0);
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleIdChange = (event) => {
    if (/^\d{0,5}$/.test(event.target.value)) {
      setStudentId(event.target.value);
      setError('');
    } else {
      setError('올바른 학번을 입력해주세요');
    }
  };

  const handleNameChange = (event) => {
    if(event.target.value.length <= 4) {
      setNickname(event.target.value);
      setError('');
    } else {
      setError('올바른 이름을 입력해주세요');
    }
  };

  const handleStart = (event) => {
    if(!studentId || !nickname) return setError('학번 또는 이름을 입력해주세요');;
    window.location.href = `/game?studentId=${studentId}&name=${nickname}`;
  }

  return (
    <div className={style.main_container}>
      <h1>CLICK IT!</h1>

      <div className={style.before_write_alert}>
        <span>게임 시작 전 확인해주세요!</span>
        <li>본인의 학번, 이름만을 이용해야 합니다</li>
        <li>10초 동안 버튼을 최대한 많이 누르는 게임입니다</li>
        <li>순위는 <a href='/ranking'>이곳</a>에서 확인해보실 수 있습니다</li>
      </div>

      <div className={style.input_wrapper}>
        <input
          type="text"
          value={studentId}
          onChange={handleIdChange}
          className={style.input}
          placeholder=' 학번을 입력해주세요.'
        />
        <input
          type="text"
          value={nickname}
          onChange={handleNameChange}
          className={style.input}
          placeholder=' 이름을 입력해주세요.'
        />
      </div>

      {error && <p className={style.error_text}>{error}</p>}

      <img src={mainLogo} className={style.main_logo} />

      <button onClick={handleStart}>시작하기</button>
    </div>
  );
}