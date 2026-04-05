# 테스트 규칙

> **현재 상태**: 테스트 프레임워크 미설정. 향후 Vitest + React Testing Library 도입 예정.
> 이 파일은 도입 시 즉시 활용하기 위한 가이드라인.

## 테스트 프레임워크 (예정)
- **Vitest** (Next.js + TypeScript 환경)
- **React Testing Library** (컴포넌트 테스트)
- `vitest.config.ts` 설정 필요 시 CLAUDE.md에 명령어 추가

## 주요 테스트 대상 (write-practice)
- `calcWpm()`, `calcAccuracy()` 등 타이핑 결과 계산 유틸리티
- 소설/시 장르별 문장 분리 로직 (`.` 기준 vs `\n` 기준)
- `CHARS_PER_PAGE` 기반 페이지네이션 로직
- localStorage A/B 테스트 메트릭 수집 함수

## 테스트 구조

### 단위 테스트
```typescript
describe('calcWpm', () => {
  it('타이핑 완료 시 정확한 WPM을 계산한다', () => {
    const result = calcWpm({ chars: 350, seconds: 60 });
    expect(result).toBe(70);
  });
});
```

### 컴포넌트 테스트
- React Testing Library 사용
- 사용자 관점에서 테스트 (구현 세부사항이 아닌 동작)
- `getByRole`, `getByText` 등 접근성 기반 쿼리 우선

## 테스트 패턴
- **Arrange-Act-Assert** 구조
- 테스트 설명은 한국어로 작성
- 하나의 테스트에 하나의 검증

## 금지 사항
- 구현 세부사항 테스트 금지 (state 값 직접 확인 등)
- `getByTestId` 남용 금지
- 스냅샷 테스트 남용 금지
- `setTimeout`으로 비동기 대기 금지 → `waitFor`, `findBy` 사용
