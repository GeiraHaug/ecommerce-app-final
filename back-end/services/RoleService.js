class RoleService {
    constructor(db) {
        this.client = db.sequelize;
        this.Role = db.Role;
        this.User = db.User;
    }

    async getAllRoles() {
        return this.Role.findAll();
    }
}

module.exports = RoleService;