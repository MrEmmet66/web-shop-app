import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;
    
    @ApiProperty()
    password: string;

    @ApiProperty()
    phoneNumber?: string;
}