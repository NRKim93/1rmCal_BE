# 트레이닝 프로그램 및 운동 기록 설계 메모

- 작성일: 2026-07-19
- 상태: 1차 설계 반영
- 관련 프런트엔드 문서: `../../frontend/docs/training-program-ui.md`
- 테이블 및 필드 정의: [트레이닝 도메인 데이터 사전](./training-data-dictionary.md)

## 목적

현재 운동 기록 구조를 정리하고, 자유 운동과 정규 운동 프로그램을 하나의 실행 이력으로 관리하기 위한 백엔드 설계를 기록한다. Prisma 모델은 단계적 마이그레이션이 가능하도록 기존 필드를 유지한 채 1차 반영한다.

## 결정 사항

- `training`은 자유 운동 전용 테이블이 아니라 실제로 수행한 모든 운동 세션이다.
- 자유 운동은 `training.mode = FREE`, 프로그램 운동은 `training.mode = PROGRAM`으로 구분한다.
- 정규 프로그램의 이름과 설명은 `training_program`에 저장한다.
- 프로그램에 필요한 회차와 운동 구성은 `training_program_day`, `training_program_exercise`에 저장한다.
- 사용자의 프로그램 진행 상태는 `user_training_program`에서 관리한다.
- 프로그램 목표와 실제 수행 결과는 분리한다. 프로그램 운동도 실제 중량·반복 수는 `training_history`에 기록한다.

## 현재 동작

### 저장

`POST /api/v1/training/create`는 한 번의 운동 완료 요청을 다음과 같이 저장한다.

1. `training`에 사용자와 운동 시각을 저장한다.
2. 요청받은 각 세트를 `training_history`에 일괄 저장한다.
3. 프런트엔드는 `sets`에 `index + 1`을 전달한다. 현재 `sets`는 세트 개수가 아니라 세트 순번으로 사용된다.

### 조회

`GET /api/v1/training/getLatestHistory?seq={userSeq}`는 해당 사용자의 `training`을 날짜 역순으로 모두 반환한다.

현재 쿼리에는 다음 조건이 없다.

- 자유 운동과 프로그램 운동 구분
- 특정 프로그램 구분
- 진행 중인 프로그램 여부
- 조회 개수 제한

따라서 프런트엔드의 프로그램 카드 슬라이드에도 자유 운동 기록이 노출된다.

## 현재 모델의 의미

| 모델 | 현재 역할 |
| --- | --- |
| `training_category` | 스쿼트, 벤치프레스 같은 운동 종목 마스터 |
| `training` | 사용자가 완료한 한 번의 운동 세션 |
| `training_history` | 운동 세션에 포함된 세트 단위 수행 기록 |

`training`이라는 이름은 프로그램 정의처럼 읽힐 수 있지만 실제 역할은 완료된 운동 세션이다. 애플리케이션 코드에서는 장기적으로 `TrainingSession`이라는 도메인 명칭을 사용하고, 실제 테이블명은 호환성을 위해 `training`으로 유지할 수 있다.

## `training_history` 검토 사항

### 1. 종목 연결

현재는 `name` 문자열만 저장하여 `training_category`와 참조 무결성이 없다.

1차 반영:

- nullable `training_category_seq` 외래 키 추가
- 기존 `name`은 수행 당시 종목명 스냅샷으로 유지
- 데이터 백필 후 신규 요청에서는 종목 키를 필수로 받도록 변경

### 2. 세트 순번

현재 `sets Decimal`은 실제로 세트 순번이다.

1차 반영:

- nullable `set_order Int`를 병행 추가
- 백필 및 API 전환이 끝날 때까지 기존 `sets` 유지
- 최종 단계에서 `sets` 제거

### 3. 수치 타입

현재 `reps`, `sets`가 `Decimal`이지만 반복 횟수와 세트 순번은 정수다.

최종 목표:

- `weight Decimal(7, 2)`
- `reps Int`
- `set_order Int`

### 4. 휴식 시간

현재 휴식 시간을 `DateTime @db.Time()`으로 저장하고, 애플리케이션에서 1970년 날짜가 포함된 `Date`로 변환한다.

1차 반영:

- nullable `rest_seconds Int`를 병행 추가
- API에서는 초 단위 정수를 기본 계약으로 사용
- 화면에서만 `mm:ss`로 변환
- 백필 및 API 전환 후 기존 `rest` 제거

### 5. 사용자 중복 참조

`training_history.user_seq`는 상위 `training.user_seq`로부터 알 수 있다. 두 값이 달라질 수 있어 불일치 위험이 있다.

변경 후보:

- `training_history.user_seq` 제거
- 조회 성능을 위해 유지한다면 복합 제약 또는 애플리케이션 검증 필요

### 6. 인덱스와 삭제 정책

검토할 인덱스:

- `training(user_seq, training_date)`
- `training(mode, user_program_seq, training_date)`
- `training_history(training_seq, set_order)`
- `training_history(training_category_seq)`

운동 세션 삭제 시 세트 기록 처리 방식도 `onDelete: Cascade` 또는 소프트 삭제 정책 중 하나로 확정해야 한다.

## 프로그램 모델

프로그램 정의와 실제 수행 기록을 분리하는 방향을 권장한다.

```text
training_program                     정규 프로그램 정의와 버전
  -> training_program_day            주차별/일차별 수행 회차
      -> training_program_exercise   회차별 운동 목표

user_training_program                사용자별 시작일, 상태, 현재 주차/일차

training                             실제 수행 세션
  -> FREE 또는 PROGRAM
  -> PROGRAM이면 user_training_program/program_day 참조

training_history                     실제 수행 세트
```

권장 핵심 필드:

### `training`

- `mode`: `FREE | PROGRAM`
- `user_program_seq`: 프로그램 운동일 때 사용자 프로그램 참조
- `program_day_seq`: 실제 수행한 프로그램 회차 참조
- `training_date`: 실제 수행 시각

### `user_training_program`

- `user_seq`
- `program_seq`
- `status`: `ACTIVE | PAUSED | COMPLETED`
- `current_week`
- `current_day`
- `completed_sessions`
- 전체 세션 수는 프로그램 회차 개수로 계산하며 중복 저장하지 않는다.

### `training_program_exercise`

- `exercise_order`: 회차 내 표시 및 수행 순서
- `target_sets`: 목표 세트 수
- `target_reps_min`, `target_reps_max`: 목표 반복 범위
- `rest_seconds`: 목표 휴식 시간
- `target_weight_rate`: 1RM 대비 목표 비율 등 선택적 중량 기준

준비 세트, 탑 세트, 백오프 세트처럼 한 종목 안에서 세트별 목표가 달라져야 한다면 `training_program_exercise_set`을 추가한다. 현재 범위에서는 동일한 목표의 반복으로 보고 별도 모델을 만들지 않는다.

프로그램 템플릿이 수정되어도 과거 수행 기록이 바뀌지 않도록, 수행 시점의 종목명·목표 중량·목표 반복 수는 스냅샷으로 남기는 방안도 필요하다.

프로그램은 배포된 버전을 직접 수정하기보다 새 `version`의 행을 생성하는 것을 기본 정책으로 한다. 진행 중인 사용자는 시작할 때 연결된 버전을 계속 사용한다.
프로그램 식별자는 `(code, version)` 조합으로 유일하며, 같은 `code`로 새 버전을 등록할 수 있다.

## 데이터 무결성 규칙

Prisma 스키마만으로 표현하기 어려운 다음 규칙은 서비스 계층에서 검증한다.

- `FREE` 세션은 `user_program_seq`, `program_day_seq`가 모두 `null`이어야 한다.
- `PROGRAM` 세션은 두 참조가 모두 존재해야 한다.
- `program_day_seq`는 `user_program_seq`가 가리키는 프로그램에 포함되어야 한다.
- 목표 세트와 반복 수는 1 이상이고, `target_reps_min <= target_reps_max`여야 한다.
- 한 사용자에게 동시에 허용할 `ACTIVE` 프로그램 개수는 정책 확정 후 트랜잭션에서 제한한다.

## API 분리 제안

현재 `getLatestHistory` 하나로 프로그램 카드와 운동 이력을 모두 처리하지 않는다.

```text
GET  /api/v1/training-programs/active
GET  /api/v1/training-programs/:userProgramSeq/next-session
POST /api/v1/training-sessions/free
POST /api/v1/training-sessions/program
GET  /api/v1/training-sessions/history
```

프로그램 카드 API는 프로그램명, 진행률, 현재 회차, 다음 운동 종목을 한 번에 반환해야 한다. 진행률은 프런트엔드가 날짜나 기록 개수로 추정하지 않고 백엔드가 계산한다.

## 프로그램 등록 API

`POST /api/v1/training-programs`는 프로그램 기본정보와 전체 회차 및 운동 구성을 하나의 트랜잭션으로 등록한다.

```json
{
  "code": "STRONG_LIFTS_5X5",
  "name": "스트롱리프트 5x5",
  "description": "전신 근력 향상을 위한 프로그램",
  "version": 1,
  "isActive": true,
  "weeks": [
    {
      "weekOrder": 1,
      "days": [
        {
          "dayOrder": 1,
          "name": "Workout A",
          "exercises": [
            {
              "trainingCategorySeq": 1,
              "exerciseOrder": 1,
              "targetSets": 5,
              "targetRepsMin": 5,
              "targetRepsMax": 5,
              "restSeconds": 180,
              "targetWeightRate": 75
            }
          ]
        }
      ]
    }
  ]
}
```

등록 규칙:

- `code`는 영문 대문자, 숫자, 밑줄만 허용하며 요청 시 대문자로 정규화한다.
- `version`, 모든 순번, 목표 세트 및 반복 수는 1 이상이다.
- 동일 프로그램 안에서 `weekOrder`는 중복될 수 없다.
- 동일 주차 안에서 `dayOrder`는 중복될 수 없다.
- 동일 회차 안에서 `exerciseOrder`와 `trainingCategorySeq`는 중복될 수 없다.
- `targetRepsMin`은 `targetRepsMax`보다 클 수 없다.
- `targetWeightRate`는 0~100 사이의 1RM 대비 백분율이다.
- 참조한 `trainingCategorySeq`가 하나라도 없으면 전체 요청을 저장하지 않는다.
- 같은 `(code, version)`이 이미 존재하면 `409 Conflict`를 반환한다.

성공 시 `201 Created`와 함께 생성된 프로그램, 회차, 운동 구성을 camelCase로 반환한다.

## 단계별 변경 순서

1. 프로그램 정의 및 사용자 진행 모델과 `training.mode`를 추가한다.
2. `training_category.training_name` 중복 여부를 확인하고 정리한 뒤 유일 제약을 적용한다.
3. 기존 `training` 데이터는 `FREE`로 백필한다. 기본값도 `FREE`로 유지한다.
4. `training_history`에 nullable 종목 키, 세트 순번, 휴식 초 필드를 추가한다.
5. API를 신규 필드 쓰기로 전환하면서 기존 행을 백필한다.
6. 프로그램 운동 생성 시 프로그램과 회차 참조를 저장한다.
7. 프로그램 카드 전용 조회 API를 추가한다.
8. 모든 데이터와 클라이언트 전환 후 `training_history.user_seq`, `sets`, `rest`를 제거하고 `reps`를 `Int`로 변경한다.
9. 기존 `getLatestHistory`는 운동 이력 용도로 이름과 응답 계약을 정리한다.

## 결정이 필요한 항목

- 한 사용자가 동시에 여러 활성 프로그램을 가질 수 있는가
- 프로그램 진행률을 세션 수, 주차, 완료 세트 중 무엇으로 계산할 것인가
- 프로그램을 건너뛰거나 같은 회차를 반복할 수 있는가
- 자유 운동을 프로그램 회차로 사후 편입할 수 있는가

## 이번 작업 범위

- 설계 결정 및 단계별 마이그레이션 전략 문서화
- Prisma에 프로그램 정의, 회차, 운동 구성, 사용자 진행 모델 추가
- `training`에 실행 모드와 프로그램 참조 추가
- `training_history`에 전환용 nullable 필드와 인덱스 추가

실제 DB 마이그레이션 생성, 기존 데이터 백필, API 계약 변경은 별도 작업으로 진행한다.
