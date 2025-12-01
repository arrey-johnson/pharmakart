import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("../../entities").User[]>;
    findOne(id: string): Promise<import("../../entities").User | null>;
}
