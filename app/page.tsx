/**
 * 설명: 필사하기 페이지
 * @constructor
 * **/
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from 'scss/module/typing.module.scss';
import BOOKS from 'public/novel/novel.json';
import { TypingTypeInterface } from '@/interface/typingTypeInterface';

// 시니어 타겟을 위해 가로폭을 고려하여 한 줄에 표시될 최대 글자 수 지정 (자동 줄바꿈 방지)
const CHARS_PER_LINE = 32;
const CHARS_PER_PAGE = 350;

export default function Home() {
  const [selectedBook, setSelectedBook] = useState<TypingTypeInterface>(BOOKS[0]);
  const [typingText, setTypingText] = useState('');
  const [pageIndex, setPageIndex] = useState(0);

  const [fontSizeRem, setFontSizeRem] = useState(1.4);
  const [isBookListOpen, setIsBookListOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ✨ textareaRef -> inputRef 로 변경
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [selectedBook, pageIndex]);

  /*** 1. 데이터 계산 및 문단 자르기 로직 ***/
  const totalPages = useMemo(() => Math.ceil(selectedBook.content.length / CHARS_PER_PAGE), [selectedBook]);

  console.log(totalPages, '토탈 페이지');
  const currentPageContent = useMemo(() => {
    const start = pageIndex * CHARS_PER_PAGE;

    const result = selectedBook.content.slice(start, start + CHARS_PER_PAGE).split('.');
    console.log(result, '결과');
    let str = '';

    const arr = [];

    for (let i = 0; i < result.length; i++) {
      str += result[i] + '.\n';
      arr.push(result[i] + '.\n');
    }

    console.log(arr, '배열');

    return arr;

    // return selectedBook.content.slice(start, start + CHARS_PER_PAGE);

    // return str.slice(start, start + CHARS_PER_PAGE);
  }, [selectedBook, pageIndex]);

  console.log(currentPageContent, '현재 텍스트');
  const lines = useMemo(() => {
    const result: string[] = [];
    let currentLine = '';

    for (let i = 0; i < currentPageContent.length; i++) {
      const char = currentPageContent[i];
      if (char === '\n') {
        if (currentLine) result.push(currentLine);
        result.push('\n');
        currentLine = '';
      } else {
        currentLine += char;
        if (currentLine.length === CHARS_PER_LINE) {
          result.push(currentLine);
          currentLine = '';
        }
      }
    }
    if (currentLine) result.push(currentLine);
    return result;
  }, [currentPageContent]);

  const totalProgress = useMemo(() => {
    if (totalPages === 0) return 0;
    const currentPos = pageIndex * CHARS_PER_PAGE + typingText.length;
    return Math.min(100, (currentPos / selectedBook.content.length) * 100);
  }, [selectedBook, pageIndex, typingText, totalPages]);

  /*** 2. 완벽한 타자 제어 이벤트 핸들러 (Input용) ***/
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key.includes('Arrow')) return;

    const expectedChar = currentPageContent[typingText.length];

    // ✨ Input의 한계 극복: 정답이 줄바꿈(\n)일 경우 수동으로 추가 처리
    if (e.key === 'Enter') {
      e.preventDefault();
      if (expectedChar === '\n') {
        const newText = typingText + '\n';
        setTypingText(newText);

        // 페이지 완성 체크
        if (newText.length === currentPageContent.length) {
          setTimeout(() => moveNextPage(), 500);
        }
      }
    } else if (expectedChar === '\n') {
      // 정답이 줄바꿈(\n)인데 다른 키를 치는 것 방지 (반드시 엔터를 쳐야만 넘어가도록)
      e.preventDefault();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let newText = '';

    // ✨ Input은 \n을 공백으로 뭉개버리므로 원문을 대조하여 복원
    for (let i = 0; i < val.length; i++) {
      if (currentPageContent[i] === '\n') {
        newText += '\n';
      } else {
        newText += val[i];
      }
    }

    if (newText.length > currentPageContent.length) return;
    setTypingText(newText);

    if (newText.length === currentPageContent.length) {
      setTimeout(() => moveNextPage(), 500);
    }
  };

  const moveNextPage = () => {
    if (pageIndex + 1 < totalPages) {
      setPageIndex(pageIndex + 1);
      setTypingText('');
      if (inputRef.current) inputRef.current.focus();
    } else {
      alert('책을 마지막 장까지 모두 쓰셨습니다! 정말 고생하셨습니다. 🎉');
      setPageIndex(0);
      setTypingText('');
    }
  };

  const changeBook = (book: TypingTypeInterface) => {
    setSelectedBook(book);
    setTypingText('');
    setPageIndex(0);
  };

  /*** 3. 위아래 대칭 렌더링 헬퍼 ***/
  const renderLines = () => {
    let currentTypedIndex = 0;

    return lines.map((lineText, lineIdx) => {
      const lineLen = lineText.length;
      const typedPart = typingText.slice(currentTypedIndex, currentTypedIndex + lineLen);
      const startIndex = currentTypedIndex;
      currentTypedIndex += lineLen;

      if (lineText === '\n') {
        const isCurrent = typingText.length === startIndex;
        return (
          <div key={lineIdx} className={styles.emptyLine}>
            {isCurrent && <span className={styles.enterHint}>↵ 엔터(Enter) 키를 누르세요</span>}
          </div>
        );
      }

      return (
        <div key={lineIdx} className={styles.linePair}>
          <div className={styles.originalLine}>{lineText}</div>

          <div className={styles.typedLine}>
            {lineText.split('').map((char, charIdx) => {
              const typedChar = typedPart[charIdx];
              const isCurrent = typingText.length === startIndex + charIdx;

              return (
                <span key={charIdx} className={`${styles.char} ${isCurrent ? styles.current : ''}`}>
                  {!typedChar ? (
                    <span style={{ opacity: 0 }}>{char === ' ' ? '\u00A0' : char}</span>
                  ) : (
                    <span className={typedChar === char ? styles.correct : styles.wrong}>
                      {typedChar === ' ' ? '\u00A0' : typedChar}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const dynamicFontStyle = { fontSize: `${fontSizeRem}rem` };

  return (
    <main className={styles.container}>
      <article
        className={styles.notebook}
        onClick={() => {
          inputRef.current?.focus();
          setIsBookListOpen(false);
        }}
      >
        {/*{!isFocused && typingText.length < currentPageContent.length && (*/}
        {/*  <div className={styles.focusGuide}>노트를 한 번 누른 후 타자를 치세요</div>*/}
        {/*)}*/}

        <header className={styles.pageHeader}>
          <div className={styles.bookInfo}>
            {selectedBook.title} <span>{selectedBook.author}</span>
          </div>

          <div className={styles.controls}>
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
                  {BOOKS.map(book => (
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

            <div className={styles.zoomControls}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setFontSizeRem(p => Math.max(p - 0.2, 1.1));
                }}
                disabled={fontSizeRem <= 1.1}
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
          </div>
        </header>

        <section className={styles.typingAreaWrapper}>
          {/* ✨ textarea에서 input 태그로 교체 완료 */}
          {/*<input*/}
          {/*  type="text"*/}
          {/*  ref={inputRef}*/}
          {/*  className={styles.hiddenInput}*/}
          {/*  value={typingText}*/}
          {/*  onChange={handleTyping}*/}
          {/*  onKeyDown={handleKeyDown}*/}
          {/*  onFocus={() => setIsFocused(true)}*/}
          {/*  onBlur={() => setIsFocused(false)}*/}
          {/*  spellCheck={false}*/}
          {/*  autoFocus*/}
          {/*/>*/}

          <div className={styles.linesContainer} style={dynamicFontStyle}>
            {/*{renderLines()}*/}
            {/*{currentPageContent.map((char, index) => (*/}
            {/*  <span key={index}>{char}</span>*/}
            {/*))}*/}
          </div>
        </section>

        <footer className={styles.pageFooter}>
          <div className={styles.progressText}>전체 진행도 {Math.floor(totalProgress)}%</div>
          <div className={styles.pageIndex}>- {pageIndex + 1} 쪽 -</div>
        </footer>
      </article>
    </main>
  );
}
