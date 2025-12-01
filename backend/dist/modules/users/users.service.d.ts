import { Repository } from 'typeorm';
import { User } from '../../entities';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateData: Partial<User>): Promise<User | null>;
}
