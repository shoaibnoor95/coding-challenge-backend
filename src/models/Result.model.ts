import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'

const db: Sequelize = sequelize()

interface Result extends Model {
    resultID: string;
    SelectorID: string;
    questionaireID: string;
    resultSummary: any;
    createdAt: Date;
    updatedAt: Date;
}

const ResultModel = db.define<Result>('Results', {
    resultID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    SelectorID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    questionaireID: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    resultSummary: {
        type: DataTypes.JSONB
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { timestamps: true });

export default ResultModel;
