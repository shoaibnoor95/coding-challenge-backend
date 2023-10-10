import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'

const db: Sequelize = sequelize()

interface Questionaire extends Model {
    questionaireID: string;
    pageUrlEndpoint: number;
    selectorID: string;
    status: 'completed' | 'in-progress';
    creationTimestamp: Date;
    modifiedTimestamp: Date;
}

const QuestionaireModel = db.define<Questionaire>('Questionaires', {
    questionaireID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    pageUrlEndpoint: {
        type: DataTypes.DECIMAL,
        defaultValue: 1,
        allowNull: true,
    },
    selectorID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: { 
        type: DataTypes.ENUM('completed', 'in-progress'),
        allowNull: true
    },
    creationTimestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    modifiedTimestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, { timestamps: false });

export default QuestionaireModel;
