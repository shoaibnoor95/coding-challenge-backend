import * as pg from 'pg';
import { Sequelize } from 'sequelize';

let sequelize: Sequelize | null = null;

const initializeSequlize = (): Sequelize => {
    try {
        if (sequelize) {
            return sequelize;
        }

        sequelize = new Sequelize('postgres://postgres:shoaib@localhost:5432/postgres', {
            dialectModule: pg
        });
        sequelize.authenticate();
        return sequelize;
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
};

export default initializeSequlize;
