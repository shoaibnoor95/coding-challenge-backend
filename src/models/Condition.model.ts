import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'

const db: Sequelize = sequelize()

interface Condition extends Model {
    answerID: string;
    conditionID: string;
    urlEndPoint: number | null;
    questionID: string;
}

const ConditionModel = db.define<Condition>('Conditions', {
    answerID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    conditionID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    urlEndPoint: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    questionID: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, { timestamps: false });

export default ConditionModel;
