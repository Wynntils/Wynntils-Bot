import { Entity, Column, BaseEntity, ObjectID, ObjectIdColumn } from 'typeorm'


@Entity('punishments')
export class Punishment extends BaseEntity {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    type: string;

    @Column()
    user: string;

    @Column()
    moderator: string | undefined;

    @Column({ default : 'No reason given' })
    reason: string;

    @Column()
    timestamp: number;

}

