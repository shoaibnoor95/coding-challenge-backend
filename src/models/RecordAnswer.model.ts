import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'

const db: Sequelize = sequelize()

interface RecordedAnswer extends Model {
    RAnswerID: string;
    questionaireID: string;
    questionID: string[];
    answer: string[] | null;
}

const RecordedAnswerModel = db.define<RecordedAnswer>('RecordAnswer', {
    RAnswerID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    questionaireID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    questionID: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
    },
    answer: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    }
}, { timestamps: false });

export default RecordedAnswerModel;
