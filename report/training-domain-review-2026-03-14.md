# Training 도메인 리뷰

검토 범위:
- `src/domain/training/controller/training.controller.ts`
- `src/domain/training/service/training.service.ts`
- `src/domain/training/repository/training.repository.ts`
- `src/domain/training/dto/training.dto.ts`
- `src/domain/training/dto/trainingCategories.dto.ts`
- `src/domain/training/training.module.ts`

## 발견 사항

### 1. 높음: 부모 `training`만 저장되고 이력은 실패하는 불완전 상태가 생길 수 있음
- 파일: `src/domain/training/repository/training.repository.ts:134`
- 파일: `src/domain/training/repository/training.repository.ts:141`
- `createTraining()`은 `training.create()`와 `training_history.createMany()`를 각각 별도 쿼리로 수행합니다.
- 이 상태에서 두 번째 쿼리가 실패하면 부모 `training` 레코드만 남고, 하위 이력은 저장되지 않습니다.
- 입력값 파싱과 DB 쓰기가 함께 들어가므로 실제 운영 중에도 충분히 발생 가능한 정합성 문제입니다.

### 2. 높음: 한 요청 안에서 서로 다른 사용자 데이터가 섞여 저장될 수 있음
- 파일: `src/domain/training/repository/training.repository.ts:136`
- 파일: `src/domain/training/repository/training.repository.ts:144`
- 부모 `training.user_seq`는 `param.param[0].userSeq` 하나만 사용합니다.
- 반면 각 `training_history`는 각 아이템의 `item.userSeq`를 그대로 사용합니다.
- 즉 요청 배열에 다른 `userSeq`가 섞여 있으면 부모는 A 사용자, 자식 일부는 B 사용자로 저장될 수 있습니다.
- 최소한 모든 항목의 `userSeq`가 같은지 검증해야 하고, 더 안전하게는 요청 바디가 아니라 인증 정보에서 사용자 식별자를 가져와야 합니다.

### 3. 중간: `POST /create`가 생성 결과를 버리고 항상 `0`만 반환함
- 파일: `src/domain/training/service/training.service.ts:25`
- 파일: `src/domain/training/controller/training.controller.ts:36`
- repository는 생성된 `training`을 반환하지만, service는 이를 무시하고 `0`을 반환합니다.
- controller도 service 결과를 사용하지 않고 다시 `0`을 반환합니다.
- 이 때문에 클라이언트는 무엇이 생성되었는지 알 수 없고, 다른 API에서 쓰는 `success(...)` 응답 패턴과도 맞지 않습니다.
>>  결과값 반환 셋팅 

### 4. 중간: `getLatestHistory`라는 이름과 실제 동작이 맞지 않음
- 파일: `src/domain/training/controller/training.controller.ts:14`
- 파일: `src/domain/training/service/training.service.ts:12`
- 파일: `src/domain/training/repository/training.repository.ts:9`
- 엔드포인트 이름만 보면 최신 이력 1건을 반환할 것 같지만, 실제로는 사용자 전체 training 목록을 내림차순으로 반환합니다.
- repository에는 이미 `getLatestTrainingWithHistory()`가 구현돼 있지만 현재 호출되지 않고 있습니다.
- API 이름과 실제 응답 형태가 다르면 프론트엔드에서 잘못된 가정을 하게 될 가능성이 큽니다.

### 5. 중간: `rest`는 문자열로 받지만 조회 시에는 `Date` 형태로 그대로 노출됨
- 파일: `src/domain/training/repository/training.repository.ts:83`
- 파일: `src/domain/training/repository/training.repository.ts:150`
- 파일: `src/domain/training/dto/training.dto.ts:13`
- 입력 DTO에서는 `rest`를 문자열로 정의하고 있습니다.
- 하지만 저장 후 조회할 때는 `@db.Time()` 컬럼 값을 `history.rest` 그대로 내보내고 있어, 일반적으로 `HH:mm:ss` 문자열이 아니라 날짜가 포함된 `Date` 직렬화 값으로 내려갈 가능성이 높습니다.
- 요청 형식과 응답 형식이 일치하지 않아 화면 쪽에서 파싱 오류가 발생할 수 있습니다.

### 6. 낮음: Swagger 설명 문자열이 깨져 있음
- 파일: `src/domain/training/dto/trainingCategories.dto.ts:6`
- `@ApiProperty.description` 값이 인코딩 깨짐 상태로 들어가 있어 Swagger 문서에서 정상적으로 보이지 않습니다.
- 런타임 기능을 깨지는 않지만, API 문서 품질은 확실히 떨어집니다.

## 남아 있는 리스크
- training 도메인 전용 자동화 테스트를 찾지 못했습니다. 현재 동작은 회귀를 막아줄 안전망이 거의 없는 상태입니다.
- 이번 검토에서는 TypeScript 타입체크만 수행했고, 실제 DB를 연결한 통합 테스트는 실행하지 않았습니다.

## 수정 우선순위 제안
1. `training` 생성과 `training_history` 생성을 하나의 Prisma 트랜잭션으로 묶기
2. 요청 배열 내 `userSeq` 일관성 검증 추가 또는 인증 컨텍스트 기반으로 사용자 식별자 고정
3. `POST /create` 응답을 실제 생성 결과 기반으로 반환하고 기존 응답 형식과 맞추기
4. `getLatestHistory`가 이름대로 동작하도록 service 호출 대상을 `getLatestTrainingWithHistory()` 쪽으로 정리하기
5. 조회 시 `rest`를 화면에서 기대하는 문자열 형식으로 정규화해서 반환하기
