/**
 * 설명: 필사하기 페이지
 * @constructor
 * **/
'use client';
import React, { useState, useMemo, useRef } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import styles from 'scss/module/typing.module.scss';
import BOOKS from 'public/novel/novel.json';
import { TypingTypeInterface } from '@/interface/typingTypeInterface';
// 한 페이지당 보여줄 글자 수
const CHARS_PER_PAGE = 300;
const TypingPage = () => {
  const [selectedBook, setSelectedBook] = useState<TypingTypeInterface | null>(null);
  const [typingText, setTypingText] = useState('');
  const [pageIndex, setPageIndex] = useState(0);

  // UI 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /*** 1. 데이터 계산 로직 ***/

  // 전체 페이지 수 계산
  const totalPages = useMemo(() => {
    if (!selectedBook) return 0;
    return Math.ceil(selectedBook.content.length / CHARS_PER_PAGE);
  }, [selectedBook]);

  // 현재 페이지의 텍스트 슬라이싱
  const currentPageContent = useMemo(() => {
    if (!selectedBook) return '';
    const start = pageIndex * CHARS_PER_PAGE;
    const end = start + CHARS_PER_PAGE;
    return selectedBook.content.slice(start, end);
  }, [selectedBook, pageIndex]);

  // 전체 진행률 (%) - (이전 페이지까지 글자 수 + 현재 입력 글자 수)
  const totalProgress = useMemo(() => {
    if (!selectedBook || totalPages === 0) return 0;

    const currentPos = pageIndex * CHARS_PER_PAGE + typingText.length;
    return Math.min(100, (currentPos / selectedBook.content.length) * 100);
  }, [selectedBook, pageIndex, typingText, totalPages]);

  // 현재 페이지 정확도 (%)
  const accuracy = useMemo(() => {
    if (typingText.length === 0) return 100;
    let correctCount = 0;
    const minLength = Math.min(typingText.length, currentPageContent.length);
    for (let i = 0; i < minLength; i++) {
      if (typingText[i] === currentPageContent[i]) correctCount++;
    }
    return Math.floor((correctCount / typingText.length) * 100);
  }, [typingText, currentPageContent]);

  /*** 2. 이벤트 핸들러 ***/

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    // 페이지 글자 수 초과 입력 방지
    if (val.length > currentPageContent.length) return;
    setTypingText(val);

    // 페이지 끝까지 쳤을 때 (자동 넘김 0.3초 딜레이)
    if (val.length === currentPageContent.length) {
      setTimeout(() => movePage(1), 300);
    }
  };

  // 페이지 이동 (이전/다음)
  const movePage = (direction: number) => {
    const newPage = pageIndex + direction;
    if (newPage >= 0 && newPage < totalPages) {
      setPageIndex(newPage);
      setTypingText(''); // 페이지 변경 시 입력창 초기화
      if (textareaRef.current) textareaRef.current.focus();
    } else if (newPage >= totalPages) {
      alert('책을 모두 완독하셨습니다! 👏');
    }
  };

  // 책 변경
  const changeBook = (book: TypingTypeInterface) => {
    setSelectedBook(book);
    setTypingText('');
    setPageIndex(0);
  };

  // 드래그 앤 드롭
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

  /*** 3. 렌더링 헬퍼 (실시간 하이라이팅) ***/
  const renderHighlightedText = () => {
    return currentPageContent.split('').map((char, index) => {
      let className = styles.remain;
      if (index < typingText.length) {
        className = typingText[index] === char ? styles.correct : styles.wrong;
      } else if (index === typingText.length) {
        className = styles.current;
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className={styles.container}>
      {/* 왼쪽: 작업 공간 */}
      <section
        className={`${styles.workspace} ${isDraggingOver ? styles.active : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
      >
        {selectedBook ? (
          <div className={styles.desk}>
            {/* 상단 상태바 */}
            <div className={styles.statusBar}>
              <div className={styles.statusInfo}>
                <span>
                  정확도 <strong>{accuracy}%</strong>
                </span>
              </div>

              {/* 페이지 네비게이션 */}
              <div className={styles.pagination}>
                <button onClick={() => movePage(-1)} disabled={pageIndex === 0} title="이전 페이지">
                  <ChevronLeft size={18} />
                </button>
                <span>
                  {pageIndex + 1} / {totalPages}
                </span>
                <button
                  onClick={() => movePage(1)}
                  disabled={pageIndex >= totalPages - 1 && typingText.length < currentPageContent.length}
                  title="다음 페이지 (내용을 다 채워야 활성화됩니다)"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* 전체 진행률 */}
              <div className={styles.totalProgressWrapper}>
                <span className={styles.label}>전체 진행률</span>
                <div className={styles.progressTrack}>
                  <div className={styles.progressBar} style={{ width: `${totalProgress}%` }} />
                </div>
                <span className={styles.label}>{Math.floor(totalProgress)}%</span>
              </div>
            </div>

            <div className={styles.contentArea}>
              {/* 입력창 */}
              <div className={styles.typingArea}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3>필사 노트</h3>
                  <button
                    onClick={() => setTypingText('')}
                    title="현재 페이지 다시 쓰기"
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888' }}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <textarea
                  ref={textareaRef}
                  value={typingText}
                  onChange={handleTyping}
                  placeholder="오른쪽 글을 보며 차분히 입력하세요..."
                  spellCheck={false}
                />
              </div>

              {/* 책 뷰어 */}
              <div className={styles.bookViewer}>
                <h2>{selectedBook.title}</h2>
                <div className={styles.content}>{renderHighlightedText()}</div>
                {/* 페이지 내 글자수 카운터 */}
                <div className={styles.pageCounter}>
                  {typingText.length} / {currentPageContent.length} 자
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.dropZoneHint}>
              <BookOpen size={48} color="#555" />
              <p>서재에서 책을 꺼내오세요.</p>
            </div>
          </div>
        )}
      </section>

      {/* 오른쪽: 슬라이딩 서재 */}
      <aside className={`${styles.bookshelfWrapper} ${!isSidebarOpen ? styles.closed : ''}`}>
        <button className={styles.toggleBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <ChevronRight />
        </button>

        <div className={styles.bookshelf}>
          <h3>MY LIBRARY</h3>
          {BOOKS.map(book => (
            <div
              key={book.id}
              className={styles.bookItem}
              draggable
              onDragStart={e => handleDragStart(e, book.id)}
              onClick={() => changeBook(book)}
              title={book.title}
            >
              <span>{book.title}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default TypingPage;
