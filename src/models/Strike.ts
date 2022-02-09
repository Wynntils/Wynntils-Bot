import { Entity, ObjectID, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Strike {

    @PrimaryGeneratedColumn()
    punishmentId: string;

}