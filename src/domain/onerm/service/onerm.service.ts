import { Injectable } from '@nestjs/common';

interface OnermCalculatingResult {
  oneRm: number;
  repsTable: Array<{ reps: number; weight: number }>;
}

@Injectable()
export class OnermService {
  calculating(weight: number, reps: number): OnermCalculatingResult {
    let oneRm: number;

    // 1회 반복인 경우 1RM은 입력 무게와 같습니다.
    if (reps === 1) {
      oneRm = weight;
    } else {
      // 2회 이상 반복인 경우 Epley 공식으로 1RM 계산
      oneRm = Math.round(weight * (1 + reps / 30));
    }

    const repsTable: Array<{ reps: number; weight: number }> = [];

    // 계산된 1RM을 기준으로 각 횟수별 예상 무게 계산 (Epley 공식을 역으로 적용)
    for (let r = 1; r <= 20; r++) {
      let estimatedWeight: number;
      if (r === 1) {
        estimatedWeight = oneRm; // 1회는 계산된 1RM 값
      } else {
        estimatedWeight = Math.round((oneRm / (1 + r / 30)) * 10) / 10;
      }
      repsTable.push({ reps: r, weight: estimatedWeight });
    }

    // 입력된 reps와 weight를 테이블에 포함
    const inputWeightIndex = repsTable.findIndex(item => item.reps === reps);
    if (inputWeightIndex !== -1) {
        repsTable[inputWeightIndex].weight = weight;
    } else if (reps >= 1 && reps <= 20) { // 입력된 reps가 1~20 사이인데 테이블에 없을 경우 (발생 가능성은 낮음)
         // 적절히 처리 (예: 테이블에 추가하거나 로깅)
    }

    return {
      oneRm: oneRm,
      repsTable: repsTable,
    };
  }
}
