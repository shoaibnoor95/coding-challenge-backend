import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'

const db: Sequelize = sequelize()

interface Question extends Model {
    questionID: string;
    type: 'card' | 'sliders' | 'buttons';
    conditional: boolean;
    answerID: string[] | null;
    pageID: string;
    text: string;
}

const QuestionModel = db.define<Question>('Questions', {
    questionID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('card', 'sliders', 'buttons'),
        allowNull: false
    },
    conditional: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    answerID: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    pageID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    text: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false
});

export default QuestionModel;
