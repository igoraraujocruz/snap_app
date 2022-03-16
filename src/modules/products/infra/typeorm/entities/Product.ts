import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { User } from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    images: string;

    @Column()
    points: number;

    @Column()
    @Exclude()
    userId: string;

    @ManyToOne(() => User, {
        eager: true,
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Expose({ name: 'imageUrl' })
    getImagesUrl(): string | null {
        if (!this.images) {
            return null;
        }

        switch (uploadConfig.driver) {
            case 'disk':
                return `${process.env.APP_API_URL}/files/${this.images}`;
            case 's3':
                return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.images}`;
            default:
                return null;
        }
    }

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: Date;
}