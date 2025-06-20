import { UserEntity } from "@/auth/models/user.entity.js";

export class UserAssembler {

    static toUser(resource){
        return new UserEntity(
            resource.data.id,
            resource.data.organization_id,
            resource.data.username,
            resource.data.email,
            resource.data.password_hash,
            resource.data.first_name,
            resource.data.last_name,
            resource.data.profile_image_url,
            resource.data.role,
            resource.data.created_at,
        );
    }

    static toUserPreview(resource) {
        return new UserEntity(
            resource.id,
            resource.organization_id,
            resource.username,
            resource.email,
            resource.password_hash,
            resource.first_name,
            resource.last_name,
            resource.profile_image_url,
            resource.role,
            resource.created_at,
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