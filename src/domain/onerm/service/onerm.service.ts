import { Injectable } from '@nestjs/common';
import { onermRequestDto, onermResponseDto, OnermSaveDto } from '../dto/onerm.dto';
import { OnermRepository } from '../repository/onerm.repository';

@Injectable()
export class OnermService {
  constructor(
    private readonly onermRepository: OnermRepository
  ) {}

  calculating(request : onermRequestDto): onermResponseDto {
    let oneRm: number;

    // 1회 반복인 경우 1RM은 입력 무게와 같습니다.
    if (request.reps === 1) {
      oneRm = request.weight;
    } else {
      // 2회 이상 반복인 경우 Epley 공식으로 1RM 계산
      oneRm = Math.round(request.weight * (1 + request.reps / 30));
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
    const inputWeightIndex = repsTable.findIndex(item => item.reps === request.reps);
    if (inputWeightIndex !== -1) {
        repsTable[inputWeightIndex].weight = request.weight;
    }

    return {
      oneRm: oneRm,
      repsTable: repsTable
    };
  }

  async save(request: OnermSaveDto) {
    return this.onermRepository.save(request);
  }
}
