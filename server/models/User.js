import { hashPassword } from '../utils/helpers';
import models from './index';

const { Follower } = models;
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: '"username" length must be between 3 and 20 characters long'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: { msg: '"email" must be a valid email' } }
      },
      hash: { type: DataTypes.STRING, allowNull: false },
      bio: DataTypes.TEXT,
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      image: {
        type: DataTypes.STRING,
        validate: { isUrl: { msg: '"image" must be a valid URL' } }
      }
    },
    {}
  );
  User.beforeCreate(user => {
    if (user.changed('hash')) {
      user.hash = hashPassword(user.get('hash'));
    }
  });

  User.beforeUpdate(user => {
    if (user.changed('hash')) {
      user.hash = hashPassword(user.get('hash'));
    }
  });

  User.associate = model => {
    User.belongsToMany(model.User, {
      through: model.Follower,
      foreignKey: 'userId',
      as: 'followers'
    });

    User.belongsToMany(User, {
      through: model.Follower,
      foreignKey: 'followerId',
      as: 'following'
    });
  };

  return User;
};
