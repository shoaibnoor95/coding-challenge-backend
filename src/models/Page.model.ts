import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'

const db: Sequelize = sequelize()

interface Page extends Model {
    pageID: string;
    urlEndpoint: number;
    questionID: string[];
    conditional: string[] | null;
}

const PageModel = db.define<Page>('Pages', {
    pageID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    urlEndpoint: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    questionID: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    conditional: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    }
}, { timestamps: false });

export default PageModel;
