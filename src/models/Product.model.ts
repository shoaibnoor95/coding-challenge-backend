import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'

const db: Sequelize = sequelize()

interface Product extends Model {
    productID: string;
    productName: string;
    pictureUrl: string;
    shortDescription: string;
    benefits: string;
    filterColor: string;
    filterSize: string;
    productType: 'Gift' | 'Household';
    price: number;
}

const ProductModel = db.define<Product>('Products', {
    productID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pictureUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shortDescription: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    benefits: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filterColor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filterSize: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productType: {
        type: DataTypes.ENUM('Gift', 'Household')
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
}, { timestamps: false });

export default ProductModel;
