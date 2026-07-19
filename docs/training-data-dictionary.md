# 트레이닝 도메인 데이터 사전

- 작성일: 2026-07-19
- 관련 설계: [트레이닝 프로그램 및 운동 기록 설계](./training-program-design.md)
- 기준 스키마: `prisma/schema.prisma`

## 공통 규칙

- 모든 `seq`는 내부 식별용 자동 증가 PK다.
- `*_seq`는 대상 테이블의 `seq`를 참조하는 FK다.
- `week_order`, `day_order`, `exercise_order`, `set_order`는 모두 1부터 시작한다.
- 시간의 길이는 `*_seconds`, 발생 시각은 `*_at` 또는 `training_date`로 표현한다.
- Prisma의 `///` 주석은 애플리케이션 개발 문서이며 MySQL의 물리 테이블/컬럼 COMMENT와는 별개다.

## `training_category`

운동 종목의 정규 코드와 사용자 표시명, 대표 분류를 관리하는 마스터 테이블이다.

| 필드 | 설명 |
| --- | --- |
| `seq` | 운동 종목 PK |
| `training_name` | 변경되지 않는 정규 코드. 예: `BENCH_PRESS` |
| `training_display_name` | 사용자에게 표시할 종목명 |
| `training_type` | 프리웨이트, 머신 등 기구 유형 |
| `target_category` | 상체, 하체 등 상위 부위 분류 |
| `target_muscle` | 대표 타깃 근육 |

`training_name`은 중복 데이터 정리 후 유일 제약을 적용한다. 여러 타깃 근육을 지원할 때는 별도 연결 테이블로 분리한다.

## `training_program`

사용자에게 제공하는 정규 운동 프로그램을 버전별로 저장한다. 배포된 프로그램은 직접 수정하지 않고 새 버전을 추가하는 것을 원칙으로 한다.

| 필드 | 설명 |
| --- | --- |
| `seq` | 프로그램 버전 PK |
| `code` | 버전 간 공유하는 프로그램 정규 코드 |
| `name` | 사용자에게 표시할 프로그램명 |
| `description` | 프로그램 목적, 대상 및 수행 방법 |
| `version` | 같은 `code` 안에서 증가하는 버전 번호 |
| `is_active` | 신규 사용자가 선택할 수 있는 버전인지 여부 |
| `created_at` | 생성 시각 |
| `updated_at` | 마지막 수정 시각 |

`(code, version)` 조합은 유일하다.

## `training_program_day`

프로그램의 특정 주차와 일차에 수행할 한 번의 목표 회차를 정의한다.

| 필드 | 설명 |
| --- | --- |
| `seq` | 프로그램 회차 PK |
| `program_seq` | 상위 프로그램 버전 FK |
| `week_order` | 1부터 시작하는 주차 순번 |
| `day_order` | 해당 주차 안에서 1부터 시작하는 일차 순번 |
| `name` | 회차 표시명. 예: `1주차 A` |

`(program_seq, week_order, day_order)` 조합은 유일하다. 프로그램 버전이 삭제되면 하위 회차와 운동 구성도 함께 삭제된다.

## `training_program_exercise`

프로그램 회차에 포함되는 운동 종목과 목표 세트 조건을 정의한다.

| 필드 | 설명 |
| --- | --- |
| `seq` | 프로그램 운동 구성 PK |
| `program_day_seq` | 상위 프로그램 회차 FK |
| `training_category_seq` | 목표 운동 종목 FK |
| `exercise_order` | 회차 내 운동 표시 및 수행 순서 |
| `target_sets` | 목표 세트 수 |
| `target_reps_min` | 세트당 목표 반복 횟수 최솟값 |
| `target_reps_max` | 세트당 목표 반복 횟수 최댓값 |
| `rest_seconds` | 세트 사이 목표 휴식 시간(초) |
| `target_weight_rate` | 1RM 대비 목표 중량 백분율. `75.00`은 75% |

`(program_day_seq, exercise_order)` 조합은 유일하다. `target_sets`와 반복 수는 1 이상이어야 하며 최소 반복 수는 최대 반복 수보다 클 수 없다.

## `user_training_program`

사용자가 선택한 프로그램 버전과 현재 진행 위치 및 상태를 관리한다.

| 필드 | 설명 |
| --- | --- |
| `seq` | 사용자 프로그램 진행 정보 PK |
| `user_seq` | 프로그램 수행 사용자 FK |
| `program_seq` | 사용자가 시작한 프로그램 버전 FK |
| `status` | `ACTIVE`, `PAUSED`, `COMPLETED`, `CANCELLED` |
| `current_week` | 현재 수행할 주차 |
| `current_day` | 현재 주차에서 수행할 일차 |
| `completed_sessions` | 완료 처리된 프로그램 운동 세션 수 |
| `started_at` | 프로그램 시작 시각 |
| `completed_at` | 완료 또는 종료 시각. 진행 중이면 `null` |

동시에 허용할 활성 프로그램 수와 진행 위치 변경은 서비스 트랜잭션에서 검증한다.

## `training`

사용자가 실제로 수행한 한 번의 운동 세션이다. 자유 운동과 프로그램 운동을 같은 테이블에 저장한다.

| 필드 | 설명 |
| --- | --- |
| `seq` | 운동 세션 PK |
| `user_seq` | 운동 수행 사용자 FK |
| `mode` | `FREE` 또는 `PROGRAM` |
| `user_program_seq` | 프로그램 운동의 사용자 진행 정보 FK |
| `program_day_seq` | 실제로 수행한 프로그램 회차 FK |
| `training_date` | 실제 운동 수행 시각 |

`FREE`이면 프로그램 참조 두 개가 모두 `null`이어야 한다. `PROGRAM`이면 두 참조가 모두 존재하고 같은 프로그램 버전을 가리켜야 한다.

## `training_history`

운동 세션에서 실제로 수행한 한 세트를 저장한다. 프로그램의 목표값이 아니라 사용자의 실제 결과다.

| 필드 | 설명 |
| --- | --- |
| `seq` | 수행 세트 PK |
| `training_seq` | 상위 운동 세션 FK |
| `user_seq` | 레거시 사용자 FK. 최종 단계에서 제거 |
| `training_category_seq` | 정규 운동 종목 FK. 백필 전까지 nullable |
| `name` | 수행 당시 운동 종목명 스냅샷 |
| `weight` | 실제 수행 중량 |
| `weight_unit` | 중량 단위. 예: `kg`, `lb` |
| `reps` | 실제 반복 횟수. 최종적으로 `Int`로 변경 |
| `sets` | 레거시 세트 순번. 백필 후 제거 |
| `rest` | 레거시 휴식 시간. 백필 후 제거 |
| `set_order` | 1부터 시작하는 세트 순번 |
| `rest_seconds` | 세트 수행 후 휴식 시간(초) |

운동 세션 삭제 시 소속 세트는 함께 삭제한다. 종목 마스터가 삭제되어도 과거 이력의 `name` 스냅샷은 유지한다.
