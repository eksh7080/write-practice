'use client'; // 상태 관리와 이벤트 핸들링을 위해 클라이언트 컴포넌트 선언

import { useState } from 'react';
import styles from 'scss/module/typing.module.scss';
import { BookOpen } from 'lucide-react';

// src/data/books.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  content: string; // 실제 필사할 내용
  color: string; // 책 표지 색상
}

const BOOKS: Book[] = [
  {
    id: 1,
    title: '별 헤는 밤',
    author: '윤동주',
    content:
      '계절이 지나가는 하늘에는 가을로 가득 차 있습니다.\n나는 아무 걱정도 없이 가을 속의 별들을 다 헤일 듯합니다.',
    color: '#e74c3c', // Red
  },
  {
    id: 2,
    title: '소나기',
    author: '황순원',
    content:
      '소년은 개울가에서 소녀를 보자 곧 윤 초시네 증손녀딸이라는 걸 알 수 있었다.\n소녀는 개울에다 손을 잠그고 물장난을 하고 있는 것이다.',
    color: '#3498db', // Blue
  },
  {
    id: 3,
    title: '나의 라임 오렌지나무',
    author: 'J. M. 바스콘셀로스',
    content: '누구나 잊지 못할 추억이 있다. 그것은 마치 오래된 앨범을 넘기는 것과 같다.',
    color: '#f1c40f', // Yellow
  },
];

export default function TypingPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [typingText, setTypingText] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // 드래그 시작: 책 ID 저장
  const handleDragStart = (e: React.DragEvent, bookId: number) => {
    e.dataTransfer.setData('bookId', bookId.toString());
  };

  // 드래그 중인 아이템이 드롭존 위에 있을 때
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // 필수: 드롭 허용
    setIsDraggingOver(true);
  };

  // 드래그가 드롭존을 벗어났을 때
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  // 드롭: 책 데이터 로드
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const bookId = Number(e.dataTransfer.getData('bookId'));
    const book = BOOKS.find(b => b.id === bookId);

    if (book) {
      changeBook(book);
    }
  };

  // 책 변경 함수 (클릭 및 드롭 공용)
  const changeBook = (book: Book) => {
    setSelectedBook(book);
    setTypingText(''); // 입력창 초기화
  };

  return (
    <div className={styles.container}>
      {/* 중앙: 작업 영역 (드롭존) */}
      <section
        className={`${styles.workspace} ${isDraggingOver ? styles.active : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedBook ? (
          <div className={styles.desk}>
            {/* 왼쪽: 필사 입력 영역 */}
            <div className={styles.typingArea}>
              <h3>필사 노트</h3>
              <textarea
                placeholder="오른쪽의 글을 보며 천천히 따라 써보세요..."
                value={typingText}
                onChange={e => setTypingText(e.target.value)}
                autoFocus
              />
            </div>

            {/* 오른쪽: 책 뷰어 영역 */}
            <div className={styles.bookViewer}>
              <h2>{selectedBook.title}</h2>
              <p className={styles.author}>{selectedBook.author}</p>
              <div className={styles.content}>{selectedBook.content}</div>
            </div>
          </div>
        ) : (
          /* 책 선택 전 안내 화면 */
          <div className={styles.placeholder}>
            <div className={styles.dropZoneHint}>
              <BookOpen size={48} color="#ccc" />
              <p>
                오른쪽 서재에서 책을 꺼내
                <br />
                이곳으로 드래그하거나 클릭하세요.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 오른쪽: 서재 (책 리스트) */}
      <aside className={styles.bookshelf}>
        <h3>MY LIBRARY</h3>
        {BOOKS.map(book => (
          <div
            key={book.id}
            className={styles.bookItem}
            style={{ backgroundColor: book.color }}
            draggable
            onDragStart={e => handleDragStart(e, book.id)}
            onClick={() => changeBook(book)} // 클릭으로도 선택 가능하게 UX 보완
          >
            {book.title}
          </div>
        ))}
      </aside>
    </div>
  );
}
