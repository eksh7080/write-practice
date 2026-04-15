'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Settings, X, Minus, Plus } from 'lucide-react';
import styles from 'scss/module/typing.module.scss';
import BOOKS_RAW from 'public/novel/novel.json';
import { TypingTypeInterface } from '@/interface/typingTypeInterface';
const BOOKS = BOOKS_RAW as TypingTypeInterface[];

const CHARS_PER_PAGE = 350;

// 큰따옴표, 작은따옴표, 괄호 제거 (!, ? 유지)
const cleanText = (s: string) => s.replace(/["'"''"()\[\]{}「」『』]/g, '');

// 디스커버리 실험 - localStorage 유틸
const STORAGE_KEYS = {
  FAKE_DOOR_CLICKS: 'discovery_fake_door_clicks',
  FAKE_DOOR_VIEWS: 'discovery_fake_door_views',
  SURVEY_RESPONSES: 'discovery_survey_responses',
  STATS_CLICKS: 'discovery_stats_clicks',
  STATS_VIEWS: 'discovery_stats_views',
  TYPING_PROGRESS: 'typing_progress',
};

const incrementCounter = (key: string) => {
  const val = parseInt(localStorage.getItem(key) || '0', 10);
  localStorage.setItem(key, String(val + 1));
};

const appendToArray = (key: string, item: string) => {
  let arr: unknown[];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    arr = Array.isArray(parsed) ? parsed : [];
  } catch {
    arr = [];
  }
  arr.push({ value: item, timestamp: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(arr));
};

// 설문 선택지
const SURVEY_OPTIONS = [
  '타이핑 실력 향상',
  '문학 작품 감상',
  '집중·명상·마음 정리',
  '한글 맞춤법 연습',
] as const;

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<'novel' | 'poem' | 'essay' | 'quote'>('novel');
  const [selectedBook, setSelectedBook] = useState<TypingTypeInterface>(BOOKS[0]);
  const [pageIndex, setPageIndex] = useState(0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [completedInputs, setCompletedInputs] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [fontSizeRem, setFontSizeRem] = useState(1.6);
  const [showModal, setShowModal] = useState(false);
  const [finalStats, setFinalStats] = useState({ correct: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const notebookRef = useRef<HTMLDivElement>(null);

  // 실험 상태
  const [fakeDoorClicked, setFakeDoorClicked] = useState(false);
  const [surveyAnswer, setSurveyAnswer] = useState<string | null>(null);
  const [statsDetailClicked, setStatsDetailClicked] = useState(false);
  const [hasResumableProgress, setHasResumableProgress] = useState(false);
  const [resumeInfo, setResumeInfo] = useState<{ bookId: number; pageIndex: number; bookTitle: string } | null>(null);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);

  // 실험 3: 저장된 진행 상태 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TYPING_PROGRESS);
      if (saved) {
        const data = JSON.parse(saved);
        if (
          typeof data === 'object' && data !== null &&
          typeof data.bookId === 'number' &&
          typeof data.pageIndex === 'number' &&
          data.pageIndex > 0
        ) {
          const book = BOOKS.find(b => b.id === data.bookId);
          if (book) {
            setHasResumableProgress(true);
            setResumeInfo({ bookId: data.bookId, pageIndex: data.pageIndex, bookTitle: book.title });
          }
        }
      }
    } catch (e) { console.warn('진행 상태 복원 실패:', e); }
  }, []);

  // 실험 3: 진행 상태 저장
  useEffect(() => {
    if (pageIndex > 0) {
      localStorage.setItem(STORAGE_KEYS.TYPING_PROGRESS, JSON.stringify({
        bookId: selectedBook.id,
        pageIndex,
        timestamp: new Date().toISOString(),
      }));
    }
  }, [selectedBook, pageIndex]);

  // 실험 4: 타이핑 시작 시간 기록
  useEffect(() => {
    if (inputValue.length === 1 && !typingStartTime) {
      setTypingStartTime(Date.now());
    }
  }, [inputValue, typingStartTime]);

  const handleResumeProgress = useCallback(() => {
    if (!resumeInfo) return;
    const book = BOOKS.find(b => b.id === resumeInfo.bookId);
    if (book) {
      setSelectedGenre(book.genre);
      setSelectedBook(book);
      setPageIndex(resumeInfo.pageIndex);
    }
    setHasResumableProgress(false);
    setResumeInfo(null);
  }, [resumeInfo]);

  const dismissResume = useCallback(() => {
    setHasResumableProgress(false);
    setResumeInfo(null);
    localStorage.removeItem(STORAGE_KEYS.TYPING_PROGRESS);
  }, []);

  const filteredBooks = useMemo(() => BOOKS.filter(b => b.genre === selectedGenre), [selectedGenre]);

  const totalPages = useMemo(() => Math.ceil(selectedBook.content.length / CHARS_PER_PAGE), [selectedBook]);

  // 장르별 문장 분리: 시는 줄 단위, 소설/수필은 "." 기준, 명언은 전체
  const sentences = useMemo(() => {
    const start = pageIndex * CHARS_PER_PAGE;
    const slice = selectedBook.content.slice(start, start + CHARS_PER_PAGE);
    if (selectedBook.genre === 'poem') {
      return slice
        .split('\n')
        .map(s => cleanText(s.trim()))
        .filter(s => s.length > 0);
    }
    if (selectedBook.genre === 'quote') {
      const cleaned = cleanText(slice.trim());
      return cleaned.length > 0 ? [cleaned] : [];
    }
    // novel, essay: "." 기준 분리
    return slice
      .split('.')
      .map(s => cleanText(s.trim()))
      .filter(s => s.length > 0)
      .map(s => s + '.');
  }, [selectedBook, pageIndex]);

  useEffect(() => {
    setCurrentSentenceIdx(0);
    setInputValue('');
    setCompletedInputs([]);
  }, [sentences]);

  useEffect(() => {
    inputRef.current?.focus();
    // 활성 문장으로 양쪽 스크롤 동기화
    const activeEl = bookRef.current?.querySelector(`[data-idx="${currentSentenceIdx}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    const activeInput = notebookRef.current?.querySelector(`[data-idx="${currentSentenceIdx}"]`);
    if (activeInput) {
      activeInput.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [currentSentenceIdx]);

  // 원문 글자별 렌더링 (틀린 글자만 빨간색)
  const renderOriginal = (sentence: string, typed: string) =>
    sentence.split('').map((char, i) => (
      <span key={i} className={i < typed.length && typed[i] !== char ? styles.charWrong : undefined}>
        {char}
      </span>
    ));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const currentSentence = sentences[currentSentenceIdx];
    if (inputValue.length < currentSentence.length) return;

    // 정확도 계산
    let correct = 0;
    for (let i = 0; i < currentSentence.length; i++) {
      if (inputValue[i] === currentSentence[i]) correct++;
    }

    const newCompleted = [...completedInputs];
    newCompleted[currentSentenceIdx] = inputValue;
    setCompletedInputs(newCompleted);

    if (currentSentenceIdx < sentences.length - 1) {
      setCurrentSentenceIdx(prev => prev + 1);
      setInputValue('');
    } else if (pageIndex + 1 < totalPages) {
      setPageIndex(prev => prev + 1);
    } else {
      // 전체 완료 → 모달 표시
      const totalCorrect = newCompleted.reduce((acc, input, idx) => {
        let c = 0;
        for (let i = 0; i < sentences[idx].length; i++) {
          if (input[i] === sentences[idx][i]) c++;
        }
        return acc + c;
      }, correct);
      const totalChars = sentences.reduce((acc, s) => acc + s.length, 0);
      setFinalStats({ correct: totalCorrect, total: totalChars });

      // 실험 4: WPM 계산
      if (typingStartTime) {
        const elapsedMin = (Date.now() - typingStartTime) / 60000;
        const words = totalChars / 5; // 표준 WPM: 5글자 = 1단어
        setWpm(elapsedMin > 0 ? Math.round(words / elapsedMin) : 0);
      }

      // 실험 측정: 모달 뷰 카운트
      incrementCounter(STORAGE_KEYS.FAKE_DOOR_VIEWS);
      incrementCounter(STORAGE_KEYS.STATS_VIEWS);

      // 실험 상태 초기화
      setFakeDoorClicked(false);
      setSurveyAnswer(null);
      setStatsDetailClicked(false);

      setShowModal(true);

      // 실험 3: 완료 시 진행 저장 제거
      localStorage.removeItem(STORAGE_KEYS.TYPING_PROGRESS);
    }
  };

  const changeBook = (book: TypingTypeInterface) => {
    setSelectedBook(book);
    setPageIndex(0);
    setShowModal(false);
  };

  const handleGenreChange = (genre: 'novel' | 'poem' | 'essay' | 'quote') => {
    setSelectedGenre(genre);
    changeBook(BOOKS.filter(b => b.genre === genre)[0]);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPageIndex(0);
    setInputValue('');
    setCompletedInputs([]);
    setCurrentSentenceIdx(0);
    setTypingStartTime(null);
  };

  // 실험 1: Fake Door 클릭
  const handleFakeDoorClick = () => {
    if (!fakeDoorClicked) {
      incrementCounter(STORAGE_KEYS.FAKE_DOOR_CLICKS);
      setFakeDoorClicked(true);
    }
  };

  // 실험 2: 설문 응답
  const handleSurveySelect = (answer: string) => {
    if (!surveyAnswer) {
      appendToArray(STORAGE_KEYS.SURVEY_RESPONSES, answer);
      setSurveyAnswer(answer);
    }
  };

  // 실험 4: 통계 자세히 보기 클릭
  const handleStatsDetailClick = () => {
    if (!statsDetailClicked) {
      incrementCounter(STORAGE_KEYS.STATS_CLICKS);
      setStatsDetailClicked(true);
    }
  };

  const totalProgress = useMemo(() => {
    const currentPos = pageIndex * CHARS_PER_PAGE + inputValue.length;
    return Math.min(100, (currentPos / selectedBook.content.length) * 100);
  }, [selectedBook, pageIndex, inputValue]);

  return (
    <main className={styles.desk}>
      {/* 이어서 하기 배너 */}
      {hasResumableProgress && resumeInfo && (
        <div className={styles.resumeBanner}>
          <p>이전에 읽던 <strong>{resumeInfo.bookTitle}</strong>이 있어요. 이어서 하시겠어요?</p>
          <div className={styles.resumeActions}>
            <button className={styles.resumeBtn} onClick={handleResumeProgress}>이어서 하기</button>
            <button className={styles.resumeDismiss} onClick={dismissResume}>처음부터</button>
          </div>
        </div>
      )}

      <div className={styles.deskSurface}>
        {/* 책 제목 영역 */}
        <header className={styles.bookTitleHeader}>
          <h1>{selectedBook.title}</h1>
          <span>{selectedBook.author}</span>
        </header>

        {/* 2분할: 책 + 노트 */}
        <div className={styles.deskLayout} onClick={() => inputRef.current?.focus()}>
          {/* 왼쪽: 원문 책 */}
          <article className={styles.book}>
            <div className={styles.bookPage} ref={bookRef} style={{ fontSize: `${fontSizeRem}rem` }}>
              {sentences.map((sentence, idx) => {
                const isCurrent = idx === currentSentenceIdx;
                const typed = isCurrent ? inputValue : (completedInputs[idx] ?? '');

                return (
                  <div
                    key={idx}
                    data-idx={idx}
                    className={`${styles.bookSentence} ${isCurrent ? styles.bookSentenceActive : ''} ${idx < currentSentenceIdx ? styles.bookSentenceDone : ''}`}
                  >
                    {renderOriginal(sentence, typed)}
                  </div>
                );
              })}
            </div>
            <div className={styles.bookPageFooter}>
              {pageIndex + 1} / {totalPages} 쪽
            </div>
          </article>

          {/* 책 바인딩 */}
          <div className={styles.bookSpine} />

          {/* 오른쪽: 필사 노트 */}
          <article className={styles.notebook}>
            <div className={styles.notebookPage} ref={notebookRef} style={{ fontSize: `${fontSizeRem}rem` }}>
              {sentences.map((sentence, idx) => {
                const isCurrent = idx === currentSentenceIdx;
                const typed = isCurrent ? inputValue : (completedInputs[idx] ?? '');

                return (
                  <div
                    key={idx}
                    data-idx={idx}
                    className={`${styles.notebookSentence} ${isCurrent ? styles.notebookSentenceActive : ''}`}
                  >
                    <input
                      ref={isCurrent ? inputRef : null}
                      className={`${styles.typingInput} ${isCurrent ? styles.typingInputActive : styles.typingInputDone}`}
                      value={typed}
                      onChange={isCurrent ? handleChange : undefined}
                      onKeyDown={isCurrent ? handleKeyDown : undefined}
                      readOnly={!isCurrent}
                      spellCheck={false}
                      autoComplete="off"
                      placeholder={isCurrent ? '여기에 필사하세요...' : ''}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                );
              })}
            </div>
            <div className={styles.notebookProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${totalProgress}%` }} />
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* 패널 토글 버튼 */}
      <button
        className={styles.panelToggle}
        onClick={e => { e.stopPropagation(); setIsPanelOpen(!isPanelOpen); }}
        aria-label="설정 패널 열기"
      >
        <Settings size={22} />
      </button>

      {/* 플로팅 패널 */}
      <aside className={`${styles.floatingPanel} ${isPanelOpen ? styles.floatingPanelOpen : ''}`} onClick={e => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h3>설정</h3>
          <button onClick={() => setIsPanelOpen(false)} aria-label="패널 닫기">
            <X size={20} />
          </button>
        </div>

        {/* 장르 선택 */}
        <div className={styles.panelSection}>
          <p className={styles.panelSectionTitle}>장르</p>
          <div className={styles.panelGenreTabs}>
            {([
              { key: 'novel', label: '소설' },
              { key: 'poem', label: '시' },
              { key: 'essay', label: '수필' },
              { key: 'quote', label: '명언' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                className={`${styles.panelGenreTab} ${selectedGenre === tab.key ? styles.panelGenreTabActive : ''}`}
                onClick={() => handleGenreChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 작품 목록 */}
        <div className={styles.panelSection}>
          <p className={styles.panelSectionTitle}>작품 목록</p>
          <div className={styles.panelBookList}>
            {filteredBooks.map(book => (
              <button
                key={book.id}
                className={`${styles.panelBookItem} ${selectedBook.id === book.id ? styles.panelBookItemActive : ''}`}
                onClick={() => { changeBook(book); setIsPanelOpen(false); }}
              >
                <span className={styles.panelBookColor} style={{ background: book.color }} />
                <div>
                  <span className={styles.panelBookTitle}>{book.title}</span>
                  <span className={styles.panelBookAuthor}>{book.author}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 글씨 크기 */}
        <div className={styles.panelSection}>
          <p className={styles.panelSectionTitle}>글씨 크기</p>
          <div className={styles.panelFontControls}>
            <button
              className={styles.panelFontBtn}
              onClick={() => setFontSizeRem(p => Math.max(p - 0.2, 1.0))}
              disabled={fontSizeRem <= 1.0}
            >
              <Minus size={18} />
            </button>
            <span className={styles.panelFontSize}>{fontSizeRem.toFixed(1)}</span>
            <button
              className={styles.panelFontBtn}
              onClick={() => setFontSizeRem(p => Math.min(p + 0.2, 2.5))}
              disabled={fontSizeRem >= 2.5}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* 진행 상태 */}
        <div className={styles.panelSection}>
          <p className={styles.panelSectionTitle}>진행 상태</p>
          <div className={styles.panelProgress}>
            <span>{Math.floor(totalProgress)}%</span>
            <div className={styles.panelProgressBar}>
              <div className={styles.panelProgressFill} style={{ width: `${totalProgress}%` }} />
            </div>
          </div>
        </div>
      </aside>

      {/* 패널 배경 오버레이 (모바일) */}
      {isPanelOpen && <div className={styles.panelBackdrop} onClick={() => setIsPanelOpen(false)} />}

      {/* 완료 모달 */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>필사 완료!</h2>

            <div className={styles.modalStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>전체 진행도</span>
                <span className={styles.statValue}>{Math.floor(totalProgress)}%</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>정확도</span>
                <span className={styles.statValue}>
                  {finalStats.total > 0 ? Math.round((finalStats.correct / finalStats.total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className={styles.statsProto}>
              <div className={styles.statsProtoRow}>
                <span className={styles.statsProtoLabel}>타이핑 속도</span>
                <span className={styles.statsProtoValue}>{wpm} WPM</span>
              </div>
              <div className={styles.statsProtoBar}>
                <div className={styles.statsProtoFill} style={{ width: `${Math.min(100, (wpm / 120) * 100)}%` }} />
              </div>
              <button
                className={`${styles.statsDetailBtn} ${statsDetailClicked ? styles.statsDetailClicked : ''}`}
                onClick={handleStatsDetailClick}
              >
                {statsDetailClicked ? '준비 중입니다!' : '자세한 통계 보기 →'}
              </button>
            </div>

            <div className={styles.survey}>
              <p className={styles.surveyTitle}>필사를 하는 이유가 궁금해요!</p>
              <div className={styles.surveyOptions}>
                {SURVEY_OPTIONS.map(option => (
                  <button
                    key={option}
                    className={`${styles.surveyOption} ${surveyAnswer === option ? styles.surveyOptionSelected : ''}`}
                    onClick={() => handleSurveySelect(option)}
                    disabled={surveyAnswer !== null && surveyAnswer !== option}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {surveyAnswer && <p className={styles.surveyThanks}>응답해 주셔서 감사합니다!</p>}
            </div>

            <button
              className={`${styles.fakeDoorBtn} ${fakeDoorClicked ? styles.fakeDoorClicked : ''}`}
              onClick={handleFakeDoorClick}
            >
              {fakeDoorClicked ? '신청 완료! 곧 알려드릴게요' : '다음에 계속할 때 알림 받기'}
            </button>

            <button className={styles.modalClose} onClick={handleModalClose}>
              처음부터 다시 쓰기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
