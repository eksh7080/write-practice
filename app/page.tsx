/**
 * 설명: 필사하기 페이지
 * @constructor
 * **/
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from 'scss/module/typing.module.scss';
import BOOKS from 'public/novel/novel.json';
import { TypingTypeInterface } from '@/interface/typingTypeInterface';

// 한 페이지당 보여줄 글자 수
const CHARS_PER_PAGE = 300;

export default function Home() {
  const [selectedBook, setSelectedBook] = useState<TypingTypeInterface>(BOOKS[0]);
  const [typingText, setTypingText] = useState('');
  const [pageIndex, setPageIndex] = useState(0);

  // 폰트 사이즈 상태
  const [fontSizeRem, setFontSizeRem] = useState(1.5);

  // ✨ 책 목록 드롭다운 열림/닫힘 상태
  const [isBookListOpen, setIsBookListOpen] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedBook, pageIndex]);

  /*** 1. 데이터 계산 로직 ***/
  const totalPages = useMemo(() => {
    return Math.ceil(selectedBook.content.length / CHARS_PER_PAGE);
  }, [selectedBook]);

  const currentPageContent = useMemo(() => {
    const start = pageIndex * CHARS_PER_PAGE;
    const end = start + CHARS_PER_PAGE;
    return selectedBook.content.slice(start, end);
  }, [selectedBook, pageIndex]);

  const nextPageContent = useMemo(() => {
    if (pageIndex + 1 >= totalPages) return '';
    const start = (pageIndex + 1) * CHARS_PER_PAGE;
    const end = start + CHARS_PER_PAGE;
    return selectedBook.content.slice(start, end);
  }, [selectedBook, pageIndex, totalPages]);

  const totalProgress = useMemo(() => {
    if (totalPages === 0) return 0;
    const currentPos = pageIndex * CHARS_PER_PAGE + typingText.length;
    return Math.min(100, (currentPos / selectedBook.content.length) * 100);
  }, [selectedBook, pageIndex, typingText, totalPages]);

  /*** 2. 이벤트 핸들러 ***/
  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > currentPageContent.length) return;
    setTypingText(val);

    if (val.length === currentPageContent.length) {
      setTimeout(() => moveNextPage(), 500);
    }
  };

  const moveNextPage = () => {
    if (pageIndex + 1 < totalPages) {
      setPageIndex(pageIndex + 1);
      setTypingText('');
      if (textareaRef.current) textareaRef.current.focus();
    } else {
      alert('책을 마지막 장까지 모두 쓰셨습니다! 정말 고생하셨습니다. 🎉');
      setPageIndex(0);
      setTypingText('');
    }
  };

  const handleZoomIn = () => {
    setFontSizeRem(prev => Math.min(prev + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setFontSizeRem(prev => Math.max(prev - 0.2, 1.1));
  };

  // ✨ 책 변경 시 호출
  const changeBook = (book: TypingTypeInterface) => {
    setSelectedBook(book);
    setTypingText('');
    setPageIndex(0);
  };

  /*** 3. 렌더링 헬퍼 ***/
  const renderHighlightedText = () => {
    const typedElements = typingText.split('').map((char, index) => {
      const isCorrect = char === currentPageContent[index];
      return (
        <span key={`typed-${index}`} className={isCorrect ? styles.typed : styles.wrong}>
          {char}
        </span>
      );
    });

    const remainingText = currentPageContent.slice(typingText.length);
    const remainingElements = remainingText.split('').map((char, index) => {
      const actualIndex = typingText.length + index;

      if (index === 0) {
        return (
          <span key={`remain-${actualIndex}`} className={styles.current}>
            {char}
          </span>
        );
      }
      return (
        <span key={`remain-${actualIndex}`} className={styles.remain}>
          {char}
        </span>
      );
    });

    return [...typedElements, ...remainingElements];
  };

  const dynamicFontStyle = { fontSize: `${fontSizeRem}rem` };

  return (
    <main className={styles.container}>
      <div
        className={styles.bookSpread}
        onClick={() => {
          textareaRef.current?.focus();
          setIsBookListOpen(false); // 빈 공간 누르면 드롭다운 닫기
        }}
      >
        {/* =========================================
            왼쪽 페이지 (현재 필사 영역)
        ========================================= */}
        <div className={`${styles.page} ${styles.leftPage}`}>
          {!isFocused && typingText.length < currentPageContent.length && (
            <div className={styles.focusGuide}>책을 한 번 누른 후 타자를 치세요</div>
          )}

          <div className={styles.pageHeader}>
            <div className={styles.bookInfo}>
              {selectedBook.title}
              <span>{selectedBook.author}</span>
            </div>
            <div className={styles.progressText}>진행도 {Math.floor(totalProgress)}%</div>
          </div>

          <div className={styles.typingAreaWrapper}>
            <textarea
              ref={textareaRef}
              className={styles.hiddenTextarea}
              value={typingText}
              onChange={handleTyping}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              spellCheck={false}
              autoFocus
            />
            <div className={styles.textDisplay} style={dynamicFontStyle}>
              {renderHighlightedText()}
            </div>
          </div>

          <div className={styles.pageFooter} style={{ left: 0 }}>
            - {pageIndex + 1} -
          </div>
        </div>

        {/* =========================================
            오른쪽 페이지 (미리보기 및 컨트롤)
        ========================================= */}
        <div className={`${styles.page} ${styles.rightPage}`}>
          <div className={styles.pageHeader}>
            {/* ✨ 1. 책 목록 드롭다운 (좌측) */}
            <div className={styles.bookDropdown}>
              <button
                className={styles.dropdownBtn}
                onClick={e => {
                  e.stopPropagation(); // 책상 클릭 이벤트 방지
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
                        setIsBookListOpen(false); // 선택 시 드롭다운 닫기
                      }}
                    >
                      {book.title}
                      <span className={styles.dropdownAuthor}>{book.author} 지음</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ✨ 2. 글자 크기 조절 (우측) */}
            <div className={styles.zoomControls}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                disabled={fontSizeRem <= 1.1}
              >
                글자 작게
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                disabled={fontSizeRem >= 2.5}
              >
                글자 크게
              </button>
            </div>
          </div>

          <div className={styles.previewContent} style={dynamicFontStyle}>
            {nextPageContent ? nextPageContent : <div className={styles.emptyMessage}>마지막 장입니다.</div>}
          </div>

          <div className={styles.pageFooter} style={{ right: 0 }}>
            - {pageIndex + 2 <= totalPages ? pageIndex + 2 : ''} -
          </div>
        </div>
      </div>
    </main>
  );
}
