import { UserEntity } from "@/auth/models/user.entity.js";

export class UserAssembler {

    static toUser(resource){
        return new UserEntity(
            resource.data.id,
            resource.data.organizationId,
            resource.data.username,
            resource.data.email,
            resource.data.passwordHash,
            resource.data.firstName,
            resource.data.lastName,
            resource.data.profileImageUrl,
        );
    }

    static toUserPreview(resource) {
        return new UserEntity(
            resource.id,
            resource.organizationId,
            resource.username,
            resource.email,
            resource.passwordHash,
            resource.firstName,
            resource.lastName,
            resource.profileImageUrl,
        );
    }

    static fromUser(userEntity){
        return {
            id: userEntity.id,
            organization_id: userEntity.organizationId ,
            username: userEntity.username,
            email: userEntity.email,
            password_hash: userEntity.pwdHash,
            first_name: userEntity.firstname,
            last_name: userEntity.lastname,
            profile_image_url: userEntity.avatarUrl,
            role: userEntity.role,
            created_at: userEntity.createdAt,
        }
    }
}