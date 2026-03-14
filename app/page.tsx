'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import styles from 'scss/module/typing.module.scss';
import BOOKS_RAW from 'public/novel/novel.json';
import { TypingTypeInterface } from '@/interface/typingTypeInterface';
const BOOKS = BOOKS_RAW as TypingTypeInterface[];

const CHARS_PER_PAGE = 350;

// 큰따옴표, 작은따옴표, 괄호 제거 (!, ? 유지)
const cleanText = (s: string) => s.replace(/["'"''"()\[\]{}「」『』]/g, '');

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<'novel' | 'poem'>('novel');
  const [selectedBook, setSelectedBook] = useState<TypingTypeInterface>(BOOKS[0]);
  const [pageIndex, setPageIndex] = useState(0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [completedInputs, setCompletedInputs] = useState<string[]>([]);
  const [isBookListOpen, setIsBookListOpen] = useState(false);
  const [fontSizeRem, setFontSizeRem] = useState(1.6);
  const [showModal, setShowModal] = useState(false);
  const [finalStats, setFinalStats] = useState({ correct: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredBooks = useMemo(() => BOOKS.filter(b => b.genre === selectedGenre), [selectedGenre]);

  const totalPages = useMemo(() => Math.ceil(selectedBook.content.length / CHARS_PER_PAGE), [selectedBook]);

  // 장르별 문장 분리: 시는 줄 단위, 소설은 "." 기준
  const sentences = useMemo(() => {
    const start = pageIndex * CHARS_PER_PAGE;
    const slice = selectedBook.content.slice(start, start + CHARS_PER_PAGE);
    if (selectedBook.genre === 'poem') {
      return slice
        .split('\n')
        .map(s => cleanText(s.trim()))
        .filter(s => s.length > 0);
    }
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
      setShowModal(true);
    }
  };

  const changeBook = (book: TypingTypeInterface) => {
    setSelectedBook(book);
    setPageIndex(0);
    setShowModal(false);
  };

  const handleGenreChange = (genre: 'novel' | 'poem') => {
    setSelectedGenre(genre);
    changeBook(BOOKS.filter(b => b.genre === genre)[0]);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPageIndex(0);
    setInputValue('');
    setCompletedInputs([]);
    setCurrentSentenceIdx(0);
  };

  const totalProgress = useMemo(() => {
    const currentPos = pageIndex * CHARS_PER_PAGE + inputValue.length;
    return Math.min(100, (currentPos / selectedBook.content.length) * 100);
  }, [selectedBook, pageIndex, inputValue]);

  return (
    <main className={styles.container}>
      <article className={styles.notebook} onClick={() => inputRef.current?.focus()}>
        {/* 장르 탭 */}
        <div className={styles.genreTabs}>
          <button
            className={`${styles.genreTab} ${selectedGenre === 'novel' ? styles.genreTabActive : ''}`}
            onClick={e => {
              e.stopPropagation();
              handleGenreChange('novel');
            }}
          >
            소설
          </button>
          <button
            className={`${styles.genreTab} ${selectedGenre === 'poem' ? styles.genreTabActive : ''}`}
            onClick={e => {
              e.stopPropagation();
              handleGenreChange('poem');
            }}
          >
            시
          </button>
        </div>

        {/* 헤더 */}
        <header className={styles.pageHeader}>
          <div className={styles.bookInfo}>
            {selectedBook.title} <span>{selectedBook.author}</span>
          </div>

          <div className={styles.controls}>
            <div className={styles.zoomControls}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setFontSizeRem(p => Math.max(p - 0.2, 1.0));
                }}
                disabled={fontSizeRem <= 1.0}
              >
                글씨 작게
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setFontSizeRem(p => Math.min(p + 0.2, 2.5));
                }}
                disabled={fontSizeRem >= 2.5}
              >
                글씨 크게
              </button>
            </div>

            <div className={styles.bookDropdown}>
              <button
                className={styles.dropdownBtn}
                onClick={e => {
                  e.stopPropagation();
                  setIsBookListOpen(!isBookListOpen);
                }}
              >
                책 목록 ▾
              </button>

              {isBookListOpen && (
                <div className={styles.dropdownMenu}>
                  {filteredBooks.map(book => (
                    <button
                      key={book.id}
                      className={selectedBook.id === book.id ? styles.active : ''}
                      onClick={e => {
                        e.stopPropagation();
                        changeBook(book);
                        setIsBookListOpen(false);
                      }}
                    >
                      {book.title}
                      <span className={styles.dropdownAuthor}>{book.author} 지음</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 필사 영역 */}
        <section className={styles.typingAreaWrapper}>
          <div className={styles.sentenceList} style={{ fontSize: `${fontSizeRem}rem` }}>
            {sentences.map((sentence, idx) => {
              const isCurrent = idx === currentSentenceIdx;
              const typed = isCurrent ? inputValue : (completedInputs[idx] ?? '');

              return (
                <div key={idx} className={styles.sentenceBlock}>
                  <span className={styles.original}>{renderOriginal(sentence, typed)}</span>
                  <input
                    ref={isCurrent ? inputRef : null}
                    className={`${styles.typingInput} ${isCurrent ? styles.typingInputActive : styles.typingInputDone}`}
                    value={typed}
                    onChange={isCurrent ? handleChange : undefined}
                    onKeyDown={isCurrent ? handleKeyDown : undefined}
                    readOnly={!isCurrent}
                    spellCheck={false}
                    autoComplete="off"
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* 푸터 */}
        <footer className={styles.pageFooter}>
          <div className={styles.pageIndex}>
            - {pageIndex + 1} / {totalPages} 쪽 -
          </div>
        </footer>
      </article>

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
            <button className={styles.modalClose} onClick={handleModalClose}>
              처음부터 다시 쓰기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
