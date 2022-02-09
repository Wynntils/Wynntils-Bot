import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'


@Entity()
export class Punishment extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    punishmentId: string ;

    @Column()
    type: string;

    @Column()
    user: string;

    @Column()
    moderator: string | undefined;

    @Column()
    reason: string;

}


