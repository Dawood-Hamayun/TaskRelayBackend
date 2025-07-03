export declare class UpdateUserDto {
    email?: string;
    name?: string;
}
export declare class UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UpdateProfilePictureDto {
    avatar: string;
}
export declare class DeleteAccountDto {
    password: string;
}
