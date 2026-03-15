import { HttpStatusCode } from "axios";
import { UserJoinRequestDto } from "../dto/user-join-request.dto";
import { UserRepository } from "../repository/user.repository";
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    createNickname(dto: UserJoinRequestDto): Promise<HttpStatusCode>;
}
