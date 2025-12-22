'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '@/scss/module/typing.module.scss';

interface Stats {
  accuracy: number;
  wpm: number;
  errors: number;
  correctChars: number;
  totalChars: number;
}

const practiceTexts = [
  '빠른 갈색 여우가 게으른 개를 뛰어넘습니다',
  '안녕하세요 타자 연습 프로그램입니다',
  '프로그래밍은 창의적이고 논리적인 활동입니다',
  '매일 조금씩 연습하면 실력이 늘어납니다',
  '키보드를 보지 않고 타이핑하는 것이 목표입니다',
];

export default function TypingPage() {
  const [currentText, setCurrentText] = useState(practiceTexts[0]);
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({
    accuracy: 100,
    wpm: 0,
    errors: 0,
    correctChars: 0,
    totalChars: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userInput.length === currentText.length && userInput.length > 0) {
      handleFinish();
    }
  }, [userInput, currentText]);

  const handleStart = () => {
    setIsStarted(true);
    setIsFinished(false);
    setUserInput('');
    setStartTime(Date.now());
    setStats({
      accuracy: 100,
      wpm: 0,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
    });
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStarted) return;

    const input = e.target.value;
    setUserInput(input);

    let correctChars = 0;
    let errors = 0;

    for (let i = 0; i < input.length; i++) {
      if (input[i] === currentText[i]) {
        correctChars++;
      } else {
        errors++;
      }
    }

    const accuracy = input.length > 0 ? (correctChars / input.length) * 100 : 100;

    const elapsedMinutes = startTime ? (Date.now() - startTime) / 60000 : 0;
    const wpm = elapsedMinutes > 0 ? Math.round(correctChars / 5 / elapsedMinutes) : 0;

    setStats({
      accuracy: Math.round(accuracy),
      wpm,
      errors,
      correctChars,
      totalChars: input.length,
    });
  };

  const handleFinish = () => {
    setIsFinished(true);
    setIsStarted(false);
  };

  const handleReset = () => {
    setIsStarted(false);
    setIsFinished(false);
    setUserInput('');
    setStartTime(null);
    setStats({
      accuracy: 100,
      wpm: 0,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
    });
  };

  const handleNewText = () => {
    const newText = practiceTexts[Math.floor(Math.random() * practiceTexts.length)];
    setCurrentText(newText);
    handleReset();
  };

  const getCharClassName = (index: number) => {
    if (index >= userInput.length) return styles.charPending;
    return userInput[index] === currentText[index] ? styles.charCorrect : styles.charError;
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.backButton}>
          ← 홈으로
        </Link>
      </nav>

      <div className={styles.typingPractice}>
        <div className={styles.header}>
          <h1>⌨️ 타자 연습</h1>
          <p className={styles.subtitle}>정확하고 빠르게 타이핑해보세요</p>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>정확도</div>
            <div className={styles.statValue}>{stats.accuracy}%</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>타수 (WPM)</div>
            <div className={styles.statValue}>{stats.wpm}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>오타</div>
            <div className={`${styles.statValue} ${styles.error}`}>{stats.errors}</div>
          </div>
        </div>

        <div className={styles.textDisplay}>
          {currentText.split('').map((char, index) => (
            <span key={index} className={getCharClassName(index)}>
              {char}
            </span>
          ))}
        </div>

        <div className={styles.inputSection}>
          <input
            ref={inputRef}
            type="text"
            className={styles.typingInput}
            value={userInput}
            onChange={handleInputChange}
            placeholder="여기에 입력하세요..."
          />
        </div>

        <div className={styles.buttonGroup}>
          {isStarted && !isFinished && (
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleReset}>
              재시작
            </button>
          )}
          {isFinished && (
            <>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleReset}>
                다시 하기
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleNewText}>
                새 문장
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
