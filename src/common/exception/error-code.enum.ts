import { HttpStatus } from '@nestjs/common';

export class ErrorResponse {
  constructor(
    public readonly status: HttpStatus,
    public readonly message: string,
  ) {}
}

export const ErrorCode = {
  // 공통
  UNREADABLE_REQUEST_PAYLOAD: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    '요청 데이터 파싱을 실패하였습니다.',
  ),
  JSON_PROCESSING_EXCEPTION: new ErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'ObjectMapper 변환 도중 에러가 발생했습니다.',
  ),

  // 인증, 인가
  UNAUTHORIZED: new ErrorResponse(
    HttpStatus.UNAUTHORIZED,
    '로그인이 필요합니다.',
  ),
  INVALID_OAUTH_CODE: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    '유효하지 않은 OAUTH_CODE 입니다.',
  ),
  ACCESS_DENIED: new ErrorResponse(
    HttpStatus.FORBIDDEN,
    '권한이 없습니다.',
  ),
  MISSING_ACCESS_TOKEN: new ErrorResponse(
    HttpStatus.UNAUTHORIZED,
    'Access Token이 존재하지 않습니다.',
  ),

  // 유저
  USER_NOT_FOUND: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    '존재하지 않는 사용자입니다.',
  ),
  USER_ALREADY_EXISTS: new ErrorResponse(
    HttpStatus.CONFLICT,
    '이미 존재하는 사용자입니다.',
  ),
  INVALID_USER_DATA: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    '유효하지 않은 사용자 데이터입니다.',
  ),

  // 운동 기록
  WORKOUT_NOT_FOUND: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    '존재하지 않는 운동 기록입니다.',
  ),
  WORKOUT_ACCESS_DENIED: new ErrorResponse(
    HttpStatus.FORBIDDEN,
    '운동 기록에 대한 접근 권한이 없습니다.',
  ),
  INVALID_WORKOUT_DATA: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    '유효하지 않은 운동 기록 데이터입니다.',
  ),

  // 운동 종목
  EXERCISE_NOT_FOUND: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    '존재하지 않는 운동 종목입니다.',
  ),
  EXERCISE_ALREADY_EXISTS: new ErrorResponse(
    HttpStatus.CONFLICT,
    '이미 존재하는 운동 종목입니다.',
  ),
  INVALID_EXERCISE_DATA: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    '유효하지 않은 운동 종목 데이터입니다.',
  ),

  // 1RM 계산
  INVALID_1RM_CALCULATION: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    '유효하지 않은 1RM 계산 데이터입니다.',
  ),
  INVALID_WEIGHT_DATA: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    '유효하지 않은 무게 데이터입니다.',
  ),
  INVALID_REPS_DATA: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    '유효하지 않은 반복 횟수 데이터입니다.',
  ),

  // 데이터베이스
  DATABASE_ERROR: new ErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    '데이터베이스 오류가 발생했습니다.',
  ),
  TRANSACTION_FAILED: new ErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    '트랜잭션 처리 중 오류가 발생했습니다.',
  ),

  // 외부 서비스
  EXTERNAL_SERVICE_ERROR: new ErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    '외부 서비스 호출 중 오류가 발생했습니다.',
  ),
  API_CALL_FAILED: new ErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'API 호출에 실패했습니다.',
  ),

  //  내부 시스템용 에러
  JWT_PRIVATE_KEY_FAILED: new ErrorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      '환경변수 미설정 (JWT_PRIVATE_KEY)'
  ),

  JWT_PUBLIC_KEY_FAILED: new ErrorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      '환경변수 미설정 (JWT_PUBLIC_KEY)'
  )

} as const;

export type ErrorCodeType = keyof typeof ErrorCode; 