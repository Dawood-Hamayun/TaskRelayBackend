import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: SignupDto): Promise<{
        access_token: string;
    }>;
    login(body: LoginDto): Promise<{
        access_token: string;
    }>;
}
