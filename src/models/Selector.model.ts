import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'

const db: Sequelize = sequelize()

interface Selector extends Model {
  selectorID: string;
  email: string;
  status: 'blocked' | 'active';
}

const SelectorModel = db.define < Selector > ('Selectors', {
  selectorID: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('blocked', 'active'),
    defaultValue: 'active'
  },
}, { timestamps: false });

export default SelectorModel;
