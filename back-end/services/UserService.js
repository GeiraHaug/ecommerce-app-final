const { Op } = require('sequelize');

class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.Role = db.Role;
        this.Membership = db.Membership;
        this.Cart = db.Cart;
        this.Order = db.Order;
    }

    async createUser(firstName, lastName, username, email, password, salt, address, phone, roleId, membershipId) {
        return this.User.create({
            FirstName: firstName,
            LastName: lastName,
            Username: username,
            Email: email,
            Password: password,
            Salt: salt,
            Address: address,
            Phone: phone,
            RoleId: roleId,
            MembershipId: membershipId,
        });
    }

    async getAllUsers() {
        return this.User.findAll({
            attributes: { exclude: ['Password', 'Salt'] },
            include: [
                { model: this.Membership },
                { model: this.Cart },
                { model: this.Order },
                { model: this.Role },
            ],
        });
    }

    async updateUser(userId, updatedFields) {
        return this.User.update(updatedFields, {
            where: { Id: userId },
        });
    }

    async updateMembership(userId, membershipId) {
        return this.User.update(
            { MembershipId: membershipId },
            { where: { Id: userId } }
        );
    }

    async CheckUniqueUserNameAndEmail(username, email) {
        return this.User.findOne({
          where: {[Op.or]: [
            { Username: username }, 
            { Email: email }
        ]}
        });
    }
}

module.exports = UserService;