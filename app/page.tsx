/**
 * 설명: 필사하기 페이지
 * @constructor
 * **/
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from 'scss/module/typing.module.scss';
import BOOKS from 'public/novel/novel.json';
import { TypingTypeInterface } from '@/interface/typingTypeInterface';

// 한 페이지당 보여줄 글자 수
const CHARS_PER_PAGE = 300;

export default function Home() {
  const [selectedBook, setSelectedBook] = useState<TypingTypeInterface>(BOOKS[0]);
  const [typingText, setTypingText] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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

    // 다 치면 0.3초 후 다음 페이지로 이동
    if (val.length === currentPageContent.length) {
      setTimeout(() => movePage(1), 300);
    }
  };

  const movePage = (direction: number) => {
    const newPage = pageIndex + direction;
    if (newPage >= 0 && newPage < totalPages) {
      setPageIndex(newPage);
      setTypingText('');
    } else if (newPage >= totalPages) {
      alert('책을 모두 완독하셨습니다! 🎉');
    }
  };

  const changeBook = (book: TypingTypeInterface) => {
    setSelectedBook(book);
    setTypingText('');
    setPageIndex(0);
  };

  const handleDragStart = (e: React.DragEvent, bookId: number) => {
    e.dataTransfer.setData('bookId', bookId.toString());
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const bookId = Number(e.dataTransfer.getData('bookId'));
    const book = BOOKS.find(b => b.id === bookId);
    if (book) changeBook(book);
  };

  /*** 3. 렌더링 헬퍼: 내가 입력한 텍스트 + 남은 원문 텍스트 조합 ***/
  const renderHighlightedText = () => {
    // 1. 사용자가 현재까지 입력한 텍스트 부분
    const typedElements = typingText.split('').map((char, index) => {
      // 원본 글자와 비교
      const isCorrect = char === currentPageContent[index];

      return (
        <span key={`typed-${index}`} className={isCorrect ? styles.typed : styles.wrong}>
          {char}
        </span>
      );
    });

    // 2. 아직 치지 않은 남은 원문 부분
    const remainingText = currentPageContent.slice(typingText.length);
    const remainingElements = remainingText.split('').map((char, index) => {
      const actualIndex = typingText.length + index;

      // 방금 쳐야할 커서 위치
      if (index === 0) {
        return (
          <span key={`remain-${actualIndex}`} className={styles.current}>
            {char}
          </span>
        );
      }
      // 그 외 안 친 부분
      return (
        <span key={`remain-${actualIndex}`} className={styles.remain}>
          {char}
        </span>
      );
    });

    // 두 배열을 합쳐서 하나의 텍스트 블록으로 반환
    return [...typedElements, ...remainingElements];
  };

  return (
    <main className={styles.container}>
      {/* 왼쪽 & 중앙: 메인 필사 공간 */}
      <section
        className={`${styles.workspace} ${isDraggingOver ? styles.active : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => textareaRef.current?.focus()}
      >
        <div className={styles.bookContainer}>
          {/* 상단 진행도 막대 */}
          <div className={styles.progressWrapper}>
            <div className={styles.progressBar} style={{ width: `${totalProgress}%` }} />
          </div>

          {/* 책 헤더 정보 */}
          <div className={styles.headerInfo}>
            <span className={styles.title}>{selectedBook.title}</span>
            <span className={styles.divider}>|</span>
            <span className={styles.authorInfo}>
              <span>{selectedBook.author}</span> 지음
            </span>
            {selectedBook.compiler && (
              <>
                <span className={styles.divider}>|</span>
                <span className={styles.authorInfo}>
                  <span>{selectedBook.compiler}</span> 엮음
                </span>
              </>
            )}
          </div>

          {/* 타이핑 영역 */}
          <div className={styles.typingAreaWrapper}>
            {/* 눈에 보이지 않는 입력창 */}
            <textarea
              ref={textareaRef}
              className={styles.hiddenTextarea}
              value={typingText}
              onChange={handleTyping}
              spellCheck={false}
              autoFocus
            />
            {/* 눈에 보이는 화면 */}
            <div className={styles.textDisplay}>{renderHighlightedText()}</div>
          </div>

          {/* 하단 푸터 (글자수 및 페이지네이션) */}
          <div className={styles.footer}>
            <div className={styles.pageCounter}>
              {typingText.length} / {currentPageContent.length} 자
            </div>

            <div className={styles.pagination}>
              <button onClick={() => movePage(-1)} disabled={pageIndex === 0}>
                <ChevronLeft size={18} />
              </button>
              <span>
                {pageIndex + 1} / {totalPages}
              </span>
              <button
                onClick={() => movePage(1)}
                disabled={pageIndex >= totalPages - 1 && typingText.length < currentPageContent.length}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 오른쪽: 고정된 서재 */}
      <aside className={styles.bookshelfWrapper}>
        <div className={styles.bookshelf}>
          <h3>책 목록</h3>
          {BOOKS.map(book => (
            <div
              key={book.id}
              className={styles.bookItem}
              draggable={true}
              onDragStart={e => handleDragStart(e, book.id)}
              onClick={() => changeBook(book)}
              title="드래그 앤 드롭 또는 클릭하여 필사하기"
            >
              <span>{book.title}</span>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
