import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class Strike extends BaseEntity {

    @PrimaryGeneratedColumn()
    punishmentId: string ;

    @Column()
    user: string;

    @Column()
    moderator: string | undefined;

    @Column()
    reason: string;

}