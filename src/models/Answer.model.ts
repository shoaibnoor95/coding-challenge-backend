import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'

const db: Sequelize = sequelize()

interface Answer extends Model {
    answerID: string;
    value: string | null;
    questionID: string;
    conditional: boolean;
    creationTimestamp: Date;
    modifiedTimestamp: Date;
}

const AnswerModel = db.define<Answer>('Answers', {
    answerID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    questionID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    conditional: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

export default AnswerModel;
